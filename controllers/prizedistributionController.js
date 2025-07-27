
import User from '../models/User.js'
import Leaderboard from '../models/Leaderboard.js'

// prizePoolTotal: total money to distribute for this period (e.g. 800)
// period: string or number (e.g. matchday)
export async function distributePrizes(prizePoolTotal, period) {
  // 1. Get leaderboard for period
  const leaderboard = await Leaderboard.findOne({ period })

  if (!leaderboard) {
    console.log('No leaderboard found for period', period)
    return null
  }

  // 2. Filter users with points >= 27
  const winners = leaderboard.players.filter(p => p.points >= 27)
  if (winners.length === 0) {
    console.log('No winners with 27+ points this period')
    return null
  }

  // 3. Calculate prize per winner (even split)
  const prizePerWinner = prizePoolTotal / winners.length

  const results = []

  // 4. Update user balances
  for (const winner of winners) {
    const user = await User.findById(winner.userId)
    if (!user) continue

    user.balance = (user.balance || 0) + prizePerWinner
    await user.save()

    results.push({
      userId: user._id,
      username: user.username,
      prize: prizePerWinner,
    })
  }

  console.log(`Distributed R${prizePoolTotal} to ${winners.length} winners`)

  return results
}
