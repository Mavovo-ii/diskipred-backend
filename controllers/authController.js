// controllers/authController.js
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const generateUID = () => {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `${ts}-${rand}`;
};

export const register = expressAsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const lowerEmail = email.trim().toLowerCase();

  const existing = await User.findOne({ email: lowerEmail });
  if (existing) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const isAdmin = lowerEmail === 'mavovo.mkhize@yahoo.com';

  const user = new User({
    username,
    email: lowerEmail,
    password: hashedPassword,
    isAdmin,
    uid: generateUID(),
  });

  await user.save();

  res.status(201).json({
    message: 'User registered successfully',
    token: generateToken(user),
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      uid: user.uid,
    },
  });
});

export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password (user not found)');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password (password mismatch)');
  }

  res.json({
    message: 'Login successful',
    token: generateToken(user),
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      uid: user.uid,
    },
  });
});

