import authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';

export const registerTeam = asyncHandler(async (req, res) => {
  const result = await authService.registerTeam(req.body);
  return apiResponse(res, 201, 'Team registered successfully', result);
});

export const loginTeam = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginTeam({ email, password });
  return apiResponse(res, 200, 'Team logged in successfully', result);
});

export const loginStaff = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginStaff({ email, password });
  return apiResponse(res, 200, 'Staff logged in successfully', result);
});

export const getMe = asyncHandler(async (req, res) => {
  const account = await authService.getMe(req.user.id, req.user.role);
  return apiResponse(res, 200, 'Account details fetched successfully', account);
});

export default {
  registerTeam,
  loginTeam,
  loginStaff,
  getMe,
};
