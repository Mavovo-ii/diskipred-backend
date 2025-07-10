import expressAsyncHandler from "express-async-handler";
import Match from "../models/Match.js"
import Prediction from "../models/Prediction.js"
import Leaderboard from "../models/Leaderboard.js"



//Generate leaderboard for period
const generateLeaderboard = expressAsyncHandler(async (req, res) => {
  const period = req.params.period;

  // Step 1: Find all matches from that matchday
  const matches = await Match.find({ matchday: period });

  if (!matches || matches.length === 0) {
    res.status(404);
    throw new Error('No matches found for this matchday');
  }

  const matchIds = matches.map(m => m._id);

  // Step 2: Get all predictions tied to those matches
  const predictions = await Prediction.find({ matchId: { $in: matchIds } });

  // Step 3: Tally points per user
  const userScores = {};

  predictions.forEach(pred => {
    const userId = pred.userId.toString();
    if (!userScores[userId]) {
      userScores[userId] = 0;
    }
    userScores[userId] += pred.pointsAwarded;
  });

  // Step 4: Rank users
  const leaderboard = Object.entries(userScores)
    .map(([userId, points]) => ({ userId, points }))
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

  // Step 5: Save leaderboard
  const saved = await Leaderboard.findOneAndUpdate(
    { period },
    { players: leaderboard },
    { new: true, upsert: true }
  );

  res.status(200).json(saved);
});

// 🔹 Get leaderboard for a period
const getLeaderboardByPeriod = expressAsyncHandler(async (req, res) => {
  const leaderboard = await Leaderboard.findOne({ period: req.params.period }).populate('players.userId');

  if (!leaderboard) {
    res.status(404);
    throw new Error('Leaderboard not found');
  }

  res.status(200).json(leaderboard);
});

export default {
  generateLeaderboard,
  getLeaderboardByPeriod
};
