import Redis from 'ioredis';
import { redisUrl } from './env.js';

let redisClient = null;

try {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy(times) {
      // Keep reconnecting with exponential backoff up to 5s, never return null
      return Math.min(times * 200, 5000);
    },
    lazyConnect: true,
  });

  redisClient.on('connect', () => {
    console.log('Redis connected successfully');
  });

  let warnedOnce = false;
  redisClient.on('error', (err) => {
    if (!warnedOnce) {
      console.warn(`Redis notice: ${err.message || 'connection failed'}. Running with DB fallback.`);
      warnedOnce = true;
    }
  });
} catch (err) {
  console.warn(`Redis init error: ${err.message}`);
  redisClient = null;
}

export default redisClient;
