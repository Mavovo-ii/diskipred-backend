import express from "express";
import { submitPredictions, 
    getUserPredictions, 
    getMatchPredictions, 
    updatePredictionPoints 
} from "../controllers/predictionController.js"
import { protectRoute } from "../middleware/authMiddleware.js"


const router = express.Router()

// ROUTES

// Submit a new prediction
router.post('/', protectRoute, submitPredictions);

// Get all predictions for a user
router.get('/user/:uid', protectRoute, getUserPredictions);

// Get all predictions for a specific match
router.get('/match/:matchId', protectRoute, getMatchPredictions);

// Update points for a prediction (internal use)
router.put('/:id/points', protectRoute, updatePredictionPoints);

export default router;