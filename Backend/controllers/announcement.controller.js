import Announcement from '../models/Announcement.model.js';
import cacheService from '../services/cache.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/ApiError.js';

export const ANNOUNCEMENTS_CACHE_KEY = 'cache:announcements';

export const getAnnouncements = asyncHandler(async (req, res) => {
  const cached = await cacheService.get(ANNOUNCEMENTS_CACHE_KEY);
  if (cached) {
    return apiResponse(res, 200, 'Announcements fetched successfully (cached)', cached);
  }

  const announcements = await Announcement.find()
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });

  await cacheService.set(ANNOUNCEMENTS_CACHE_KEY, announcements, 3600);

  return apiResponse(res, 200, 'Announcements fetched successfully', announcements);
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) {
    throw new ApiError(400, 'Title and message are required');
  }

  const announcement = await Announcement.create({
    title: title.trim(),
    message: message.trim(),
    createdBy: req.user.id,
  });

  await cacheService.del(ANNOUNCEMENTS_CACHE_KEY);

  return apiResponse(res, 201, 'Announcement created successfully', announcement);
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    throw new ApiError(404, 'Announcement not found');
  }

  await Announcement.findByIdAndDelete(req.params.id);
  await cacheService.del(ANNOUNCEMENTS_CACHE_KEY);

  return apiResponse(res, 200, 'Announcement deleted successfully');
});

export default {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  ANNOUNCEMENTS_CACHE_KEY,
};
