import express from 'express';
import { getAnnouncements } from '../controllers/announcement.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAnnouncements);

export default router;
