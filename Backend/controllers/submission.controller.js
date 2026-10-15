import fs from 'fs';
import submissionService from '../services/submission.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/ApiError.js';

export const createSubmission = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const uploadedFiles = req.files || [];

  const cleanupFiles = () => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      uploadedFiles.forEach((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch {
          // ignore unlink error
        }
      });
    }
  };

  if (!title || title.trim() === '') {
    cleanupFiles();
    throw new ApiError(400, 'Submission title is required');
  }

  if (!uploadedFiles || uploadedFiles.length === 0) {
    throw new ApiError(400, 'Please upload at least one design file under the "designs" field');
  }

  try {
    const submission = await submissionService.createSubmission({
      teamId: req.user.id,
      title,
      description,
      uploadedFiles,
      reqProtocol: req.protocol,
      reqHost: req.get('host'),
    });

    return apiResponse(res, 201, 'Design submitted successfully', submission);
  } catch (err) {
    cleanupFiles();
    throw err;
  }
});

export const getMySubmission = asyncHandler(async (req, res) => {
  const submission = await submissionService.getMySubmission(req.user.id);
  return apiResponse(res, 200, 'Team submission fetched successfully', submission);
});

export default {
  createSubmission,
  getMySubmission,
};
