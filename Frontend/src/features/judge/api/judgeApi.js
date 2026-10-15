import axiosClient from '../../../config/axiosClient.js';

export const getSubmissions = async () => {
  return await axiosClient.get('/judge/submissions');
};

export const getSubmissionById = async (id) => {
  return await axiosClient.get(`/judge/submissions/${id}`);
};

export const submitReview = async (id, { score, feedback }) => {
  return await axiosClient.post(`/judge/submissions/${id}/review`, {
    score: Number(score),
    feedback,
  });
};

export const getReviews = async () => {
  return await axiosClient.get('/judge/reviews');
};

export default {
  getSubmissions,
  getSubmissionById,
  submitReview,
  getReviews,
};
