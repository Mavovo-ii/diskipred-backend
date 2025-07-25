
import expressAsyncHandler from "express-async-handler";
import Prediction from "../models/Prediction.js";
import Match from "../models/Match.js";
import User from "../models/User.js";


//Get user predictions
//✅Get logged-in user's predictions
export const getMyPredictions = expressAsyncHandler(async (req, res) => {

  const predictions = await Prediction.find({ userId: req.user._id })
    .populate({
      path: "matchId",
      populate: [
        { path: "homeTeam", select: "name shortName" },
        { path: "awayTeam", select: "name shortName" },
      ],
    })
    .sort({ createdAt: -1 });

  res.status(200).json(predictions);
});







// ✅ Submit multiple predictions (bulk)
export const submitPredictions = expressAsyncHandler(async (req, res) => {
  const predictions = req.body; // Array of { matchId, outcome }
  const userId = req.user._id;

  if (!Array.isArray(predictions) || predictions.length === 0) {
    res.status(400);
    throw new Error("No predictions provided");
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const savedPredictions = [];
  const newMatchdays = new Set();

  for (const pred of predictions) {
    const { matchId, outcome } = pred;

    const existing = await Prediction.findOne({ userId, matchId });
    if (existing) continue;

    const match = await Match.findById(matchId);
    if (!match) {
      res.status(404);
      throw new Error(`Match not found for id: ${matchId}`);
    }

    const prediction = new Prediction({
      userId,
      matchId,
      outcome,
      matchday: match.matchday,
    });

    await prediction.save();
    savedPredictions.push(prediction);
    newMatchdays.add(match.matchday);
  }

  // Loyalty streak tracking
  if (newMatchdays.size > 0 && user.loyaltyBonusGiven === false) {
    if (!user.lastMatchday) user.lastMatchday = [];

    newMatchdays.forEach((md) => {
      if (!user.lastMatchday.includes(md)) {
        user.lastMatchday.push(md);
        user.loyaltyStreakCount = (user.loyaltyStreakCount || 0) + 1;

        if (user.loyaltyStreakCount === 5) {
          user.loyaltyPoints = (user.loyaltyPoints || 0) + 10;
          user.loyaltyBonusGiven = true;
        }
      }
    });
  }

  // Award loyalty points for this batch
  for (const pred of savedPredictions) {
    const match = await Match.findById(pred.matchId);
    if (match) {
      const loyaltyEarned = match.isHot ? 2 : 1;
      user.loyaltyPoints = (user.loyaltyPoints || 0) + loyaltyEarned;
    }
  }

  await user.save();

  res.status(201).json({
    message: "Predictions saved successfully",
    count: savedPredictions.length,
    savedPredictions,
  });
});

// ✅ Get all predictions for a user (optionally filtered by matchday)
export const getUserPredictions = expressAsyncHandler(async (req, res) => {
  const { matchday } = req.query;
  const filter = { userId: req.params.uid };

  if (matchday) {
    filter.matchday = matchday;
  }

  const predictions = await Prediction.find(filter).populate("matchId");
  res.status(200).json(predictions);
});

// ✅ Get all predictions for a match
export const getMatchPredictions = expressAsyncHandler(async (req, res) => {
  const predictions = await Prediction.find({ matchId: req.params.matchId }).populate("userId");
  res.status(200).json(predictions);
});

// ✅ Update awarded points after scoring
export const updatePredictionPoints = expressAsyncHandler(async (req, res) => {
  const prediction = await Prediction.findById(req.params.id);

  if (!prediction) {
    res.status(404);
    throw new Error("Prediction not found");
  }

  prediction.pointsAwarded = req.body.points;
  await prediction.save();

  res.status(200).json(prediction);
});


