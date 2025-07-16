import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer();

async function describeImage(buffer, mimetype) {
  const base64 = buffer.toString('base64');
  const payload = {
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Describe the image in detail.' },
          {
            type: 'image_url',
            image_url: { url: `data:${mimetype};base64,${base64}` },
          },
        ],
      },
    ],
    max_tokens: 200,
  };

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Vision request failed: ${text}`);
  }

  const data = await resp.json();
  const description = data.choices?.[0]?.message?.content?.trim();
  return description || '';
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Support both /api/openai/edit and /generate/api/openai/edit in case the
// frontend is hosted under a sub-path (e.g. /generate). This prevents 404
// errors when the API is called with the sub-path prefix.
const editPaths = ['/api/openai/edit', '/generate/api/openai/edit'];
app.post(editPaths, upload.single('image'), async (req, res) => {
  const prompt = req.body.prompt;
  const file = req.file;

  if (!prompt || !file) {
    return res.status(400).json({ error: 'Missing prompt or image' });
  }

  try {
    // First generate a description of the uploaded image using GPT-4 Vision
    const description = await describeImage(file.buffer, file.mimetype);

    const combinedPrompt = `${prompt}\n\n${description}`;


    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: 'OpenAI request failed', details: text });
    }

    const data = await response.json();
    res.json({ url: data.data?.[0]?.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
