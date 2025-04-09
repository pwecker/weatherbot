import type { Core } from '@strapi/strapi';
import { MessageQuery } from '../interfaces';

async function get_messages(query: MessageQuery):Promise<any[]> {
  const docs = await strapi
    .documents('api::message.message')
    .findMany(query);

  if (docs.length < 1) return ['no','docs'];
  else return docs;
}

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({

  async track(ctx) {
    const docs = await get_messages({
      sort: 'updatedAt:desc',
      limit: 1
    });
    const { xid, documentId } = docs[0];
    const response = await strapi
      .plugin('weatherbot')
      .service('upload')
      .get_metrics(xid);

    const { public_metrics, created_at } = response.data;
    const { name, username, profile_image_url } = response.includes.users[0];
    const x_created_at = created_at;

    await strapi
      .documents('api::message.message')
      .update({
        documentId,
        data: {
          public_metrics,
          x_created_at,
          user: { name, username, profile_image_url }
        }, status: 'published'
      } as any);

    ctx.body = response;
  },

	async upload(ctx) {
    const docs = await get_messages({
      filters: {
        date: new Date().toISOString().split('T')[0],
        uploaded: false
      },
      sort: 'updatedAt:desc',
      limit: 1
    });

    const message = docs[0];

    if (message === 'no') {
      ctx.body = message;
    } else {
      let result = await strapi
        .plugin('weatherbot')
        .service('upload')
        .upload_message(message);

      if (result.data && result.data.id) {
        const { documentId } = message;
        const uploaded = true;
        await strapi
          .documents('api::message.message')
          .update({ documentId, data: { uploaded, xid: result.data.id }, status: 'published'} as any);

        await this.track({});
      }

      ctx.body = result;
    }
  }

});

export default controller;