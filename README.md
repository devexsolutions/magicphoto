# MagicPhoto

This project allows you to upload a photo and transform it with generative AI templates.

## Environment variables

The application expects the following variables to be defined at build time:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Supabase access.
- `VITE_BACKEND_URL` pointing to the backend server. This value is read in `src/lib/imageApi.ts` and used as the base URL for image generation requests.
- `VITE_IMAGE_API_PROVIDER` (optional) to choose the image generation provider. Currently only `openai` is implemented and used by default.

The backend server requires an additional environment variable:

- `OPENAI_API_KEY` used to call the OpenAI image API.

Start the backend using:

```bash
npm run server
```


## Netlify deployment

When deployed on Netlify, the image generation API is handled by a serverless function defined in `netlify/functions/edit.js`. Redirect rules in `netlify.toml` map both `/api/openai/edit` and `/generate/api/openai/edit` to this function, preventing 404 errors when the site is served from a sub-path.

Local development can still use the Express server with:

```bash
npm run server
```
