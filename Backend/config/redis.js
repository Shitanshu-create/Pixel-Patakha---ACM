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

  redisClient.on('error', (err) => {
    console.warn(`Redis notice: ${err.message}. Running with DB fallback.`);
  });
} catch (err) {
  console.warn(`Redis init error: ${err.message}`);
  redisClient = null;
}

export default redisClient;
