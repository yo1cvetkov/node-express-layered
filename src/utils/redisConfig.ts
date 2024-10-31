import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.log('Redis client error', err));

redisClient.on('connect', () => {
  console.log('Redis client attempting connection...');
});

redisClient.on('ready', () => {
  console.log('Redis client connected successfully!');
});

(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.log('Failed to connect to Redis: ', error);
  }
})();

export default redisClient;
