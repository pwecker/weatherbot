import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({

	async message(ctx) {
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);
    const todayStr = today.toISOString().split('T')[0];
    const fiveDaysAgoStr = fiveDaysAgo.toISOString().split('T')[0];
    const recent = await strapi
      .documents('api::message.message')
      .findMany({
        filters: {
          date: {
            '$gte': fiveDaysAgoStr
          },
        },
        sort: 'updatedAt:desc',
        populate: [ 'location' ]
      });

    if (recent.length === 0) {
      const forecast = await strapi
        .documents('api::forecast.forecast')
        .findMany({
          filters: {
            date: todayStr
          },
          sort: 'score:desc',
          limit: 1,
          populate: [ 'location' ]
        });

      if (forecast.length === 0) {
        ctx.body = { message: 'No forecasts available.' };

        return;
      }

      const response = await strapi
        .plugin('weatherbot')
        .service('message')
        .generate_message(forecast[0], forecast[0].location);
      ctx.body = response;
    }

    const locationIds = recent
      .filter((msg) => msg.location && msg.location.id)
      .map((msg) => msg.location.id);
    const distanceInMiles = 100;
    const distanceInMeters = distanceInMiles * 1609.34;
    const rawQuery = `
      SELECT DISTINCT f.*
      FROM forecasts f
      LEFT JOIN forecasts_location_lnk fl ON f.id = fl.forecast_id
      LEFT JOIN locations l ON fl.location_id = l.id
      WHERE f.date = :today
      AND (
        fl.location_id IS NULL OR
        NOT EXISTS (
          SELECT 1
          FROM messages m
          LEFT JOIN messages_location_lnk ml ON m.id = ml.message_id
          LEFT JOIN locations rl ON ml.location_id = rl.id
          WHERE m.date >= :fiveDaysAgo
          AND ST_DWithin(
            ST_MakePoint(l.lng, l.lat)::geography,
            ST_MakePoint(rl.lng, rl.lat)::geography,
            :distanceInMeters
          )
        )
      )
      ORDER BY f.score DESC
      LIMIT 1;
    `;

    const forecasts = await strapi
      .db
      .connection
      .raw(rawQuery, {
        today: todayStr,
        fiveDaysAgo: fiveDaysAgoStr,
        distanceInMeters
      });

    if (!forecasts.rows || forecasts.rows.length === 0) {
      ctx.body = { message: 'No forecasts available outside 100-mile exclusion zone/' };

      return;
    }

    const forecast = await strapi
      .documents('api::forecast.forecast')
      .findOne({
        documentId: forecasts.rows[0].document_id,
        populate: [ 'location' ]
      });

    const response = await strapi
      .plugin('weatherbot')
      .service('message')
      .generate_message(forecast, forecast.location);
    ctx.body = response;

    return;
  }

});

export default controller;