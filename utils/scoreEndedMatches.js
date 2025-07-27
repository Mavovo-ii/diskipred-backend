
import Match from "../models/Match.js";
import Prediction from "../models/Prediction.js";
import Leaderboard from "../models/Leaderboard.js";

const determineResult = (homeGoals, awayGoals) => {
  if (homeGoals > awayGoals) return "home";
  if (homeGoals < awayGoals) return "away";
  return "draw";
};

export const scoreEndedMatches = async () => {
  console.log("🔍 Checking for ended, unscored matches...");

  const endedMatches = await Match.find({
    hasEnded: true,
    isScored: { $ne: true },
    homeScore: { $ne: null },
    awayScore: { $ne: null },
  });

  if (endedMatches.length === 0) {
    console.log("✅ No unscored matches found.");
    return;
  }

  // Keep track of matchdays that were scored
  const matchdaysToUpdate = new Set();

  for (const match of endedMatches) {
    const result = determineResult(match.homeScore, match.awayScore);

    if (match.result !== result) {
      match.result = result;
      await match.save();
    }

    const predictions = await Prediction.find({ matchId: match._id });

    for (const pred of predictions) {
      if (pred.outcome === "Away Win" && result === "away") {
        pred.pointsAwarded = 3;
      } else if (pred.outcome === "Draw" && result === "draw") {
        pred.pointsAwarded = 2;
      } else if (pred.outcome === "Home Win" && result === "home") {
        pred.pointsAwarded = 1;
      } else {
        pred.pointsAwarded = 0;
      }

      await pred.save();
    }

    match.isScored = true;
    await match.save();

    matchdaysToUpdate.add(match.matchday); // collect matchday
    console.log(`🏁 Scored match ${match._id} (${match.homeTeam} vs ${match.awayTeam})`);
  }

  // Automatically generate leaderboard for each affected matchday
  for (const matchday of matchdaysToUpdate) {
    console.log(`📊 Generating leaderboard for matchday ${matchday}...`);

    const matches = await Match.find({ matchday });
    const matchIds = matches.map((m) => m._id);

    const predictions = await Prediction.find({ matchId: { $in: matchIds } });

    const userScores = {};

    predictions.forEach((pred) => {
      const userId = pred.userId.toString();
      if (!userScores[userId]) userScores[userId] = 0;
      userScores[userId] += pred.pointsAwarded;
    });

    const leaderboard = Object.entries(userScores)
      .map(([userId, points]) => ({ userId, points }))
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    await Leaderboard.findOneAndUpdate(
      { period: matchday },
      { players: leaderboard },
      { new: true, upsert: true }
    );

    console.log(`✅ Leaderboard saved for matchday ${matchday}`);
  }

  console.log(`✅ Done scoring ${endedMatches.length} matches and updating leaderboards.`);
};
