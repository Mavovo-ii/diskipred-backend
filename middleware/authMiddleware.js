
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// ✅ Protect any authenticated route
export const protectRoute = asyncHandler(async (req, res, next) => {
 
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      console.log('Received token:', token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('Decoded payload:', decoded);
      console.log('Auth header:', req.headers.authorization);

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('JWT verification error:', err.message);
      res.status(401);
      throw new Error('Not authorized, invalid token');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

