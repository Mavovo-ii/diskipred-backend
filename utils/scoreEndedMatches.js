import Match from "../models/Match.js"
import Prediction from "../models/Prediction.js"

export const scoreEndedMatches = async () => {
  console.log('🔍 Checking for ended, unscored matches...');

  const endedMatches = await Match.find({
    isEnded: true,
    isScored: { $ne: true },
    result: { $in: ['home', 'away', 'draw'] } // Ensure result is available
  });

  if (endedMatches.length === 0) {
    console.log('✅ No unscored matches found.');
    return;
  }

  for (const match of endedMatches) {
    const predictions = await Prediction.find({ matchId: match._id });

    for (const pred of predictions) {
      if (pred.outcome === match.result) {
        pred.pointsAwarded = 3;
      } else {
        pred.pointsAwarded = 0;
      }
      await pred.save();
    }

    match.isScored = true;
    await match.save();

    console.log(`🏁 Scored match ${match.homeTeam} vs ${match.awayTeam}`);
  }

  console.log(`✅ Done scoring ${endedMatches.length} matches.`);
};

