import express from "express";
import { createMatch, } from "../controllers/matchController.js"
import { getMatchById } from "../controllers/matchController.js";
import { deleteMatch } from "../controllers/matchController.js"
import { updateMatch } from "../controllers/matchController.js";
import { getAllFixtures } from "../controllers/matchController.js";

const router = express.Router()

//ROUTES

// Get a single match
router.get('/:id', getMatchById)

//Delete a single match
router.delete('/:id', deleteMatch)

// Update a fixture
router.put('/:id', updateMatch)

// Create a match(API Sync)
router.post('/', createMatch)

// Get all matches
router.get('/', getAllFixtures)

export default router;
