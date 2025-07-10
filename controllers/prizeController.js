import expressAsyncHandler from "express-async-handler";
import Prize from "../models/PrizePool.js"
import Leaderboard from "../models/Leaderboard.js"
import User from "../models/User.js"

//Create or update prize pool
const createOrUpdatePrizePool = expressAsyncHandler(async (req, res) => {
  const { period, totalAmount, breakdown } = req.body;

  const prize = await Prize.findOneAndUpdate(
    { period },
    { totalAmount, breakdown },
    { new: true, upsert: true }
  );

  res.status(200).json(prize);
});

//Get prize pool for a specific period
const getPrizePoolByPeriod = expressAsyncHandler(async (req, res) => {
  const prize = await Prize.findOne({ period: req.params.period });

  if (!prize) {
    res.status(404);
    throw new Error('Prize pool not found');
  }

  res.status(200).json(prize);
});

// Distrubute to winners (after leaderboard is finalized)
const distributePrize = expressAsyncHandler(async (req, res) => {
  const period = req.params.period;

  const prize = await Prize.findOne({ period });
  const leaderboard = await Leaderboard.findOne({ period });

  if (!prize || !leaderboard) {
    res.status(404);
    throw new Error('Prize or leaderboard not found');
  }

  const winners = leaderboard.players;

  const payoutLog = [];

  for (let i = 0; i < winners.length; i++) {
    const rank = winners[i].rank;
    const userId = winners[i].userId;
    const points = winners[i].points;

    const payout = prize.breakdown.find(p => p.rank === rank);
    if (!payout) continue;

    const user = await User.findById(userId);
    if (!user) continue;

    user.loyaltyPoints += payout.amount;
    await user.save();

    payoutLog.push({
      user: user.displayName,
      rank,
      amount: payout.amount
    });
  }

  res.status(200).json({ message: 'Prize distribution complete', winners: payoutLog });
});

export default {
  createOrUpdatePrizePool,
  getPrizePoolByPeriod,
  distributePrize
}
