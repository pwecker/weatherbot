import type { Core } from '@strapi/strapi';
import { ForecastDoc, LocationDoc, MessageDoc } from '../interfaces';
import axios from 'axios';

const lookup = {
  'app_max_temp': 'Max feels like temperature (Farenheit)',
  'app_min_temp': 'Min feels like temperature (Farenheit)',
  'clouds': 'Cloud coverage (%)',
  // 'clouds_hi': 'High-level (>5km AGL) cloud coverage (%)',
  // 'clouds_low': 'Low-level (~0-3km AGL) cloud coverage (%)',
  // 'clouds_mid': 'Mid-level (~3-5km AGL) cloud coverage (%)',
  // 'datetime': 'The date today',
  // 'dewpt': 'Dew point Farenheit',
  // 'high_temp': 'High temperature Farenheit',
  // 'low_temp': 'Low temperature Farenheit',
  // 'max_dhi': 'Diffuse horizontal solar irradiance (W/m^2)',
  // 'max_temp': 'Max temperature Farenheit',
  // 'min_temp': 'Min temperature Farenheit',
  // 'moon_phase': 'Moon Phase',
  // 'moon_phase_lunation': 'Moon Phase Lunation',
  // 'moonrise_ts': 'Moonrise Timestamp',
  // 'moonset_ts': 'Moonset Timestamp',
  // 'ozone': 'Average Ozone (Dobson units)',
  'pop': 'Probability of Precipitation (%)',
  'precip': 'Accumulated liquid equivalent precipitation (Inches)',
  'pres': 'Pressure (mb)',
  'rh': 'Relative humidity (%)',
  // 'slp': 'Sea level pressure (mb)',
  'snow': 'Accumulated snowfall (Inches)',
  'snow_depth': 'Snow Depth (Inches)',
  // 'sunrise_ts': 'Sunrise Timestamp',
  // 'sunset_ts': 'Sunset Timestamp',
  // 'temp': 'Temperature (Farenheit)',
  // 'ts': 'Unix Timestamp at UTC time',
  'uv': 'UV Index (0-11+)',
  // 'valid_date': 'The date today',
  'vis': 'Visibility (Miles)',
};

async function xApi(prompt: string): Promise<any> {
  const options = {
    method: 'POST',
    url: 'https://api.x.ai/v1/chat/completions',
    data: {
      messages: [
        {
          'role': 'system',
          'content': 'You are a wise weather doomsayer.'
        },
        {
          'role': 'user',
          'content': prompt
        }
      ],
      'model': 'grok-2-latest',
      'stream': false,
      'temperature': 0.1
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.XAI_KEY}`
    }
  };

  try {
    const response = await axios.request(options);
    const { data } = response;
    return data;
  } catch(e) {
    strapi.log.error(`X AI`, e);
    throw e;
  }

}

async function insert(messageDoc: MessageDoc): Promise<any> {

  return await strapi
    .documents('api::message.message')
    .create({
      data: messageDoc,
      status: 'published'
    });
}

async function update(docId: string, messageDoc: any): Promise<any> {

  return await strapi
    .documents('api::message.message')
    .update({
      documentId: docId,
      data: messageDoc
    });
}

const service = ({ strapi }: { strapi: Core.Strapi }) => ({

	async generate_message(forecastDoc: ForecastDoc, locationDoc: LocationDoc): Promise<any> {
    const { data, location } = forecastDoc;
    const { name, state } = locationDoc;
    let prompt = `Today's weather forecast for ${name}, ${state} is: `;

    for (const key in data) {
      if (key !== 'weather' && typeof lookup[key] !== 'undefined') {
        prompt += `${lookup[key]}: ${data[key]}, `
      }
    }

    prompt += ` Description: ${data.weather.description}.`;
    prompt += ` Please write a brief note warning people to stay away from ${name}, ${state} due to today's weather. Use descriptive language instead of citing numbers and limit the note to 144 characters.`;
    const response = await xApi(prompt);
    const {
      choices: [
        {
          message: { content },
        }
      ],
      usage: { total_tokens: usage }
    } = response;
    const date = forecastDoc.date;
    const messageDoc = { date, content, usage, location, uploaded: false };
    const exists = await strapi.documents('api::message.message').findMany({
      filters: {
        location: location.id,
        date
      },
      limit: 1,
    });
    let result = {};

    if (exists.length === 0) {
      result = await insert(messageDoc)
    } else {
      result = await update(exists[0].documentId, messageDoc);
    }

    return result;
  }
});

export default service;
