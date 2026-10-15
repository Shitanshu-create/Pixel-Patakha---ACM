import app from './app.js';
import { port, nodeEnv } from './config/env.js';
import connectDB from './config/db.js';
import redisClient from './config/redis.js';

const startServer = async () => {
  try {
    await connectDB();

    if (redisClient) {
      try {
        await redisClient.connect();
      } catch (redisErr) {
        console.warn(`Redis connection skipped: ${redisErr.message}`);
      }
    }

    const server = app.listen(port, () => {
      console.log(`Server running in ${nodeEnv} mode on port ${port}`);
    });

    const shutdown = async () => {
      console.log('Shutting down server gracefully...');
      server.close(async () => {
        if (redisClient && redisClient.status === 'ready') {
          await redisClient.quit().catch(() => {});
        }
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
