import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || '8uL*3uC$6e', {
    expiresIn: '30d',
  });
};

export default generateToken;

