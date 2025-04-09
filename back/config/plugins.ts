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
					connection: {
						host: env('REDIS_HOST'),
						port: env('REDIS_PORT'),
						db: 0
					},
					settings: {
						debug: false
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
