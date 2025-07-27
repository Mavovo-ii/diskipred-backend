
// routes/testRoutes.js
import express from "express";
import { fetchFinishedMatchResults } from "../utils/fetchFinishedMatchResults.js";

const router = express.Router();

router.get("/fetch-scores", async (req, res) => {
  try {
    await fetchFinishedMatchResults();
    res.status(200).json({ message: "✅ Scores fetched and matches updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
