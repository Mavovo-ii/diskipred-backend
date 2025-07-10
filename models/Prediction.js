import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    matchId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
        required: true
    },

    outcome : {
        type: String,
        enum: ['home', 'draw', 'away'],
        required: true
    },

    matchday: {
        type: String
    },

    pointsAwarded : {
        type: Number,
        default: 0
    },

    createdAt : {
        type: Date,
        default: Date.now
    }

})

predictionSchema.index({ userId:1, matchId: 1}, {unique: true})

export default mongoose.model("Prediction", predictionSchema)