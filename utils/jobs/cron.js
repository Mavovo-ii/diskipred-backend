
// cronJobs/startCronJobs.js
import nodeCron from "node-cron";
import { fetchFinishedMatchResults } from "../fetchFinishedMatchResults.js";
import { scoreEndedMatches } from "../scoreEndedMatches.js";

export const startCronJobs = () => {
  nodeCron.schedule("0 23 * * *", async () => {
    console.log("📅 Auto job triggered @ 11:00PM");

    try {
      await fetchFinishedMatchResults();     // ✅ Fetch results first
      await scoreEndedMatches();             // ✅ Then score predictions
      console.log("✅ Auto fetch + scoring done.");
    } catch (err) {
      console.error("❌ Cron job failed:", err.message);
    }
  });
};
