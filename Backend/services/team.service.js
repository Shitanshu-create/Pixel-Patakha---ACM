import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Team from '../models/Team.model.js';
import Submission from '../models/Submission.model.js';
import Review from '../models/Review.model.js';
import ApiError from '../utils/ApiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getTeamProfile = async (teamId) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new ApiError(404, 'Team not found');
  }

  const submission = await Submission.findOne({ team: teamId });

  return {
    team,
    submission: submission || null,
  };
};

export const listTeams = async ({ page = 1, limit = 10, search = '' }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;

  const query = {};
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { teamName: searchRegex },
      { leaderEmail: searchRegex },
      { college: searchRegex },
    ];
  }

  const [teams, total] = await Promise.all([
    Team.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Team.countDocuments(query),
  ]);

  return {
    teams,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
};

export const getTeamDetails = async (teamId) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new ApiError(404, 'Team not found');
  }

  const submission = await Submission.findOne({ team: teamId });

  return {
    team,
    submission: submission || null,
  };
};

export const deleteTeam = async (teamId) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new ApiError(404, 'Team not found');
  }

  const submission = await Submission.findOne({ team: teamId });
  if (submission) {
    if (submission.files && Array.isArray(submission.files)) {
      submission.files.forEach((file) => {
        if (file.filename) {
          const filePath = path.resolve(__dirname, '../uploads', file.filename);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (err) {
              console.warn('Error deleting submission file:', err.message);
            }
          }
        }
      });
    }

    await Review.deleteMany({ submission: submission._id });
    await Submission.findByIdAndDelete(submission._id);
  }

  await Team.findByIdAndDelete(teamId);

  return { message: 'Team and associated submissions/reviews deleted successfully' };
};

export default {
  getTeamProfile,
  listTeams,
  getTeamDetails,
  deleteTeam,
};
