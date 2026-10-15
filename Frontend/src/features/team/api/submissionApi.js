import axiosClient from '../../../config/axiosClient.js';

export const createSubmission = async ({ title, description, files = [] }) => {
  const formData = new FormData();
  formData.append('title', title);
  if (description) {
    formData.append('description', description);
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
