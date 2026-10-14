import express from 'express';
import { getMyTeamProfile } from '../controllers/team.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('team'));

router.get('/me', getMyTeamProfile);

export default router;
