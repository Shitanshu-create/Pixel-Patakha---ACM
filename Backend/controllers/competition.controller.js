import Competition from '../models/Competition.model.js';
import cacheService from '../services/cache.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';

export const COMPETITION_CACHE_KEY = 'cache:competition';

export const getCompetition = asyncHandler(async (req, res) => {
  const cached = await cacheService.get(COMPETITION_CACHE_KEY);
  if (cached) {
    return apiResponse(res, 200, 'Competition details fetched successfully (cached)', cached);
  }

  let competition = await Competition.findOne();
  if (!competition) {
    competition = await Competition.create({});
  }

  await cacheService.set(COMPETITION_CACHE_KEY, competition, 3600);

  return apiResponse(res, 200, 'Competition details fetched successfully', competition);
});

export default {
  getCompetition,
  COMPETITION_CACHE_KEY,
};
