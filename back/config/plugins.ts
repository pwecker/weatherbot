export default ({ env }) => {
  // Log the connection string for debugging
  const redisUrl = env('REDIS_URL', `redis://${env('REDIS_USER', 'default')}:${env('REDIS_PASS', '')}@redis.railway.internal:${env.int('REDIS_PORT', 6379)}/0?family=0`);
  console.log('Redis Connection URL:', redisUrl);

  return {
    'redis': {
      config: {
        settings: {
          debug: false,
          enableRedLock: true,
          lockDelay: null,
          lockTTL: 5000,
          redlockConfig: {
            driftFactor: 0.01,
            retryCount: 10,
            retryDelay: 200,
            retryJitter: 200
          }
        },
        connections: {
          default: {
            connection: redisUrl, // Use hardcoded redis.railway.internal
            settings: {
              debug: true
            }
          }
        }
      }
    },
    'weatherbot': {
      enabled: true,
      resolve: './src/plugins/weatherbot'
    }
  };
}