
import cron from "node-cron";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = process.env.BASE_URL || `http://localhost:3000`;


// Define the async task
const runScoringTask = async () => {
  try {
    console.log("⏰ [CRON] Starting prediction scoring...");

    const res = await axios.get(`${baseUrl}/api/predictions/score`);

    console.log("✅ [CRON] Scoring completed:", res.data.message);
  } catch (error) {
    const msg = error.response?.data || error.message;
    console.error("❌ [CRON] Scoring failed:", msg);
  }
};

// Schedule the cron job
const schedulePredictionScoring = () => {
  cron.schedule("0 1 * * *", runScoringTask); // runs at 01:00 daily
};

export default schedulePredictionScoring;
