import express from 'express';
import { createSubmission, getMySubmission, updateWorkLinks } from '../controllers/submission.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { checkSubmissionOpen } from '../middlewares/competitionWindow.middleware.js';
import { submissionLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('team'));

router.post('/', checkSubmissionOpen, submissionLimiter, upload.array('designs'), createSubmission);
router.get('/me', getMySubmission);
router.patch('/me/links', updateWorkLinks);

export default router;
