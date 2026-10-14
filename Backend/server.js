import app from './app.js';
import { port, nodeEnv } from './config/env.js';
import connectDB from './config/db.js';
import './config/redis.js';

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running in ${nodeEnv} mode on port ${port}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
