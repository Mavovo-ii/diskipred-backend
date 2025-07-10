import express from "express";
import userController from "../controllers/userController.js"

const router = express.Router();


// ROUTES

// Register or login a user (Firebase UID + profile)
router.post('/auth', userController.createOrUpdateUser);

// Get user profile (by Firebase UID)
router.get('/:uid', userController.getUserByUid);


// Get user predictions
router.get('/:uid/predictions', userController.getUserPredictions);

export default router;
