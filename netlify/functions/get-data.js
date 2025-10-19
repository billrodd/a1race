// get-data.js
import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  const store = getStore('race');
  const data =
    (await store.get('race-data', { type: 'json' })) || {
      techs: ['Austin', 'Adam', 'Tim', 'Kaleb'],
      sales: {
        Austin: Array(12).fill(0),
        Adam: Array(12).fill(0),
        Tim: Array(12).fill(0),
        Kaleb: Array(12).fill(0),
      },
    };

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', ...cors },
    body: JSON.stringify(data),
  };
};
