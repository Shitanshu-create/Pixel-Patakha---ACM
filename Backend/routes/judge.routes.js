import express from 'express';
import { body } from 'express-validator';
import {
  getSubmissionsForJudge,
  getSubmissionDetailsForJudge,
  submitReview,
  getJudgeReviews,
} from '../controllers/review.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('judge'));

router.get('/submissions', getSubmissionsForJudge);
router.get('/submissions/:id', getSubmissionDetailsForJudge);
router.post(
  '/submissions/:id/review',
  [
    body('score').isNumeric().withMessage('Score must be a number between 0 and 100'),
    body('feedback').trim().notEmpty().withMessage('Feedback is required'),
  ],
  validate,
  submitReview
);
router.get('/reviews', getJudgeReviews);

export default router;
