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

export const port = process.env.PORT || 5000;
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
export const maxTeamSize = parseInt(process.env.MAX_TEAM_SIZE || '4', 10);

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
};
