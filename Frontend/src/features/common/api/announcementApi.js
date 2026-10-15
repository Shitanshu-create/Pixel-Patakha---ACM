import axiosClient from '../../../config/axiosClient.js';

export const getAnnouncements = async () => {
  return await axiosClient.get('/announcements');
};

export default {
  getAnnouncements,
};
