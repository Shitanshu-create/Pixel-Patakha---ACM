import axiosClient from '../../../config/axiosClient.js';

export const createSubmission = async ({ title, description, workLinks, files = [] }) => {
  const formData = new FormData();
  formData.append('title', title);
  if (description) {
    formData.append('description', description);
  }
  if (workLinks) {
    formData.append('workLinks', workLinks);
  }
  files.forEach((file) => {
    formData.append('designs', file);
  });

  return await axiosClient.post('/submissions', formData);
};

export const getMySubmission = async () => {
  return await axiosClient.get('/submissions/me');
};

export default {
  createSubmission,
  getMySubmission,
};
