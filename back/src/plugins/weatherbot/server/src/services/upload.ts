import type { Core } from '@strapi/strapi';
import { MessageDoc } from '../interfaces';
import axios from 'axios';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({

	async upload_message(messageDoc: MessageDoc):Promise<any> {
		const { content } = messageDoc;
		const service = strapi
		  .plugin('weatherbot')
		  .service('auth');
		let tokens = await service.get_tokens();

		if (!tokens || Date.now() >= tokens.expires_at) {
			strapi.log.info('Refreshing X access token...');
			tokens.access_token = await service.refresh_access_token();
		}

		try {
			const response = await axios.post(
				'https://api.twitter.com/2/tweets',
				{ text: content },
				{
					headers: {
						'Authorization': `Bearer ${tokens.access_token}`,
						'Content-Type': 'application/json'
					}
				}
			);

			return response.data;
		} catch(e) {
			strapi.log.error('X post failed: ', e);
			throw e;
		}

	}
});

export default service;
