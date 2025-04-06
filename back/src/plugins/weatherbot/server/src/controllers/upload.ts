import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({

	async upload(ctx) {
    const message = await strapi
      .documents('api::message.message')
      .findMany({
        filters: {
          date: new Date().toISOString().split('T')[0],
          uploaded: false
        },
        sort: 'updatedAt:desc',
        limit: 1
      });

    if (message.length < 1) return { no: 'docs' };

    let result = await strapi
      .plugin('weatherbot')
      .service('upload')
      .upload_message(message[0]);

    if (result.data && result.data.id) {
      const { documentId } = message[0];
      const uploaded = true;
      result = await strapi
        .documents('api::message.message')
        .update({ documentId, data: { uploaded }})
    }

    ctx.body = result;
  }

});

export default controller;