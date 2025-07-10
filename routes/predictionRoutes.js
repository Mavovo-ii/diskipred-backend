import express from "express";
import predictionController from "../controllers/predictionController.js"
import { protectRoute } from "../middleware/authMiddleware.js"


const router = express.Router()

// ROUTES

// Submit a new prediction
router.post('/', protectRoute, predictionController.submitPrediction);

// Get all predictions for a user
router.get('/user/:uid', protectRoute, predictionController.getUserPredictions);

// Get all predictions for a specific match
router.get('/match/:matchId', protectRoute, predictionController.getMatchPredictions);

// Update points for a prediction (internal use)
router.put('/:id/points', protectRoute, predictionController.updatePredictionPoints);

export default router;