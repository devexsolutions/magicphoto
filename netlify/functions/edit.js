import { Buffer } from 'buffer';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing OpenAI API key' }) };
  }

  const contentType = event.headers['content-type'] || event.headers['Content-Type'];
  const bodyBuffer = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64')
    : Buffer.from(event.body || '', 'utf8');

  try {
    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Authorization: `Bearer ${apiKey}`,
      },
      body: bodyBuffer,
    });

    const text = await response.text();
    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OpenAI request failed', details: text }),
      };
    }

    const data = JSON.parse(text);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: data.data?.[0]?.url }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}
