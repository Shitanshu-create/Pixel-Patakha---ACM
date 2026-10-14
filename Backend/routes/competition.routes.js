import express from 'express';
import { getCompetition } from '../controllers/competition.controller.js';

const router = express.Router();

router.get('/', getCompetition);

export default router;
