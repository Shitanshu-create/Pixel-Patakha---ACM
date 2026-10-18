import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redisClient from '../config/redis.js';
import {
  rateLimitApiPer5Min,
  rateLimitSubmitPer10Min,
  rateLimitRecheckPerMin,
} from '../config/env.js';

const createLimiter = (options) => {
  const isRedisReady = redisClient && redisClient.status === 'ready';

  const store = isRedisReady
    ? new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: `rl:${options.prefix || 'api'}:`,
      })
    : undefined;

  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    store,
    keyGenerator: options.keyGenerator,
    handler: (req, res) => {
      const retrySecs = Math.ceil(options.windowMs / 1000);
      res.setHeader('Retry-After', retrySecs);
      return res.status(429).json({
        success: false,
        message: options.message || `Too many requests. Try again in ${retrySecs} seconds.`,
      });
    },
  });
};

export const apiLimiter = createLimiter({
  windowMs: 5 * 60 * 1000,
  max: rateLimitApiPer5Min,
  prefix: 'global',
  message: 'API rate limit exceeded. Please wait a few minutes.',
});

export const submissionLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: rateLimitSubmitPer10Min,
  prefix: 'submit',
  keyGenerator: (req) => req.user?.id || req.ip,
  message: 'Submission rate limit reached. Please wait before submitting again.',
});

export const aiRecheckLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: rateLimitRecheckPerMin,
  prefix: 'ai-recheck',
  keyGenerator: (req) => req.user?.id || req.ip,
  message: 'AI recheck rate limit exceeded. Please wait a minute.',
});

export default {
  apiLimiter,
  submissionLimiter,
  aiRecheckLimiter,
};
