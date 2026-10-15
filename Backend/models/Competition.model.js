import mongoose from 'mongoose';

const competitionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main',
      unique: true,
      index: true,
    },
    name: {
      type: String,
      default: 'PIXEL PATAKHA',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Ignite Your Design Spark',
      trim: true,
    },
    description: {
      type: String,
      default: 'ACM Pixel Patakha - The Ultimate Design Competition',
      trim: true,
    },
    venue: {
      type: String,
      default: 'B404, Main Auditorium / Online',
      trim: true,
    },
    rules: {
      type: [String],
      default: [
        'Each team must consist of 1-3 members.',
        'Submissions must be original designs in PNG, JPG, WEBP, or PDF format.',
        'Only one submission per team is permitted.',
        'Deadlines are strictly enforced.',
      ],
    },
    eventDate: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    registrationDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    submissionOpen: {
      type: Boolean,
      default: false,
    },
    submissionDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Competition', competitionSchema);
