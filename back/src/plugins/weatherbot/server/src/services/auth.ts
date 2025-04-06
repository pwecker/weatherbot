import type { Core } from '@strapi/strapi';
import { TokenDoc } from '../interfaces';
import axios from 'axios';
import qs from 'qs';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({

	async store_tokens(tokens: { access_token: string; refresh_token: string; expires_at: number }) {
		const existing = await strapi
		  .documents('api::token.token')
		  .findMany() as unknown as TokenDoc[];

		for (const token of existing) {
			const { documentId } = token;
			await strapi
			  .documents('api::token.token')
			  .delete({documentId})
		}

		await strapi
		  .documents('api::token.token')
		  .create({
		  	data: tokens,
		  	status: 'published'
		  });
	},

	async get_tokens():Promise<any> {
		const existing = await strapi
		  .documents('api::token.token')
		  .findMany() as unknown as TokenDoc[];

		return existing[0];
	},

	async refresh_access_token() {
		const tokens = await this.get_tokens();

		if (!tokens.refresh_token) throw new Error('Missing refresh token');

		const res = await axios.post(
			'https://api.twitter.com/2/oauth2/token',
			qs.stringify({
				grant_type: 'refresh_token',
				refresh_token: tokens.refresh_token,
				client_id: process.env.X_API_CLIENT_ID
			}),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
		);

		const { access_token, refresh_token, expires_in } = res.data;
		const newTokens = {
			access_token,
			refresh_token,
			expires_at: Date.now() + expires_in * 1000
		};
		await this.store_tokens(newTokens);

		return access_token;
	}

});
export default service;
