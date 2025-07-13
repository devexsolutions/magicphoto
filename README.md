# MagicPhoto

This project allows you to upload a photo and transform it with generative AI templates.

## Environment variables

The application expects the following variables to be defined at build time:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Supabase access.
- `VITE_OPENAI_KEY` for the OpenAI image API.
- `VITE_IMAGE_API_PROVIDER` (optional) to choose the image generation provider. Currently only `openai` is implemented and used by default.

