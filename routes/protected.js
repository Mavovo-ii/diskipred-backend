import express from "express";
import  { protectRoute } from "../middleware/authMiddleware.js"
import { getProtectedData } from "../controllers/protetectedController.js"

const router = express.Router();

router.get("/dashboard", protectRoute, getProtectedData);

export default router;
