import mongoose from 'mongoose';

const aiDetectionFileSchema = new mongoose.Schema(
  {
    provider: { type: String, default: 'sightengine' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'scanning', 'done', 'completed', 'skipped', 'failed'],
      default: 'pending',
    },
    score: { type: Number, min: 0, max: 1 },
    percent: { type: Number, min: 0, max: 100 },
    level: { type: String, enum: ['low', 'medium', 'review', 'high', 'unknown'] },
    topGenerator: {
      name: String,
      percent: Number,
    },
    operations: Number,
    requestId: String,
    attempts: { type: Number, default: 0 },
    nextAttemptAt: Date,
    startedAt: Date,
    checkedAt: Date,
    reason: String,
  },
  { _id: false }
);

const submissionFileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    aiDetection: {
      type: aiDetectionFileSchema,
      default: () => ({ status: 'pending' }),
    },
  },
  { _id: false }
);

const aiDetectionSummarySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'processing', 'scanning', 'partial', 'done', 'completed', 'skipped', 'failed'],
      default: 'pending',
    },
    maxPercent: Number,
    avgPercent: Number,
    overallLikelihood: Number,
    highRiskCount: Number,
    level: { type: String, enum: ['low', 'medium', 'review', 'high', 'unknown'] },
    scannedFiles: Number,
    totalFiles: Number,
    checkedAt: Date,
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
      unique: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    files: {
      type: [submissionFileSchema],
      required: true,
      validate: [(val) => val.length > 0, 'At least one file is required'],
    },
    aiDetectionSummary: {
      type: aiDetectionSummarySchema,
      default: () => ({ status: 'pending' }),
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ 'files.aiDetection.status': 1, submittedAt: 1 });

export default mongoose.model('Submission', submissionSchema);
