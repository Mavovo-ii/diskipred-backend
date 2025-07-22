import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js"
import Prediction from "../models/Prediction.js";

// Get user profile (by JWT)
const getUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }
  res.status(200).json(user)
})



//delete user profile
export const deleteUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  // Optional: delete user's predictions
  await Prediction.deleteMany({ user: user._id }) // Only if desired

  await user.deleteOne() // ✅ safer and more modern than `remove()`

  res.status(200).json({ message: 'User deleted successfully' })
})


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
     const userId = req.user._id;

  const predictions = await Prediction.find({ user: userId })
    .populate('match') // include match details if needed
    .sort({ createdAt: -1 });

  res.status(200).json(predictions);
})

export default { createOrUpdateUser, getUserByUid, getUserPredictions, getUserProfile, deleteUserProfile }