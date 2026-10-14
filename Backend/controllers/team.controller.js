import teamService from '../services/team.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';

export const getMyTeamProfile = asyncHandler(async (req, res) => {
  const profile = await teamService.getTeamProfile(req.user.id);
  return apiResponse(res, 200, 'Team profile fetched successfully', profile);
});

export default {
  getMyTeamProfile,
};
