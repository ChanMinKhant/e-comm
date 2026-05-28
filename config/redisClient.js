const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
  console.log('Redis Client Error: ' + err);
});

redisClient.on('ready', () => {
  console.log('Redis Client Connected');
});

redisClient.on('connect', () => {
  console.log('Redis Client Connecting');
});

redisClient.on('reconnecting', () => {
  console.log('Redis Client Reconnecting');
});

module.exports = redisClient;
