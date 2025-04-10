import type { Core } from '@strapi/strapi';
import axios from 'axios';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
	async cmd(cmd: string) {
		const pluginStore = strapi.store({
	    type: 'plugin',
	    name: 'weatherbot'
    });

    const tokenKey = 'secure_token';
    let token = await pluginStore.get({ key: tokenKey });

		try {
			return await axios.get(
				`${process.env.APP_URL}/api/weatherbot/${cmd}`,
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				}
			);
		} catch(e) {
			return e;
		}
	}
});

export default service;
