import express from "express";
import prizeController from "../controllers/prizeController.js"

const router = express.Router()

// ROUTES

// Create or update prize pool for a period (admin or system)
router.post('/', prizeController.createOrUpdatePrizePool);

// Get prize pool for a specific period
router.get('/:period', prizeController.getPrizePoolByPeriod);

// Distribute prize for a given period (after leaderboard finalised)
router.post('/:period/distribute', prizeController.distributePrize);

export default router;