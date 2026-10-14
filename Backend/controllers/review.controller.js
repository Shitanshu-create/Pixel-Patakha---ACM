import reviewService from '../services/review.service.js';
import submissionService from '../services/submission.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';

export const getSubmissionsForJudge = asyncHandler(async (req, res) => {
  const submissions = await submissionService.getJudgeSubmissions(req.user.id);
  return apiResponse(res, 200, 'Submissions fetched successfully', submissions);
});

export const getSubmissionDetailsForJudge = asyncHandler(async (req, res) => {
  const submission = await submissionService.getSubmissionById(req.params.id);
  return apiResponse(res, 200, 'Submission details fetched successfully', submission);
});

export const submitReview = asyncHandler(async (req, res) => {
  const { score, feedback } = req.body;
  const { review, isUpdate } = await reviewService.createOrUpdateReview({
    judgeId: req.user.id,
    submissionId: req.params.id,
    score,
    feedback,
  });

  const statusCode = isUpdate ? 200 : 201;
  const message = isUpdate ? 'Review updated successfully' : 'Review submitted successfully';
  return apiResponse(res, statusCode, message, review);
});

export const getJudgeReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getReviewsByJudge(req.user.id);
  return apiResponse(res, 200, 'Judge reviews fetched successfully', reviews);
});

export default {
  getSubmissionsForJudge,
  getSubmissionDetailsForJudge,
  submitReview,
  getJudgeReviews,
};
