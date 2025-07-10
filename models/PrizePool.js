import mongoose from "mongoose";


const prizePoolSchema = new mongoose.Schema({

  period : {
    type: String, // e.g., "Week 1", "July 2025", etc.
    required: true,
    unique: true
  },

  totalAmount : {
    type: Number,
    required: true
  },

  winners : [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      points: Number,
      rank: Number,
      prize: Number
    }
  ],
  distributed : {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('PrizePool', prizePoolSchema);
