import asyncHandler from "express-async-handler";
import Match from "../models/Match.js";
import Prediction from "../models/Prediction.js";
import Leaderboard from "../models/Leaderboard.js";

// 🔧 Generate leaderboard for a matchday
const generateLeaderboard = asyncHandler(async (req, res) => {
  const period = req.params.period;

  const matches = await Match.find({ matchday: period }).lean();
  if (!matches.length) {
    res.status(404);
    throw new Error('No matches found for this matchday');
  }

  const matchIds = matches.map(m => m._id);
  const predictions = await Prediction.find({ matchId: { $in: matchIds } }).lean();

  const userScores = {};
  predictions.forEach(pred => {
    const uid = pred.userId.toString();
    userScores[uid] = (userScores[uid] || 0) + pred.pointsAwarded;
  });

  const leaderboard = Object.entries(userScores)
    .map(([userId, points]) => ({ userId, points }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));

  const saved = await Leaderboard.findOneAndUpdate(
    { period },
    { players: leaderboard },
    { new: true, upsert: true }
  );

  const populated = await Leaderboard.findById(saved._id).populate('players.userId');
  res.status(200).json(populated);
});

// 📊 Get leaderboard for a matchday
const getLeaderboardByPeriod = asyncHandler(async (req, res) => {
  const leaderboard = await Leaderboard.findOne({ period: req.params.period }).populate('players.userId');

  if (!leaderboard) {
    res.status(404);
    throw new Error('Leaderboard not found');
  }

  res.status(200).json(leaderboard);
});

export default {
  generateLeaderboard,
  getLeaderboardByPeriod,
};
