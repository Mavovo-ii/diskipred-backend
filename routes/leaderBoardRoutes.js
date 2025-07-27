import express from "express";
import leaderboardController from "../controllers/leaderboardController.js";
import  { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// ROUTES

// Get leaderboard for a specific period
router.get('/:period', leaderboardController.getLeaderboardByPeriod);

// Generate a new leaderboard after a game week ends
router.post('/:period/generate', protectRoute, leaderboardController.generateLeaderboard);

export default router;
