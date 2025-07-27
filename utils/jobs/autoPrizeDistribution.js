import cron from 'node-cron';
import { distributePrizesIfEligible } from '../prizeDis.js'; // Adjust path

// Run every hour (or customize to your needs)
cron.schedule('0 * * * *', async () => {
  console.log('🕐 Checking for prize distribution...');
  await distributePrizesIfEligible();
});
