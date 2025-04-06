import type { Core } from '@strapi/strapi';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({

	async create_locations(locations: string): Promise<boolean> {
    const lines = locations.trim().split('\n');
    const datas = lines.map((line) => {
      const values = line.split(',');
      return {
        name: values[0],
        state: values[1],
        geojson:{
          lat: parseFloat(values[2]),
          lng: parseFloat(values[3])
        }
      }
    });
    const existing = await strapi.documents('api::location.location').findMany();

    for (const exists of existing) {
      await strapi.documents('api::location.location')
        .delete({
          documentId: exists.documentId
        });
    }

    for (const data of datas) {
      await strapi.documents('api::location.location')
        .create({
          data: data,
          status: 'published'
        })
    }

    return true;
  }
});

export default service;