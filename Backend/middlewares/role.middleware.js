import ApiError from '../utils/ApiError.js';

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(401, 'Unauthorized'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Access denied. Role "${req.user.role}" is not authorized for this resource`));
    }

    next();
  };
};

export default roleMiddleware;
