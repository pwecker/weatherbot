import type { Core } from '@strapi/strapi';
import axios from 'axios';

function generateToken(length = 64): string {

  return require('crypto')
    .randomBytes(length)
    .toString('hex');
}

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const pluginStore = strapi.store({
    type: 'plugin',
    name: 'weatherbot'
  });

  const tokenKey = 'secure_token';
  let token = await pluginStore.get({ key: tokenKey });

  if (!token) {
    token = generateToken();
    await pluginStore.set({ key: tokenKey, value: token });
    strapi.log.info(`generated token: ${token}`);
  }

  strapi.cron.add({
    post: {
      task: async({ strapi }) => {
        const url = `${process.env.APP_URL}/api/weatherbot/refresh;message;upload;track`;
        try {
          await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
        } catch(e) {
          strapi.log.error(e);
        }
      },
      bypassRedlock: false,
      options: {
        rule: '0 0 6 * * *'
      }
    },
    track: {
      task: async({ strapi }) => {
        const url = `${process.env.APP_URL}/api/weatherbot/track`;
        try {
          await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
        } catch(e) {
          strapi.log.error(e);
        }
      },
      bypassRedlock: false,
      options: {
        rule: '0 0 0,12 * * *'
      }
    }
  } as any)

};

export default bootstrap;
