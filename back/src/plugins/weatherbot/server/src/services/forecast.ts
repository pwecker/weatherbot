import type { Core } from '@strapi/strapi';
import { Coord, Forecast, ForecastDoc, LocationDoc } from '../interfaces';
import axios from 'axios';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function rapidApi(coord: Coord): Promise<any> {
  const options = {
    method: 'GET',
    url: 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily',
    params: {
      lat: coord.lat,
      lon: coord.lng,
      units: 'imperial',
      lang: 'en'
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'weatherbit-v1-mashape.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch(e) {
    strapi.log.error(`Rapid Api`, e);
    throw e;
  }

}

async function insert(forecastDoc: ForecastDoc): Promise<any> {

  return await strapi
    .documents('api::forecast.forecast')
    .create({
      data: forecastDoc,
      status: 'published'
    });
}

async function update(docId: string, forecastDoc: any): Promise<any> {

  return await strapi
    .documents('api::forecast.forecast')
    .update({
      documentId: docId,
      data: forecastDoc
    });
}

function score_temperature(app_temp: number) {
  return Math.min(Math.abs(app_temp - 72) / 48, 1) / 2;
}

function score_wind(wind_spd: number) {
  return Math.min(wind_spd / 33, 1);
}

function score_humidity(rh: number) {
  if (rh >= 30 && rh <= 50) {
    return 0;
  } else if (rh < 30) {
    return (30 - rh) / 30;
  } else {
    return (rh - 50) / 50;
  }
}

function score_precipitation(pop: number) {
  return pop / 100;
}

function score_description(code: number) {
  if (code === 751 || code === 731 || code === 711 || code === 622 || code === 612 || code === 602 || code === 610 || code === 522 || code === 511 || code === 502 || code === 233 || code === 232 || code === 231 || code === 202 || code === 201) return 1;
  else return 0;
}

function score(data) {
  let score = 0;
  const {
    app_max_temp,
    app_min_temp,
    wind_spd,
    rh,
    pop,
    weather
  } = data;
  const scores = {
    app_max_temp: score_temperature(app_max_temp),
    app_min_temp: score_temperature(app_min_temp),
    wind_spd: score_wind(wind_spd),
    rh: score_humidity(rh),
    pop: score_precipitation(pop),
    code: score_description(weather.code)
  };

  for (const key in scores) {
    score += scores[key];
  }

  return score;
}

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
	async get_forecasts(coords: Coord[]): Promise<Forecast[]> {
    const results: Forecast[] = [];

    for (const coord of coords) {

      try {
        const response = await rapidApi(coord);
        const forecast: Forecast = {
          ...response,
          lng: response.lon,
          location: coord.id
        };

        delete forecast.lon;
        results.push(forecast);

        if (coord !== coords[coords.length - 1]) {
          await delay(3600);
        }

      } catch(e) {
        strapi.log.error(`Service`, e);
      }

    }

    return results;
  },

  async update_forecasts(forecasts: Forecast[]): Promise<boolean> {

    for (const forecast of forecasts) {
      const { data, location } = forecast;

      for (const day of data) {
        const exists = await strapi.documents('api::forecast.forecast').findMany({
          filters: {
            location: location,
            date: day.datetime
          },
          limit: 1,
        });

        const forecastDoc = {
          data: day,
          location: location,
          date: day.datetime,
          score: score(day)
        };

        if (exists.length === 0) {
          await insert(forecastDoc);
        } else {
          await update(exists[0].documentId, forecastDoc);
        }

      }

    }

    return true;
  },

   async update_crawled(locations: any): Promise<boolean> {

    for (const location of locations) {
      await strapi.documents('api::location.location')
        .update({
          documentId: location.documentId,
          data: {}
        });
    }

    return true;
  }

});

export default service;
