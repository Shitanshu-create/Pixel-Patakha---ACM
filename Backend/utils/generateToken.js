import jwt from 'jsonwebtoken';
import { jwtSecret, jwtExpiresIn } from '../config/env.js';

const generateToken = (payload) => {
  return jwt.sign(
    { id: payload.id, role: payload.role },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

export default generateToken;
