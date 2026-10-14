import Review from '../models/Review.model.js';
import Submission from '../models/Submission.model.js';
import ApiError from '../utils/ApiError.js';

export const createOrUpdateReview = async ({ judgeId, submissionId, score, feedback }) => {
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new ApiError(404, 'Submission not found');
  }

  const numericScore = Number(score);
  if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
    throw new ApiError(400, 'Score must be a number between 0 and 100');
  }

  if (!feedback || typeof feedback !== 'string' || feedback.trim() === '') {
    throw new ApiError(400, 'Feedback is required');
  }

  let review = await Review.findOne({ submission: submissionId, judge: judgeId });
  let isUpdate = false;

  if (review) {
    review.score = numericScore;
    review.feedback = feedback.trim();
    await review.save();
    isUpdate = true;
  } else {
    review = await Review.create({
      submission: submissionId,
      judge: judgeId,
      score: numericScore,
      feedback: feedback.trim(),
    });
  }

  return { review, isUpdate };
};

export const getReviewsByJudge = async (judgeId) => {
  const reviews = await Review.find({ judge: judgeId })
    .populate('submission', 'title teamName submittedAt')
    .sort({ createdAt: -1 });

  return reviews;
};

export default {
  createOrUpdateReview,
  getReviewsByJudge,
};
