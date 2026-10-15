import axiosClient from '../../../config/axiosClient.js';

export const getCompetition = async () => {
  return await axiosClient.get('/competition');
};

export default {
  getCompetition,
};
