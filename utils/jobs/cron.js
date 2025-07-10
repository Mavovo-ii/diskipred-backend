import nodeCron from "node-cron";
import scoreEndedMatches from "../scoreEndedMatches.js";

export const startCronJobs = () => {

    //Runs everyday @ 23:00
    nodeCron.schedule("0 23 * * *", async () => {
        console.log("Auto scoring job triggered @ 11:00PM");
        await scoreEndedMatches();
    });
}