import express from 'express';

import competitionRoutes from './competition.routes.js';
import authRoutes from './auth.routes.js';
import teamRoutes from './team.routes.js';
import submissionRoutes from './submission.routes.js';
import judgeRoutes from './judge.routes.js';
import announcementRoutes from './announcement.routes.js';
import adminRoutes from './admin.routes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date(),
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
