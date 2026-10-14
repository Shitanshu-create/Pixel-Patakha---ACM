import express from 'express';
import { createSubmission, getMySubmission } from '../controllers/submission.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { checkSubmissionOpen } from '../middlewares/competitionWindow.middleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('team'));

router.post('/', checkSubmissionOpen, upload.array('designs'), createSubmission);
router.get('/me', getMySubmission);

export default router;
