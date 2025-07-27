import express from "express";
import { submitPredictions, 
    getMyPredictions, 
    getUserPredictions,
    getMatchPredictions, 
    updatePredictionPoints,
    scorePredictions 
} from "../controllers/predictionController.js"
import { protectRoute } from "../middleware/authMiddleware.js"


const router = express.Router()

// ROUTES

// Submit a new prediction
router.post('/', protectRoute, submitPredictions);

router.get('/score', scorePredictions);

// Get all predictions for a user
router.get('/me', protectRoute, getMyPredictions);

// Get all predictions for a specific user
// This route is for admin use to fetch predictions of any user
// It should be protected to ensure only authorized users can access it
router.get('/user/:uid', protectRoute, getUserPredictions);

// Get all predictions for a specific match
router.get('/match/:matchId', protectRoute, getMatchPredictions);

// Update points for a prediction (internal use)
router.put('/:id/points', protectRoute, updatePredictionPoints);

export default router;