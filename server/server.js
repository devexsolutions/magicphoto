import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer();

app.post('/api/openai/edit', upload.single('image'), async (req, res) => {
  const prompt = req.body.prompt;
  const file = req.file;

  if (!prompt || !file) {
    return res.status(400).json({ error: 'Missing prompt or image' });
  }

  try {
    const formData = new FormData();
    formData.append('image', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
    formData.append('prompt', prompt);
    formData.append('n', '1');
    formData.append('size', '1024x1024');

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
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
