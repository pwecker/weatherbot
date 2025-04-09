import type { Core } from '@strapi/strapi';
export default async (ctx: any, config: any, { strapi }: { strapi: Core.Strapi }) => {
  const pluginStore = strapi
    .store({
      type: 'plugin',
      name: 'weatherbot'
    });
  const storedToken = await pluginStore
    .get({
      key: 'secure_token'
    });
  const token = ctx.request.headers['authorization']?.replace('Bearer ', '');

  if (!token || token !== storedToken) {
    return false;
  } else {
    return true;
  }

};