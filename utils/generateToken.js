import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin, // ✅ This uses the actual stored DB value
    },
    process.env.JWT_SECRET || '8uL*3uC$6e',
    { expiresIn: '30d' }
  );
};

export default generateToken;




