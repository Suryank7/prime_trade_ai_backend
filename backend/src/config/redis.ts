import { createClient } from 'redis';
import { env } from './env';
import logger from './logger';

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => {
  // Silent failing for local development if redis is not running
  // In production, you might want to throw or exit
  if (env.NODE_ENV !== 'production') {
    logger.warn(`Redis connection error (Ignored in dev): ${err.message}`);
  } else {
    logger.error('Redis connection error', err);
  }
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis server');
});

// Try to connect, catch error but don't exit if local
redisClient.connect().catch((err) => {
  if (env.NODE_ENV !== 'production') {
    logger.warn('Failed to start Redis client (Check if Redis is running locally). Proceeding without cache.');
  } else {
    logger.error('Failed to start Redis client', err);
  }
});

export default redisClient;
