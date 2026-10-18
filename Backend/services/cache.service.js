import redisClient from '../config/redis.js';

const DEFAULT_TTL = 3600; // 1 hour

export const get = async (key) => {
  if (!redisClient || redisClient.status !== 'ready') return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn(`Redis get error for key "${key}":`, err.message);
    return null;
  }
};

export const set = async (key, value, ttl = DEFAULT_TTL) => {
  if (!redisClient || redisClient.status !== 'ready') return false;
  try {
    const stringified = JSON.stringify(value);
    if (ttl) {
      await redisClient.set(key, stringified, 'EX', ttl);
    } else {
      await redisClient.set(key, stringified);
    }
    return true;
  } catch (err) {
    console.warn(`Redis set error for key "${key}":`, err.message);
    return false;
  }
};

export const del = async (key) => {
  if (!redisClient || redisClient.status !== 'ready') return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (err) {
    console.warn(`Redis del error for key "${key}":`, err.message);
    return false;
  }
};

export const incrBy = async (key, amount = 1, ttl = null) => {
  if (!redisClient || redisClient.status !== 'ready') return null;
  try {
    const res = await redisClient.incrby(key, amount);
    if (ttl && res === amount) {
      await redisClient.expire(key, ttl);
    }
    return res;
  } catch (err) {
    console.warn(`Redis incrBy error for key "${key}":`, err.message);
    return null;
  }
};

export default {
  get,
  set,
  del,
  incrBy,
};
