import {
  sightengineMinIntervalMs,
  sightengineDailyOpsLimit,
  sightengineMonthlyOpsLimit,
  sightengineOpsPerCheck,
} from '../config/env.js';
import cacheService from './cache.service.js';

// In-memory fallbacks when Redis is offline
const memoryStore = {
  lastCall: 0,
  dayKey: '',
  dayOps: 0,
  monthKey: '',
  monthOps: 0,
};

const getKeys = () => {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');

  return {
    dayKey: `ai:ops:day:${yyyy}${mm}${dd}`,
    monthKey: `ai:ops:month:${yyyy}${mm}`,
  };
};

export const waitTurn = async () => {
  const lastKey = 'ai:last';
  const redisLast = await cacheService.get(lastKey);
  const lastTime = redisLast ? Number(redisLast) : memoryStore.lastCall;
  const now = Date.now();
  const diff = now - lastTime;

  if (diff < sightengineMinIntervalMs) {
    const delay = sightengineMinIntervalMs - diff;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  const current = Date.now();
  await cacheService.set(lastKey, current, 120);
  memoryStore.lastCall = current;
};

export const canSpend = async (ops = sightengineOpsPerCheck) => {
  const { dayKey, monthKey } = getKeys();

  const redisDay = await cacheService.get(dayKey);
  const redisMonth = await cacheService.get(monthKey);

  const daySpent = redisDay !== null ? Number(redisDay) : memoryStore.dayOps;
  const monthSpent = redisMonth !== null ? Number(redisMonth) : memoryStore.monthOps;

  if (daySpent + ops > sightengineDailyOpsLimit) {
    return {
      allowed: false,
      reason: `Daily budget reached (${daySpent}/${sightengineDailyOpsLimit} ops)`,
    };
  }

  if (monthSpent + ops > sightengineMonthlyOpsLimit) {
    return {
      allowed: false,
      reason: `Monthly budget reached (${monthSpent}/${sightengineMonthlyOpsLimit} ops)`,
    };
  }

  return { allowed: true, daySpent, monthSpent };
};

export const record = async (operations = sightengineOpsPerCheck) => {
  const { dayKey, monthKey } = getKeys();

  // Day TTL: 48 hours (172800s), Month TTL: 40 days (3456000s)
  await cacheService.incrBy(dayKey, operations, 172800);
  await cacheService.incrBy(monthKey, operations, 3456000);

  if (memoryStore.dayKey !== dayKey) {
    memoryStore.dayKey = dayKey;
    memoryStore.dayOps = 0;
  }
  memoryStore.dayOps += operations;

  if (memoryStore.monthKey !== monthKey) {
    memoryStore.monthKey = monthKey;
    memoryStore.monthOps = 0;
  }
  memoryStore.monthOps += operations;
};

export const usage = async () => {
  const { dayKey, monthKey } = getKeys();

  const redisDay = await cacheService.get(dayKey);
  const redisMonth = await cacheService.get(monthKey);

  const dayUsed = redisDay !== null ? Number(redisDay) : memoryStore.dayOps;
  const monthUsed = redisMonth !== null ? Number(redisMonth) : memoryStore.monthOps;

  return {
    day: {
      used: dayUsed,
      limit: sightengineDailyOpsLimit,
    },
    month: {
      used: monthUsed,
      limit: sightengineMonthlyOpsLimit,
    },
  };
};

export default {
  waitTurn,
  canSpend,
  record,
  usage,
};
