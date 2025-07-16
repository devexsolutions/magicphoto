import { Buffer } from 'buffer';

async function describeImage(buffer, contentType, apiKey) {
  const base64 = buffer.toString('base64');
  const payload = {
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Describe the image in detail.' },
          { type: 'image_url', image_url: { url: `data:${contentType};base64,${base64}` } }
        ]
      }
    ],
    max_tokens: 200
  };

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error('Vision request failed: ' + text);
  }

  const data = await resp.json();
  const description = data.choices?.[0]?.message?.content?.trim();
  return description || '';
}

function parseMultipart(buffer, boundary) {
  const boundaryText = `--${boundary}`;
  const boundaryBuf = Buffer.from(boundaryText);
  const parts = [];
  let start = buffer.indexOf(boundaryBuf) + boundaryBuf.length + 2; // skip CRLF
  while (start < buffer.length) {
    const end = buffer.indexOf(boundaryBuf, start);
    if (end === -1) break;
    parts.push(buffer.slice(start, end - 2)); // trim CRLF
    start = end + boundaryBuf.length + 2;
  }

  const fields = {};
  for (const part of parts) {
    const headerEnd = part.indexOf('\r\n\r\n');
    const headerStr = part.slice(0, headerEnd).toString();
    const body = part.slice(headerEnd + 4);
    const nameMatch = headerStr.match(/name="([^"]+)"/);
    const name = nameMatch ? nameMatch[1] : '';
    const filenameMatch = headerStr.match(/filename="([^"]+)"/);
    if (filenameMatch) {
      const ctMatch = headerStr.match(/Content-Type: ([^\r\n]+)/);
      const contentType = ctMatch ? ctMatch[1] : 'application/octet-stream';
      fields[name] = { filename: filenameMatch[1], contentType, data: body };
    } else {
      fields[name] = body.toString();
    }
  }
  return fields;
}

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
    const boundaryMatch = contentType.match(/boundary=(.*)$/);
    if (!boundaryMatch) {
      throw new Error('Missing multipart boundary');
    }
    const boundary = boundaryMatch[1];
    const fields = parseMultipart(bodyBuffer, boundary);

    const imageField = fields.image;
    const prompt = fields.prompt;
    if (!imageField || !prompt) {
      throw new Error('Missing prompt or image');
    }

    const description = await describeImage(imageField.data, imageField.contentType, apiKey);
    const combinedPrompt = `${prompt}\n\n${description}`;


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
