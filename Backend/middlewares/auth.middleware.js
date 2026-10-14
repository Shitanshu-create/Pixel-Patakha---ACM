import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const authMiddleware = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Authentication token required'));
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

export default authMiddleware;
