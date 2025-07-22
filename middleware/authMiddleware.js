import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  // Check if Authorization header is present
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('Received token:', token);
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (process.env.NODE_ENV === 'development') {
        console.log('Decoded payload:', decoded);
      }

      // ✅ FIX: Use decoded.id instead of decoded.userId
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      // Attach user to request object
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



