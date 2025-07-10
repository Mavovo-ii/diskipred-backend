import mongoose from "mongoose";

const matchSchema = mongoose.Schema({
    league : {
        type: String,
        required: true
    },

    homeTeam : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    

    awayTeam : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },

    matchdate : {
        type: Date,
        required: true
    },

    isHot : {
        type: Boolean,
        default: true
    },

    hasStarted : {
        type: Boolean,
        default: false
    },

    hasEnded : {
        type: Boolean,
        default: false
    },

    matchtime : {
        type: String,
        required: true
    },

    matchday: {
        type: Date,
        required: true
    },

    createdAt : {
        type: Date,
        default: Date.now
    }

})

export default mongoose.model("Match", matchSchema)