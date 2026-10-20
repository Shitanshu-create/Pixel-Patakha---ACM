import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Submission from '../models/Submission.model.js';
import sightengineService from './sightengine.service.js';
import aiBudget from './aiBudget.service.js';
import { getFileBuffer } from './storage.service.js';
import { toPercent, levelFromPercent, topGenerator } from '../utils/aiScore.js';
import {
  aiDetectionEnabled,
  sightengineMaxAttempts,
  aiLevelReviewMin,
  aiLevelHighMin,
} from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../uploads');

let isWorkerRunning = false;
let sweepInterval = null;
let circuitBreaker = {
  open: false,
  reason: null,
};
let pauseUntil = null;

const recomputeSummary = async (submissionId) => {
  const sub = await Submission.findById(submissionId);
  if (!sub || !sub.files) return;

  const totalFiles = sub.files.length;
  const imageFiles = sub.files.filter((f) => f.aiDetection?.status !== 'skipped');
  const scanned = imageFiles.filter((f) => f.aiDetection?.status === 'done');
  const failed = imageFiles.filter((f) => f.aiDetection?.status === 'failed');
  const pending = imageFiles.filter(
    (f) => f.aiDetection?.status === 'pending' || f.aiDetection?.status === 'processing'
  );

  let status = 'pending';
  if (pending.length > 0) {
    status = scanned.length > 0 ? 'partial' : 'pending';
  } else if (scanned.length > 0) {
    status = 'done';
  } else if (failed.length > 0) {
    status = 'failed';
  } else {
    status = 'skipped';
  }

  let maxPercent = null;
  let avgPercent = null;
  let level = null;

  if (scanned.length > 0) {
    const percentages = scanned.map((f) => f.aiDetection.percent ?? 0);
    maxPercent = Math.max(...percentages);
    avgPercent = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);
    level = levelFromPercent(maxPercent);
  }

  sub.aiDetectionSummary = {
    status,
    maxPercent,
    avgPercent,
    overallLikelihood: maxPercent,
    level: level || 'unknown',
    scannedFiles: scanned.length,
    totalFiles,
    highRiskCount: scanned.filter((f) => f.aiDetection.level === 'high').length,
    checkedAt: new Date(),
  };

  await sub.save();
};

const tick = async () => {
  if (isWorkerRunning) return;
  if (!aiDetectionEnabled) return;

  if (circuitBreaker.open) return;
  if (pauseUntil && Date.now() < pauseUntil) return;

  const spendCheck = await aiBudget.canSpend();
  if (!spendCheck.allowed) return;

  isWorkerRunning = true;

  try {
    const candidateSubmissions = await Submission.find({
      'files.aiDetection.status': 'pending',
      $or: [
        { 'files.aiDetection.nextAttemptAt': { $exists: false } },
        { 'files.aiDetection.nextAttemptAt': null },
        { 'files.aiDetection.nextAttemptAt': { $lte: new Date() } },
      ],
    }).sort({ submittedAt: 1 });

    if (!candidateSubmissions || candidateSubmissions.length === 0) {
      return;
    }

    let claimedTarget = null;

    for (const sub of candidateSubmissions) {
      for (const file of sub.files) {
        if (
          file.aiDetection?.status === 'pending' &&
          (!file.aiDetection?.nextAttemptAt || file.aiDetection?.nextAttemptAt <= new Date())
        ) {
          const result = await Submission.updateOne(
            {
              _id: sub._id,
              files: {
                $elemMatch: {
                  filename: file.filename,
                  'aiDetection.status': 'pending',
                },
              },
            },
            {
              $set: {
                'files.$.aiDetection.status': 'processing',
                'files.$.aiDetection.startedAt': new Date(),
              },
              $inc: {
                'files.$.aiDetection.attempts': 1,
              },
            }
          );

          if (result.modifiedCount === 1) {
            claimedTarget = {
              submissionId: sub._id,
              filename: file.filename,
              url: file.url,
              mimeType: file.mimeType,
              originalName: file.originalName,
              attempts: (file.aiDetection?.attempts || 0) + 1,
            };
            break;
          }
        }
      }
      if (claimedTarget) break;
    }

    if (!claimedTarget) return;

    await aiBudget.waitTurn();

    const fileBuffer = await getFileBuffer(claimedTarget.filename, claimedTarget.url);
    if (!fileBuffer) {
      await Submission.updateOne(
        { _id: claimedTarget.submissionId, 'files.filename': claimedTarget.filename },
        {
          $set: {
            'files.$.aiDetection.status': 'skipped',
            'files.$.aiDetection.reason': 'file_missing',
            'files.$.aiDetection.checkedAt': new Date(),
          },
        }
      );
      await recomputeSummary(claimedTarget.submissionId);
      return;
    }
    const checkResult = await sightengineService.check(
      fileBuffer,
      claimedTarget.mimeType,
      claimedTarget.originalName
    );

    if (checkResult.type === 'ok') {
      const percent = toPercent(checkResult.score);
      const level = levelFromPercent(percent);
      const topGen = topGenerator(checkResult.generators);

      await Submission.updateOne(
        { _id: claimedTarget.submissionId, 'files.filename': claimedTarget.filename },
        {
          $set: {
            'files.$.aiDetection.status': 'done',
            'files.$.aiDetection.score': checkResult.score,
            'files.$.aiDetection.percent': percent,
            'files.$.aiDetection.level': level,
            'files.$.aiDetection.topGenerator': topGen,
            'files.$.aiDetection.operations': checkResult.operations,
            'files.$.aiDetection.requestId': checkResult.requestId,
            'files.$.aiDetection.checkedAt': new Date(),
          },
        }
      );

      await aiBudget.record(checkResult.operations);
      await recomputeSummary(claimedTarget.submissionId);
    } else if (checkResult.type === 'usageLimit') {
      pauseUntil = Date.now() + 60 * 60 * 1000;
      await Submission.updateOne(
        { _id: claimedTarget.submissionId, 'files.filename': claimedTarget.filename },
        {
          $set: {
            'files.$.aiDetection.status': 'pending',
            'files.$.aiDetection.reason': checkResult.error,
          },
        }
      );
    } else if (checkResult.type === 'credentials') {
      circuitBreaker.open = true;
      circuitBreaker.reason = checkResult.error;
      console.error(`Sightengine circuit breaker activated: ${checkResult.error}`);

      await Submission.updateOne(
        { _id: claimedTarget.submissionId, 'files.filename': claimedTarget.filename },
        {
          $set: {
            'files.$.aiDetection.status': 'failed',
            'files.$.aiDetection.reason': checkResult.error,
          },
        }
      );
      await recomputeSummary(claimedTarget.submissionId);
    } else if (checkResult.type === 'fatal') {
      await Submission.updateOne(
        { _id: claimedTarget.submissionId, 'files.filename': claimedTarget.filename },
        {
          $set: {
            'files.$.aiDetection.status': 'failed',
            'files.$.aiDetection.reason': checkResult.error,
            'files.$.aiDetection.checkedAt': new Date(),
          },
        }
      );
      await recomputeSummary(claimedTarget.submissionId);
    } else {
      // Retryable
      if (claimedTarget.attempts >= sightengineMaxAttempts) {
        await Submission.updateOne(
          { _id: claimedTarget.submissionId, 'files.filename': claimedTarget.filename },
          {
            $set: {
              'files.$.aiDetection.status': 'failed',
              'files.$.aiDetection.reason': `Max attempts exceeded: ${checkResult.error}`,
              'files.$.aiDetection.checkedAt': new Date(),
            },
          }
        );
      } else {
        const backoffMs =
          claimedTarget.attempts === 1
            ? 30 * 1000
            : claimedTarget.attempts === 2
            ? 120 * 1000
            : 600 * 1000;

        await Submission.updateOne(
          { _id: claimedTarget.submissionId, 'files.filename': claimedTarget.filename },
          {
            $set: {
              'files.$.aiDetection.status': 'pending',
              'files.$.aiDetection.nextAttemptAt': new Date(Date.now() + backoffMs),
              'files.$.aiDetection.reason': checkResult.error,
            },
          }
        );
      }
      await recomputeSummary(claimedTarget.submissionId);
    }
  } catch (err) {
    console.error('AI Detection worker tick error:', err.message);
  } finally {
    isWorkerRunning = false;
  }
};

export const enqueue = async (submissionId) => {
  if (!aiDetectionEnabled) return;
  setImmediate(() => {
    tick().catch(() => {});
  });
};

export const rerunSubmission = async (submissionId, force = false) => {
  const sub = await Submission.findById(submissionId);
  if (!sub) return null;

  for (const file of sub.files) {
    const isImage = file.mimeType?.startsWith('image/') || /\.(png|jpg|jpeg|webp)$/i.test(file.filename);
    if (!isImage) continue;

    if (force || file.aiDetection?.status !== 'done') {
      file.aiDetection = {
        provider: 'sightengine',
        status: 'pending',
        attempts: 0,
        nextAttemptAt: null,
      };
    }
  }

  await sub.save();
  await recomputeSummary(submissionId);

  // Reset circuit breaker on manual admin re-run
  circuitBreaker.open = false;
  circuitBreaker.reason = null;
  pauseUntil = null;

  enqueue(submissionId);
  return await Submission.findById(submissionId);
};

export const getStatus = async () => {
  const usageStats = await aiBudget.usage();

  const [pending, processing, failed] = await Promise.all([
    Submission.countDocuments({ 'files.aiDetection.status': 'pending' }),
    Submission.countDocuments({ 'files.aiDetection.status': 'processing' }),
    Submission.countDocuments({ 'files.aiDetection.status': 'failed' }),
  ]);

  return {
    enabled: aiDetectionEnabled,
    circuit: circuitBreaker.open ? 'open' : 'closed',
    circuitReason: circuitBreaker.reason,
    pausedUntil: pauseUntil ? new Date(pauseUntil).toISOString() : null,
    usage: usageStats,
    queue: {
      pending,
      processing,
      failed,
    },
    thresholds: {
      reviewMin: aiLevelReviewMin,
      highMin: aiLevelHighMin,
    },
  };
};

const sweep = async () => {
  try {
    // Reclaim stuck processing files older than 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    await Submission.updateMany(
      {
        files: {
          $elemMatch: {
            'aiDetection.status': 'processing',
            'aiDetection.startedAt': { $lte: fiveMinutesAgo },
          },
        },
      },
      {
        $set: {
          'files.$[elem].aiDetection.status': 'pending',
        },
      },
      {
        arrayFilters: [
          {
            'elem.aiDetection.status': 'processing',
            'elem.aiDetection.startedAt': { $lte: fiveMinutesAgo },
          },
        ],
      }
    );

    await tick();
  } catch (err) {
    console.warn('AI Detection sweep error:', err.message);
  }
};

export const start = () => {
  if (!aiDetectionEnabled) {
    console.log('AI image detection is disabled or unconfigured.');
    return;
  }
  console.log('Starting AI image detection worker & scheduler...');
  sweep();
  sweepInterval = setInterval(sweep, 60 * 1000);
};

export const stop = () => {
  if (sweepInterval) {
    clearInterval(sweepInterval);
    sweepInterval = null;
  }
};

export default {
  enqueue,
  rerunSubmission,
  getStatus,
  start,
  stop,
};
