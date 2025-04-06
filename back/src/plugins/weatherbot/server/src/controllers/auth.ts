import type { Core } from '@strapi/strapi';
import { generate_code_verifier, generate_code_challenge } from '../utils/pkce';
import axios from 'axios';
import qs from 'qs';
import crypto from 'crypto';

const stateStore = new Map();
const X_API_CLIENT_ID = process.env.X_API_CLIENT_ID || '';
const X_API_REDIRECT_URI = process.env.X_API_REDIRECT_URI || '';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({

	async status(ctx) {
    let connected = false;
    const tokens = await strapi
      .plugin('weatherbot')
      .service('auth')
      .get_tokens();

    if (tokens) {
      const { expires_at } = tokens;

      if (Date.now() < expires_at) {
        connected = true;
      }

    }
    
    ctx.body = connected;
  },

  async auth(ctx) {
    const state = crypto.randomUUID();
    const code_verifier = generate_code_verifier();
    const code_challenge = generate_code_challenge(code_verifier);
    stateStore.set(state, code_verifier);
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: X_API_CLIENT_ID,
      redirect_uri: X_API_REDIRECT_URI,
      scope: 'tweet.write tweet.read users.read offline.access',
      state,
      code_challenge,
      code_challenge_method: 'S256'
    });
    ctx.redirect(`https://twitter.com/i/oauth2/authorize?${params.toString()}`);
  },

  async callback(ctx) {
    const { code, state } = ctx.query;
    const code_verifier = stateStore.get(state as string);

    if (!code_verifier) return ctx.badRequest('Invalid or expired state');

    const tokenRes = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      qs.stringify({
        code,
        client_id: X_API_CLIENT_ID,
        redirect_uri: X_API_REDIRECT_URI,
        grant_type: 'authorization_code',
        code_verifier
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    const { access_token, refresh_token, expires_in } = tokenRes.data;
    await strapi
      .plugin('weatherbot')
      .service('auth')
      .store_tokens({
        access_token,
        refresh_token,
        expires_at: Date.now() + expires_in * 1000
      });
    ctx.body = 'X account connected. You can close this tab.'
  }

});

export default controller;
