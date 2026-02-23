import Redis from 'ioredis';
import '@/configs/dotenv.config';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisPassword = process.env.REDIS_PASSWORD;
const redisUsername = process.env.REDIS_USERNAME;

export const redisConnection = new Redis({
  host: redisHost,
  port: redisPort,
  ...(redisUsername && { username: redisUsername }),
  ...(redisPassword && { password: redisPassword }),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: (times: number) => {
    if (times > 3) {
      console.error('Redis connection failed after 3 retries');
      return null;
    }
    return Math.min(times * 200, 2000);
  },
});

redisConnection.on('connect', () => {
  console.log('Redis connected successfully');
});

redisConnection.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

export const createRedisConnection = () => {
  return new Redis({
    host: redisHost,
    port: redisPort,
    ...(redisUsername && { username: redisUsername }),
    ...(redisPassword && { password: redisPassword }),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
};

export default redisConnection;
