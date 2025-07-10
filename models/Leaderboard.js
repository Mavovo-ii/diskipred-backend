import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
    period : {
        type: String,
        required: true,
        unique: true
    },

    players : [
        {
            userId :{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            points: { type: Number, required: true },
            rank: { type: Number, required: true}
        }
    ],

    createAt : {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Leaderboard", leaderboardSchema)