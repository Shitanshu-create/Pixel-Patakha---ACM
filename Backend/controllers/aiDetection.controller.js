import aiDetectionService from '../services/aiDetection.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/ApiError.js';

export const rerunSubmissionScan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { force } = req.body || {};

  const updatedSubmission = await aiDetectionService.rerunSubmission(id, Boolean(force));
  if (!updatedSubmission) {
    throw new ApiError(404, 'Submission not found');
  }

  return apiResponse(res, 200, 'AI scan enqueued successfully', updatedSubmission);
});

export const getAiDetectionStatus = asyncHandler(async (req, res) => {
  const status = await aiDetectionService.getStatus();
  return apiResponse(res, 200, 'AI detection status fetched successfully', status);
});

export default {
  rerunSubmissionScan,
  getAiDetectionStatus,
};
