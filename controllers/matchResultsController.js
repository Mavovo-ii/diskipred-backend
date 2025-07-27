import asyncHandler from 'express-async-handler';
import axios from 'axios';
import Match from '../models/Match.js';

export const updateMatchResults = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // Find all matches before today with status "NS" (Not Started)
  const matchesToUpdate = await Match.find({
    status: "NS",
    date: { $lt: today },
  });

  for (const match of matchesToUpdate) {
    const response = await axios.get(
      `https://v3.football.api-sports.io/fixtures?id=${match.apiId}`,
      {
        headers: {
          "x-apisports-key": process.env.API_FOOTBALL_KEY,
        },
      }
    );



    const fixture = response.data.response[0];

    if (!fixture || fixture.fixture.status.short !== "FT") continue;

    const homeGoals = fixture.goals.home;
    const awayGoals = fixture.goals.away;

    let outcome = "Draw";
    if (homeGoals > awayGoals) outcome = "Home Win";
    if (awayGoals > homeGoals) outcome = "Away Win";

    await Match.findByIdAndUpdate(match._id, {
      status: "FT",
      homeScore: homeGoals,
      awayScore: awayGoals,
      outcome,
    });
  }

  res.json({ message: "Match results updated successfully" });
});