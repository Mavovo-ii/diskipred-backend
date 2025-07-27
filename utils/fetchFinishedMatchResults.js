
import axios from "axios";
import Match from "../models/Match.js";
import dotenv from "dotenv";

dotenv.config();

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const API_FOOTBALL_URL = "https://api-football-v1.p.rapidapi.com/v3/fixtures";

const LEAGUE_IDS = [39, 61, 78, 233, 2, 1]; // Your leagues

const determineResult = (home, away) => {
  if (home > away) return "home";
  if (home < away) return "away";
  return "draw";
};

export const fetchFinishedMatchResults = async () => {
  console.log("📡 Fetching results for selected leagues...");

  const today = new Date().toISOString().split("T")[0];
  let updatedCount = 0;

  for (const leagueId of LEAGUE_IDS) {
    try {
      const res = await axios.get(API_FOOTBALL_URL, {
        params: {
          date: today,
          league: leagueId,
          season: 2025, // ✅ adjust to current season if needed
        },
        headers: {
          "x-rapidapi-key": API_FOOTBALL_KEY,
          "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        },
      });

      const fixtures = res.data.response.filter(
        (f) => f.fixture.status.short === "FT"
      );

      for (const f of fixtures) {
        const matchDate = new Date(f.fixture.date);
        const homeName = f.teams.home.name;
        const awayName = f.teams.away.name;

        const match = await Match.findOne({
          matchdate: {
            $gte: new Date(matchDate.getTime() - 60 * 60 * 1000),
            $lte: new Date(matchDate.getTime() + 60 * 60 * 1000),
          },
        }).populate("homeTeam awayTeam");

        if (
          match &&
          match.homeTeam.name === homeName &&
          match.awayTeam.name === awayName
        ) {
          match.hasEnded = true;
          match.homeScore = f.goals.home;
          match.awayScore = f.goals.away;
          match.result = determineResult(f.goals.home, f.goals.away);
          await match.save();
          updatedCount++;
        }
      }
    } catch (error) {
      console.error(`❌ Failed to fetch for league ${leagueId}:`, error.message);
    }
  }

  console.log(`✅ Updated ${updatedCount} finished matches across selected leagues.`);
};
