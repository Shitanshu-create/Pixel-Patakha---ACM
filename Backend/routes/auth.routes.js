import express from 'express';
import { body } from 'express-validator';
import { registerTeam, loginTeam, loginStaff, getMe } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { checkRegistrationOpen } from '../middlewares/competitionWindow.middleware.js';

const router = express.Router();

router.post(
  '/team/register',
  checkRegistrationOpen,
  [
    body('teamName').trim().notEmpty().withMessage('Team name is required'),
    body('leaderEmail').isEmail().withMessage('Valid leader email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('college').trim().notEmpty().withMessage('College is required'),
    body('members').isArray({ min: 1 }).withMessage('Members array is required with at least 1 member'),
    body('members.*.name').trim().notEmpty().withMessage('Member name is required'),
    body('members.*.email').isEmail().withMessage('Valid member email is required'),
    body('members.*.phone').trim().notEmpty().withMessage('Member phone is required'),
  ],
  validate,
  registerTeam
);

router.post(
  '/team/login',
  [
    body('email').isEmail().withMessage('Valid leader email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  loginTeam
);

router.post(
  '/staff/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  loginStaff
);

router.get('/me', authMiddleware, getMe);

export default router;
