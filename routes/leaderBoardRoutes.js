import express from "express";
import LeaderboardController from "../controllers/LeaderboardController.js";

const router = express.Router();

// ROUTES

// Get leaderboard for a specific period
router.get('/:period', LeaderboardController.getLeaderboardByPeriod);

// Generate a new leaderboard after a game week ends
router.post('/:period/generate', LeaderboardController.generateLeaderboard);

export default router;
