# MagicPhoto

This project allows you to upload a photo and transform it with generative AI templates.

## Environment variables

The application expects the following variables to be defined at build time:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Supabase access.
- `VITE_BACKEND_URL` pointing to the backend server.
- `VITE_IMAGE_API_PROVIDER` (optional) to choose the image generation provider. Currently only `openai` is implemented and used by default.

The backend server requires an additional environment variable:

- `OPENAI_API_KEY` used to call the OpenAI image API.

Start the backend using:

```bash
npm run server
```

