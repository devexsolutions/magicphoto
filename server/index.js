const express = require('express');
const multer = require('multer');

const upload = multer();

const app = express();

app.post('/api/convert-image', upload.single('image'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const file = req.file;
    if (!file || !prompt) {
      return res.status(400).json({ error: 'Missing image or prompt' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing API key' });
    }

    const formData = new FormData();
    formData.append('image', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
    formData.append('prompt', prompt);
    formData.append('n', '1');
    formData.append('size', '1024x1024');

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: 'OpenAI error' });
    }

    const url = data.data?.[0]?.url;
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
