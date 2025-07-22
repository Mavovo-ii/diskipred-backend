import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import generateToken from '../utils/Token.js'

const generateUID = () => {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `${ts}-${rand}`;
};

export const register = expressAsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  
  const lowerEmail = email.trim().toLowerCase();

  console.log('🚀 Raw password:', password);

  const existing = await User.findOne({ email: lowerEmail });
  if (existing) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log('🔐 Hashed password BEFORE save:', hashedPassword);

  const user = new User({
    username,
    email: lowerEmail,
    password: hashedPassword,
    uid: generateUID(),
  });

  await user.save();

  console.log('✅ Saved user password hash:', user.password);

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: user._id, username: user.username, email: user.email, uid: user.uid },
  });
});


// Log user in

export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('▶️ Login input password:', password);

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password (user not found)');
  }

  console.log('🧾 Stored user object:', user);
  console.log('🔐 Stored password hash:', user.password);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log('✅ bcrypt.compare result:', isMatch);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password (password mismatch)');
  }

  res.json({
    message: 'Login successful',
    token: generateToken(user._id),
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      uid: user.uid,
    },
  });
});
