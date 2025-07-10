import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js"

// Create or update user

const createOrUpdateUser = expressAsyncHandler( async (req, res) => {
    const { uid, displayName, email } = req.body

    let user = await User.findOne({uid})

    if (user) {
    user.displayName = displayName;
    user.email = email;
    await user.save();
  } else {
    user = await User.create({ uid, displayName, email });
  }

  res.status(200).json(user);
})

// Get user by uid

const getUserByUid = expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ uid: req.params.uid })

    if(!user) {
        res.status(404)
        throw new Error("User not found")
    }

    res.status(200).json(user)
})

// Get user predictions (redirect to prediction controller)

const getUserPredictions = expressAsyncHandler(async (req,res) => {
    res.status(501).json({ message: "Handled by prediction controller" })
})

export default { createOrUpdateUser, getUserByUid, getUserPredictions }