import mongoose from "mongoose";
//import bcrypt from "bcrypt"

const userSchema = mongoose.Schema({
    
    username : {
        type: String,
        required: true
    },

    uid: {
        type: String,
        unique: true,
        required: true
    },

    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    isAdmin: {
         type: Boolean,
         default: false,
    },

    balance: {
        type: Number,
        default: 0
    },

    // totalPoint : {
    //     type: Number,
    //     default: 0
    // },

    // hasClaimedPrize : {
    //     type: Boolean,
    //     default:false
    // },

    createdAt : {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

    // userSchema.pre('save', async function(next) {
    //   if (!this.isModified('password')) return next();

    //    const salt = await bcrypt.genSalt(10);
    //     this.password = await bcrypt.hash(this.password, salt);
    //     next();
    // });

export default mongoose.model("User", userSchema)
