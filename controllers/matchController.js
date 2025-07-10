import expressAsyncHandler from "express-async-handler";
import Match from "../models/Match.js";
import Team from "../models/Team.js";


export const createMatch = expressAsyncHandler(async (req, res) => {
  const {
    homeTeam,
    awayTeam,
    league,
    matchdate,
    matchtime,
    isHot
  } = req.body;


  // 1. Validate input
  if (!homeTeam || !awayTeam || !league || !matchdate || !matchtime || isHot === undefined) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (homeTeam === awayTeam) {
    return res.status(400).json({ message: "Home and away teams must be different." });
  }

  // 2. Find teams by Id
  const home = await Team.findById(homeTeam);
  const away = await Team.findById(awayTeam);

  if (!home || !away) {
    return res.status(404).json({ message: "One or both teams not found." });
  }

  // 3. Format dates
  const matchDateTime = new Date(`${matchdate}T${matchtime}`);
  const matchDayOnly = new Date(matchdate);

  //4. Save match
  const newMatch = await Match.create({
    league,
    homeTeam: home._id,
    awayTeam: away._id,
    matchdate: matchDateTime,
    matchtime,
    matchday: matchDayOnly,
    isHot: isHot === "true" || isHot === true || isHot === "on"
  });

  res.status(201).json({
    message: "Match created successfully",
    match: newMatch
  });
});


export const getMatchById = expressAsyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id)
    .populate("homeTeam", "name logo")
    .populate("awayTeam", "name logo");

  if (!match) {
    res.status(404);
    throw new Error("Match not found");
  }

  res.status(200).json(match);
});

// Delete a fixture
export const deleteMatch = expressAsyncHandler(async (req, res) => {
  const match = await Match.findByIdAndDelete(req.params.id);
  if (!match) return res.status(404).json({ message: "Fixture not found" });

  res.status(200).json({ message: "Fixture deleted" });
});

//Edit a fixture
export const updateMatch = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { league, matchdate, matchtime, isHot } = req.body;

  const match = await Match.findById(id);
  if (!match) return res.status(404).json({ message: "Match not found" });

  match.league = league;
  match.matchdate = new Date(`${matchdate}T${matchtime}`);
  match.matchtime = matchtime;
  match.matchday = new Date(matchdate);
  match.isHot = isHot === "true" || isHot === true || isHot === "on";

  const updated = await match.save();
  res.status(200).json({ message: "Fixture updated", updated });
});

// Get all fixtures
export const getAllFixtures = expressAsyncHandler(async (req, res) => {
  const fixtures = await Match.find()
    .populate('homeTeam', 'name logo')
    .populate('awayTeam', 'name logo')
    .sort({ matchDate: 1 }); // or { matchDate: 1, matchTime: 1 }

    const filteredFixtures = fixtures.filter(
    f => f.homeTeam && f.awayTeam
  );

  res.status(200).json(filteredFixtures);
});







