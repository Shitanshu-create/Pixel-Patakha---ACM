import express from 'express';

import competitionRoutes from './competition.routes.js';
import authRoutes from './auth.routes.js';
import teamRoutes from './team.routes.js';
import submissionRoutes from './submission.routes.js';
import judgeRoutes from './judge.routes.js';
import announcementRoutes from './announcement.routes.js';
import adminRoutes from './admin.routes.js';
import { apiLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.use(apiLimiter);

import mongoose from 'mongoose';

router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    success: true,
    message: 'Server is healthy',
    data: {
      uptime: Math.round(process.uptime()),
      database: dbStatus,
      timestamp: new Date().toISOString(),
    },
  });
});

router.use('/competition', competitionRoutes);
router.use('/auth', authRoutes);
router.use('/team', teamRoutes);
router.use('/submissions', submissionRoutes);
router.use('/judge', judgeRoutes);
router.use('/announcements', announcementRoutes);
router.use('/admin', adminRoutes);

export default router;
