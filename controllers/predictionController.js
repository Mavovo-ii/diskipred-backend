import expressAsyncHandler from "express-async-handler";
import Prediction from "../models/Prediction.js"
import Match from "../models/Match.js"
import User from "../models/User.js"

// Submit a prediction
const submitPrediction = expressAsyncHandler(async (req, res) => {
  const { userId, matchId, outcome } = req.body;

  const existing = await Prediction.findOne({ userId, matchId });

  if (existing) {
    res.status(400);
    throw new Error('You already predicted this match');
  }

  const match = await Match.findById(matchId);

  if(!match) {
    res.status(404)
    throw new Error("Match not found")
  }

  const prediction = await Prediction.create({
    userId,
    matchId,
    outcome,
    matchday: match.matchday
  });

  // Only count new matchday once
if (user && match && user.loyaltyBonusGiven === false) {
  // If this is the first time the user is playing in this matchday
  if (!user.lastMatchday) user.lastMatchday = [];

  if (!user.lastMatchday.includes(match.matchday)) {
    user.lastMatchday.push(match.matchday);
    user.loyaltyStreakCount += 1;

    // 🎉 Give bonus when they reach 5 different matchdays
    if (user.loyaltyStreakCount === 5) {
      user.loyaltyPoints += 10;
      user.loyaltyBonusGiven = true; // so we don’t give it again
    }

    await user.save();
  }
}


  // 🎁 Award loyalty points
  const user = await User.findById(userId);
  if (user) {
    const loyaltyEarned = match.isHot ? 2 : 1;
    user.loyaltyPoints = (user.loyaltyPoints || 0) + loyaltyEarned;
    await user.save();
  }

  res.status(201).json(prediction);
});



// Get all predictions for a user (filter by matchday)
const getUserPredictions = expressAsyncHandler(async (req, res) => {
  const { matchday } = req.query;
  const filter = { userId: req.params.uid };

  if (matchday) {
    filter.matchday = matchday; // If you add matchday to prediction schema later
  }

  const predictions = await Prediction.find(filter).populate('matchId');
  res.status(200).json(predictions);
});

// Get all predictions for a match
const getMatchPredictions = expressAsyncHandler(async (req, res) => {
  const predictions = await Prediction.find({ matchId: req.params.matchId }).populate('userId');
  res.status(200).json(predictions);
});

// Update points for a prediction (after scoring)
const updatePredictionPoints = expressAsyncHandler(async (req, res) => {
  const prediction = await Prediction.findById(req.params.id);

  if (!prediction) {
    res.status(404);
    throw new Error('Prediction not found');
  }

  prediction.pointsAwarded = req.body.points;
  await prediction.save();

  res.status(200).json(prediction);
});

export default {
  submitPrediction,
  getUserPredictions,
  getMatchPredictions,
  updatePredictionPoints
}