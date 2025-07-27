import express from 'express';
import { updateMatchResults } from '../controllers/matchResultsController.js';

const router = express.Router();

router.get('/update', updateMatchResults);

export default router;
