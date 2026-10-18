import { aiLevelReviewMin, aiLevelHighMin } from '../config/env.js';

export const toPercent = (score) => {
  if (score === null || score === undefined || isNaN(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score * 100)));
};

export const levelFromPercent = (percent) => {
  if (percent >= aiLevelHighMin) return 'high';
  if (percent >= aiLevelReviewMin) return 'review';
  return 'low';
};

export const topGenerator = (generators = {}) => {
  if (!generators || typeof generators !== 'object') return null;

  let bestName = null;
  let bestScore = 0;

  for (const [name, val] of Object.entries(generators)) {
    const num = Number(val);
    if (!isNaN(num) && num > bestScore) {
      bestScore = num;
      bestName = name;
    }
  }

  if (!bestName || bestScore <= 0.05) return null;

  return {
    name: bestName,
    percent: toPercent(bestScore),
  };
};

export default {
  toPercent,
  levelFromPercent,
  topGenerator,
};
