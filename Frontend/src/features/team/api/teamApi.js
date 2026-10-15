import axiosClient from '../../../config/axiosClient.js';

export const getTeamProfile = async () => {
  return await axiosClient.get('/team/me');
};

export default {
  getTeamProfile,
};
