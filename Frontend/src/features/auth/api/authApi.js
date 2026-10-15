import axiosClient from '../../../config/axiosClient.js';

export const registerTeam = async (data) => {
  return await axiosClient.post('/auth/team/register', data);
};

export const loginTeam = async (credentials) => {
  return await axiosClient.post('/auth/team/login', credentials);
};

export const loginStaff = async (credentials) => {
  return await axiosClient.post('/auth/staff/login', credentials);
};

export const getMe = async () => {
  return await axiosClient.get('/auth/me');
};

export default {
  registerTeam,
  loginTeam,
  loginStaff,
  getMe,
};
