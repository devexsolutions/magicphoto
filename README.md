# MagicPhoto

This project allows you to upload a photo and transform it with generative AI templates.

## Environment variables

The application expects the following variables to be defined:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Supabase access.
- `OPENAI_API_KEY` for the backend server so it can call the OpenAI API.

The frontend communicates with a small Node.js server that proxies image generation requests. Start it with:

```bash
npm run start:server
```

The service is implemented using a generic interface so it can be extended to other providers in the future.

