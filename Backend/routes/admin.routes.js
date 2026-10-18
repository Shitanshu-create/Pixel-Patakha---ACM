import express from 'express';
import { body } from 'express-validator';
import {
  updateCompetition,
  getTeams,
  getTeamById,
  deleteTeam,
  createJudge,
  getJudges,
  getSubmissions,
  getSubmissionDetails,
} from '../controllers/admin.controller.js';
import { createAnnouncement, deleteAnnouncement } from '../controllers/announcement.controller.js';
import { rerunSubmissionScan, getAiDetectionStatus } from '../controllers/aiDetection.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { aiRecheckLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// AI Detection Admin Routes
router.get('/ai-detection/status', getAiDetectionStatus);
router.post('/submissions/:id/ai-check', aiRecheckLimiter, rerunSubmissionScan);

// Competition
router.put('/competition', updateCompetition);

// Teams
router.get('/teams', getTeams);
router.get('/teams/:id', getTeamById);
router.delete('/teams/:id', deleteTeam);

// Judges
router.post(
  '/judges',
  [
    body('name').trim().notEmpty().withMessage('Judge name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  createJudge
);
router.get('/judges', getJudges);

// Submissions
router.get('/submissions', getSubmissions);
router.get('/submissions/:id', getSubmissionDetails);

// Announcements
router.post(
  '/announcements',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validate,
  createAnnouncement
);
router.delete('/announcements/:id', deleteAnnouncement);

export default router;
