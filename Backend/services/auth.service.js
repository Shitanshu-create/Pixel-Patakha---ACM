import Team from '../models/Team.model.js';
import User from '../models/User.model.js';
import ApiError from '../utils/ApiError.js';
import generateToken from '../utils/generateToken.js';
import { minTeamSize, maxTeamSize } from '../config/env.js';

export const registerTeam = async ({ teamName, leaderEmail, password, college, members }) => {
  if (!members || !Array.isArray(members)) {
    throw new ApiError(400, 'Team members list is required');
  }

  if (members.length < minTeamSize || members.length > maxTeamSize) {
    throw new ApiError(
      400,
      `Team must have between ${minTeamSize} and ${maxTeamSize} members`
    );
  }

  const normalizedLeaderEmail = leaderEmail.toLowerCase().trim();

  // Check unique constraints
  const existingTeam = await Team.findOne({
    $or: [{ teamName: teamName.trim() }, { leaderEmail: normalizedLeaderEmail }],
  });

  if (existingTeam) {
    if (existingTeam.teamName.toLowerCase() === teamName.trim().toLowerCase()) {
      throw new ApiError(409, `Team name "${teamName}" is already taken`);
    }
    throw new ApiError(409, `Leader email "${leaderEmail}" is already registered`);
  }

  // Ensure leader email matches first member's email or sets it
  if (members.length > 0 && (!members[0].email || members[0].email.toLowerCase() !== normalizedLeaderEmail)) {
    members[0].email = normalizedLeaderEmail;
  }

  const team = await Team.create({
    teamName: teamName.trim(),
    leaderEmail: normalizedLeaderEmail,
    password,
    college: college.trim(),
    members,
    role: 'team',
  });

  const token = generateToken({ id: team._id, role: team.role });

  const safeTeam = team.toObject();
  delete safeTeam.password;

  return { team: safeTeam, token };
};

export const loginTeam = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const team = await Team.findOne({ leaderEmail: normalizedEmail }).select('+password');

  if (!team || !(await team.matchPassword(password))) {
    throw new ApiError(401, 'Invalid leader email or password');
  }

  const token = generateToken({ id: team._id, role: team.role });

  const safeTeam = team.toObject();
  delete safeTeam.password;

  return { team: safeTeam, token };
};

export const loginStaff = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken({ id: user._id, role: user.role });

  const safeUser = user.toObject();
  delete safeUser.password;

  return { user: safeUser, token };
};

export const getMe = async (id, role) => {
  if (role === 'team') {
    const team = await Team.findById(id);
    if (!team) throw new ApiError(404, 'Team not found');
    return team;
  }

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export default {
  registerTeam,
  loginTeam,
  loginStaff,
  getMe,
};
