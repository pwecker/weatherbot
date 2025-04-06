import type { Core } from '@strapi/strapi';
import { promises as fs } from 'fs';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({

	async create(ctx) {
    const { files } = ctx.request;
    const file = files.cities;
    const locations = await fs.readFile(file.filepath, 'utf-8');
    const result = await strapi
      .plugin('weatherbot')
      .service('create')
      .create_locations(locations);
    ctx.body = result;
  }

});

export default controller;