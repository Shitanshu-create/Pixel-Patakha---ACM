import axiosClient from '../../../config/axiosClient.js';

export const updateCompetition = async (data) => {
  return await axiosClient.put('/admin/competition', data);
};

export const getTeams = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const params = new URLSearchParams();
  if (page) params.set('page', page);
  if (limit) params.set('limit', limit);
  if (search) params.set('search', search);

  return await axiosClient.get(`/admin/teams?${params.toString()}`);
};

export const getTeamById = async (id) => {
  return await axiosClient.get(`/admin/teams/${id}`);
};

export const deleteTeam = async (id) => {
  return await axiosClient.delete(`/admin/teams/${id}`);
};

export const getJudges = async () => {
  return await axiosClient.get('/admin/judges');
};

export const createJudge = async (judgeData) => {
  return await axiosClient.post('/admin/judges', judgeData);
};

export const getSubmissions = async () => {
  return await axiosClient.get('/admin/submissions');
};

export const getSubmissionById = async (id) => {
  return await axiosClient.get(`/admin/submissions/${id}`);
};

export const createAnnouncement = async (data) => {
  return await axiosClient.post('/admin/announcements', data);
};

export const deleteAnnouncement = async (id) => {
  return await axiosClient.delete(`/admin/announcements/${id}`);
};

export const rerunAiCheck = async (submissionId) => {
  return await axiosClient.post(`/admin/submissions/${submissionId}/ai-check`);
};

export const getAiDetectionStatus = async () => {
  return await axiosClient.get('/admin/ai-detection/status');
};

export default {
  updateCompetition,
  getTeams,
  getTeamById,
  deleteTeam,
  getJudges,
  createJudge,
  getSubmissions,
  getSubmissionById,
  createAnnouncement,
  deleteAnnouncement,
  rerunAiCheck,
  getAiDetectionStatus,
};
