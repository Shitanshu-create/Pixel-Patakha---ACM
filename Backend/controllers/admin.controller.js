import Competition from '../models/Competition.model.js';
import User from '../models/User.model.js';
import teamService from '../services/team.service.js';
import submissionService from '../services/submission.service.js';
import cacheService from '../services/cache.service.js';
import { COMPETITION_CACHE_KEY } from './competition.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/ApiError.js';

export const updateCompetition = asyncHandler(async (req, res) => {
  let competition = await Competition.findOne();
  if (!competition) {
    competition = new Competition(req.body);
  } else {
    Object.assign(competition, req.body);
  }

  await competition.save();
  await cacheService.del(COMPETITION_CACHE_KEY);

  return apiResponse(res, 200, 'Competition settings updated successfully', competition);
});

export const getTeams = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const result = await teamService.listTeams({ page, limit, search });
  return apiResponse(res, 200, 'Teams fetched successfully', result);
});

export const getTeamById = asyncHandler(async (req, res) => {
  const result = await teamService.getTeamDetails(req.params.id);
  return apiResponse(res, 200, 'Team details fetched successfully', result);
});

export const deleteTeam = asyncHandler(async (req, res) => {
  const result = await teamService.deleteTeam(req.params.id);
  return apiResponse(res, 200, result.message);
});

export const createJudge = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, `User with email "${email}" already exists`);
  }

  const judge = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'judge',
  });

  const safeJudge = judge.toObject();
  delete safeJudge.password;

  return apiResponse(res, 201, 'Judge account created successfully', safeJudge);
});

export const getJudges = asyncHandler(async (req, res) => {
  const judges = await User.find({ role: 'judge' }).select('-password').sort({ createdAt: -1 });
  return apiResponse(res, 200, 'Judges fetched successfully', judges);
});

export const getSubmissions = asyncHandler(async (req, res) => {
  const submissions = await submissionService.getAdminSubmissions();
  return apiResponse(res, 200, 'All submissions fetched successfully', submissions);
});

export const getSubmissionDetails = asyncHandler(async (req, res) => {
  const submission = await submissionService.getAdminSubmissionWithReviews(req.params.id);
  return apiResponse(res, 200, 'Submission details with reviews fetched successfully', submission);
});

export default {
  updateCompetition,
  getTeams,
  getTeamById,
  deleteTeam,
  createJudge,
  getJudges,
  getSubmissions,
  getSubmissionDetails,
};
