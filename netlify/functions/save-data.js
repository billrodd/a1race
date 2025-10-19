// netlify/functions/save-data.js
import { getStore } from '@netlify/blobs';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,x-admin-token',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  }

  const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
  if (ADMIN_TOKEN) {
    const provided =
      event.headers['x-admin-token'] || event.headers['X-Admin-Token'];
    if (provided !== ADMIN_TOKEN) {
      return { statusCode: 401, headers: cors, body: 'Unauthorized' };
    }
  }

  let payload;
  try { payload = JSON.parse(event.body || '{}'); } catch (_) {}

  if (!payload || !Array.isArray(payload.techs) || typeof payload.sales !== 'object') {
    return { statusCode: 400, headers: cors, body: 'Bad payload' };
  }

  const store = getStore('race');
  await store.setJSON('race-data', payload);
  return { statusCode: 200, headers: cors, body: 'OK' };
};
