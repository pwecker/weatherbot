import type { Core } from '@strapi/strapi';
import axios from 'axios';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({

	async run(ctx) {
    const pluginStore = strapi
      .store({
        type: 'plugin',
        name: 'weatherbot'
      });
    const storedToken = await pluginStore
      .get({
        key: 'secure_token'
      });
    let output = [];
    const input = ctx.request.url
      .split('/api/weatherbot/')[1]
      .split('?');
    const [ cmdstr, flagstr ] = input;
    const cmds = cmdstr.split(';').filter(Boolean);

    for (const cmd of cmds) {
      const url = `${process.env.APP_URL}/api/weatherbot/${cmd}${flagstr ? `?${flagstr}` : ''}`;

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });
        output.push({[cmd]: response.data});
        strapi.log.info(`${cmd}`);
      } catch(e) {
        output.push({[cmd]: e});
      }
    }

    ctx.send({ status: 'ok', output })
  }
});

export default controller;