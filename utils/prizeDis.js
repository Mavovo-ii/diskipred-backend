
import cron from 'node-cron'
import Match from '../models/Match.js'
import { distributePrizes } from '../controllers/prizedistributionController.js'

// Keep track of distributed periods to avoid duplicates (could use DB or in-memory cache)
export const distributedPrizesIfEligible = () => {
const distributedPeriods = new Set()

cron.schedule('*/45 * * * *', async () => { // every 45 minutes
  try {
    // Example: current matchday you want to check
    const currentPeriod = 1 // Or dynamically figure out latest matchday

    // Skip if already distributed
    if (distributedPeriods.has(currentPeriod)) return

    // Check matches for this period
    const matches = await Match.find({ matchday: currentPeriod })

    // If no matches yet, skip
    if (!matches || matches.length === 0) return

    // Check if all matches ended
    const allEnded = matches.every(match => match.hasEnded)

    if (allEnded) {
      console.log(`All matches ended for matchday ${currentPeriod}. Distributing prizes...`)
      
      // Set your prize pool amount here or fetch dynamically
      const prizePoolAmount = 800

      await distributePrizes(prizePoolAmount, currentPeriod)

      distributedPeriods.add(currentPeriod) // Mark as distributed
    }
  } catch (error) {
    console.error('Error checking match status or distributing prizes:', error)
  }
})
}
