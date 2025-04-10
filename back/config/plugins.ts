export default ({ env }) => ({
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
          connection: env('REDIS_URL', `redis://${env('REDIS_USER', 'default')}:${env('REDIS_PASS', '')}@${env('REDIS_HOST', 'redis.railway.internal')}:${env.int('REDIS_PORT', 6379)}/0?family=0`),
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
});
