import express from "express";
import userController from "../controllers/userController.js"
import {protectRoute} from "../middleware/authMiddleware.js";

const router = express.Router();


// ROUTES

//get user profile (by JWT)
router.get('/me', protectRoute, userController.getUserProfile);

//Delete user profile
router.delete('/me', protectRoute, userController.deleteUserProfile);

// Register or login a user (Firebase UID + profile)
router.post('/auth', userController.createOrUpdateUser);

// Get user profile (by Firebase UID)
router.get('/:uid', userController.getUserByUid);


// Get user predictions
router.get('/me/predictions', protectRoute, userController.getUserPredictions);

export default router;
