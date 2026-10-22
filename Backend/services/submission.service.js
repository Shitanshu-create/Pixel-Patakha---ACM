import Submission from '../models/Submission.model.js';
import Team from '../models/Team.model.js';
import Review from '../models/Review.model.js';
import ApiError from '../utils/ApiError.js';
import { uploadSubmissionFile } from './storage.service.js';

export const createSubmission = async ({ teamId, title, description, workLinks, uploadedFiles, reqProtocol, reqHost }) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new ApiError(404, 'Team not found');
  }

  const existingSubmission = await Submission.findOne({ team: teamId });
  if (existingSubmission) {
    throw new ApiError(409, 'Team has already submitted a design');
  }

  if (!uploadedFiles || uploadedFiles.length === 0) {
    throw new ApiError(400, 'Please upload at least one design file (PNG, JPG, WEBP, or PDF)');
  }

  const files = await Promise.all(
    uploadedFiles.map(async (file, idx) => {
      const isImage = file.mimetype && file.mimetype.startsWith('image/');
      const isPdf = file.mimetype === 'application/pdf';
      let status = 'skipped';
      let reason = null;

      if (isPdf) {
        status = 'skipped';
        reason = 'pdf_not_supported';
      } else if (isImage) {
        status = idx < 5 ? 'pending' : 'skipped';
        if (status === 'skipped') reason = 'file_limit_exceeded';
      } else {
        status = 'skipped';
        reason = 'unsupported_type';
      }

      const uploaded = await uploadSubmissionFile({ file, reqProtocol, reqHost });

      return {
        originalName: uploaded.originalName,
        filename: uploaded.filename,
        url: uploaded.url,
        mimeType: uploaded.mimeType,
        size: uploaded.size,
        aiDetection: {
          status,
          reason,
          attempts: 0,
        },
      };
    })
  );

  const submission = await Submission.create({
    team: team._id,
    teamName: team.teamName,
    title: title.trim(),
    description: description ? description.trim() : '',
    workLinks: workLinks ? workLinks.trim() : '',
    files,
    submittedAt: new Date(),
    aiDetectionSummary: {
      status: 'pending',
      maxPercent: null,
      avgPercent: null,
      overallLikelihood: null,
      level: 'unknown',
      scannedFiles: 0,
      totalFiles: files.length,
      highRiskCount: 0,
    },
  });

  return submission;
};

export const getMySubmission = async (teamId) => {
  const submission = await Submission.findOne({ team: teamId }).lean();
  if (!submission) {
    throw new ApiError(404, 'No submission found for this team');
  }

  // Strip AI detection fields from team response
  if (submission.aiDetectionSummary) {
    delete submission.aiDetectionSummary;
  }
  if (Array.isArray(submission.files)) {
    submission.files = submission.files.map((file) => {
      const { aiDetection, ...rest } = file;
      return rest;
    });
  }

  return submission;
};

export const getSubmissionById = async (id) => {
  const submission = await Submission.findById(id);
  if (!submission) {
    throw new ApiError(404, 'Submission not found');
  }
  return submission;
};

export const getJudgeSubmissions = async (judgeId) => {
  const [submissions, judgeReviews] = await Promise.all([
    Submission.find().sort({ submittedAt: -1 }),
    Review.find({ judge: judgeId }).select('submission score'),
  ]);

  const reviewedMap = new Map();
  judgeReviews.forEach((rev) => {
    reviewedMap.set(rev.submission.toString(), rev.score);
  });

  return submissions.map((sub) => {
    const subObj = sub.toObject();
    const hasReviewed = reviewedMap.has(sub._id.toString());
    return {
      ...subObj,
      hasReviewed,
      judgeScore: hasReviewed ? reviewedMap.get(sub._id.toString()) : null,
    };
  });
};

export const getAdminSubmissions = async () => {
  const submissions = await Submission.find().sort({ submittedAt: -1 }).lean();
  const reviews = await Review.find().lean();

  const reviewsBySub = {};
  reviews.forEach((r) => {
    const subId = r.submission.toString();
    if (!reviewsBySub[subId]) reviewsBySub[subId] = [];
    reviewsBySub[subId].push(r.score);
  });

  return submissions.map((sub) => {
    const scores = reviewsBySub[sub._id.toString()] || [];
    const averageScore = scores.length > 0 ? +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : null;
    return {
      ...sub,
      reviewCount: scores.length,
      averageScore,
    };
  });
};

export const getAdminSubmissionWithReviews = async (submissionId) => {
  const submission = await Submission.findById(submissionId).lean();
  if (!submission) {
    throw new ApiError(404, 'Submission not found');
  }

  const reviews = await Review.find({ submission: submissionId })
    .populate('judge', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  const scores = reviews.map((r) => r.score);
  const averageScore = scores.length > 0 ? +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : null;

  return {
    ...submission,
    averageScore,
    reviews,
  };
};

export default {
  createSubmission,
  getMySubmission,
  getSubmissionById,
  getJudgeSubmissions,
  getAdminSubmissions,
  getAdminSubmissionWithReviews,
};
