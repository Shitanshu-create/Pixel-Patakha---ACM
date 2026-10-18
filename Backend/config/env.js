import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
for (const envVar of requiredEnv) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const port = process.env.PORT || 3000;
export const nodeEnv = process.env.NODE_ENV || 'development';
export const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
export const mongoUri = process.env.MONGO_URI;
export const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
export const adminName = process.env.ADMIN_NAME || 'Admin';
export const adminEmail = process.env.ADMIN_EMAIL || 'admin@pixelpatakha.com';
export const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
export const maxFileSizeMb = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10);
export const maxFilesPerSubmission = parseInt(process.env.MAX_FILES_PER_SUBMISSION || '5', 10);
export const minTeamSize = parseInt(process.env.MIN_TEAM_SIZE || '1', 10);
export const maxTeamSize = parseInt(process.env.MAX_TEAM_SIZE || '3', 10);

// AI image detection (Sightengine)
export const aiDetectionEnabled =
  process.env.AI_DETECTION_ENABLED === 'true' &&
  Boolean(process.env.SIGHTENGINE_API_USER && process.env.SIGHTENGINE_API_SECRET);
export const sightengineApiUser = process.env.SIGHTENGINE_API_USER || '';
export const sightengineApiSecret = process.env.SIGHTENGINE_API_SECRET || '';
export const sightengineApiUrl =
  process.env.SIGHTENGINE_API_URL || 'https://api.sightengine.com/1.0/check.json';

export const sightengineMinIntervalMs = parseInt(process.env.SIGHTENGINE_MIN_INTERVAL_MS || '1100', 10);
export const sightengineDailyOpsLimit = parseInt(process.env.SIGHTENGINE_DAILY_OPS_LIMIT || '450', 10);
export const sightengineMonthlyOpsLimit = parseInt(process.env.SIGHTENGINE_MONTHLY_OPS_LIMIT || '1900', 10);
export const sightengineOpsPerCheck = parseInt(process.env.SIGHTENGINE_OPS_PER_CHECK || '5', 10);
export const sightengineTimeoutMs = parseInt(process.env.SIGHTENGINE_TIMEOUT_MS || '30000', 10);
export const sightengineMaxAttempts = parseInt(process.env.SIGHTENGINE_MAX_ATTEMPTS || '3', 10);
export const aiMaxFilesPerSubmission = parseInt(process.env.AI_MAX_FILES_PER_SUBMISSION || '5', 10);

export const aiLevelReviewMin = parseInt(process.env.AI_LEVEL_REVIEW_MIN || '30', 10);
export const aiLevelHighMin = parseInt(process.env.AI_LEVEL_HIGH_MIN || '70', 10);

export const rateLimitApiPer5Min = parseInt(process.env.RATE_LIMIT_API_PER_5MIN || '300', 10);
export const rateLimitSubmitPer10Min = parseInt(process.env.RATE_LIMIT_SUBMIT_PER_10MIN || '10', 10);
export const rateLimitRecheckPerMin = parseInt(process.env.RATE_LIMIT_RECHECK_PER_MIN || '5', 10);

export default {
  port,
  nodeEnv,
  clientUrl,
  mongoUri,
  redisUrl,
  jwtSecret,
  jwtExpiresIn,
  adminName,
  adminEmail,
  adminPassword,
  maxFileSizeMb,
  maxFilesPerSubmission,
  minTeamSize,
  maxTeamSize,
  aiDetectionEnabled,
  sightengineApiUser,
  sightengineApiSecret,
  sightengineApiUrl,
  sightengineMinIntervalMs,
  sightengineDailyOpsLimit,
  sightengineMonthlyOpsLimit,
  sightengineOpsPerCheck,
  sightengineTimeoutMs,
  sightengineMaxAttempts,
  aiMaxFilesPerSubmission,
  aiLevelReviewMin,
  aiLevelHighMin,
  rateLimitApiPer5Min,
  rateLimitSubmitPer10Min,
  rateLimitRecheckPerMin,
};
