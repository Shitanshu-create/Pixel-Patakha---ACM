import Competition from '../models/Competition.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getCompetitionSettings = async () => {
  let competition = await Competition.findOne();
  if (!competition) {
    competition = await Competition.create({});
  }
  return competition;
};

export const checkRegistrationOpen = asyncHandler(async (req, res, next) => {
  const competition = await getCompetitionSettings();

  if (!competition.registrationOpen) {
    return next(new ApiError(403, 'Team registration is currently closed'));
  }

  if (competition.registrationDeadline && new Date() > new Date(competition.registrationDeadline)) {
    return next(new ApiError(403, 'Team registration deadline has passed'));
  }

  next();
});

export const checkSubmissionOpen = asyncHandler(async (req, res, next) => {
  const competition = await getCompetitionSettings();

  if (!competition.submissionOpen) {
    return next(new ApiError(403, 'Design submissions are currently closed'));
  }

  if (competition.submissionDeadline && new Date() > new Date(competition.submissionDeadline)) {
    return next(new ApiError(403, 'Design submission deadline has passed'));
  }

  next();
});

export default {
  checkRegistrationOpen,
  checkSubmissionOpen,
  getCompetitionSettings,
};
