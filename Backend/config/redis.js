import Redis from 'ioredis';
import { redisUrl } from './env.js';

let redisClient = null;

try {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        return null;
      }
      return Math.min(times * 100, 2000);
    },
    lazyConnect: true,
  });

  redisClient.on('connect', () => {
    console.log('Redis connected successfully');
  });

  redisClient.on('error', (err) => {
    console.warn(`Redis warning: ${err.message}. Proceeding with cache fallback.`);
  });
} catch (err) {
  console.warn(`Redis init error: ${err.message}`);
  redisClient = null;
}

export default redisClient;
