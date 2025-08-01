
import mongoose from "mongoose";

const matchSchema = mongoose.Schema({
  league: {
    type: String,
    required: true,
    set: v => String(v),  // convert any input to string before saving
  },

  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },

  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },

  isScored: {
    type: Boolean,
    default: false,
  },

  matchdate: {
    type: Date,
    required: true,
  },

  matchtime: {
    type: String,
    required: true,
  },

  matchday: {
    type: Date,
    required: true,
  },

  isHot: {
    type: Boolean,
    default: true,
  },

  hasStarted: {
    type: Boolean,
    default: false,
  },

  hasEnded: {
    type: Boolean,
    default: false,
  },

  // ✅ NEW: API-Football match ID
  apiId: {
    type: Number,
    required: true,
    unique: true,
  },

  // ✅ NEW: Match status from API-Football ("NS", "FT", etc.)
  status: {
    type: String,
    default: "NS",
  },

  // ✅ NEW: Final scores
  homeScore: {
    type: Number,
    default: null,
  },

  awayScore: {
    type: Number,
    default: null,
  },

  //Outcome of the match ("Home Win", "Draw", "Away Win")
  outcome: {
    type: String,
    enum: ["Home Win", "Draw", "Away Win", null],
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Match", matchSchema);
