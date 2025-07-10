import express from "express";
import { createTeam, getTeams, deleteTeam } from "../controllers/createTeam.js"

const router = express.Router();

// POST /api/teams
router.post("/", createTeam);
router.get("/", getTeams);
router.delete("/:id", deleteTeam);

export default router;
