import asyncHandler from "express-async-handler";
import Team from "../models/Team.js";

export const createTeam = asyncHandler(async (req, res) => {
  const { name, league, logo } = req.body;

  if (!name || !league || !logo) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  // Check if team already exists
  const teamExists = await Team.findOne({ slug });
  if (teamExists) {
    res.status(400);
    throw new Error("Team already exists");
  }

  const team = await Team.create({ name, league, logo, slug });

  res.status(201).json({
    message: "Team created",
    team,
  });
});

export const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find().sort({ name: 1 }); // sorted A-Z
  res.json(teams);
});

// ✅ DELETE /api/teams/:id
export const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error("Team not found");
  }

  await team.deleteOne();

  res.status(200).json({ message: "Team deleted successfully" });
});

export default { createTeam, getTeams, deleteTeam };
