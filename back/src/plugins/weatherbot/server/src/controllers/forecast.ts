import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({

	async refresh(ctx) {
    const locations = await strapi
      .documents('api::location.location')
      .findMany({
        sort: 'updatedAt:desc',
        limit: 25
      });
    const coords = locations.map(({ lat, lng, id }) => ({lat,lng,id}));
    const forecasts = await strapi
      .plugin('weatherbot')
      .service('forecast')
      .get_forecasts(coords);
    const result = await strapi
      .plugin('weatherbot')
      .service('forecast')
      .update_forecasts(forecasts);
    await strapi
      .plugin('weatherbot')
      .service('forecast')
      .update_crawled(locations);
    ctx.body = result;
  }

});

export default controller;