export interface ImageConversionService {
  convertImage(options: { image: File; prompt: string }): Promise<string>;
}

export class BackendImageConversionService implements ImageConversionService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    // Normalize the base URL and store it for later requests
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async convertImage({ image, prompt }: { image: File; prompt: string }): Promise<string> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);

    const response = await fetch(`${this.baseUrl}/api/openai/edit`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image generation failed');
    }

    const data = await response.json();
    return data.url as string;
  }
}

export function createImageConversionService(): ImageConversionService {
  const provider = import.meta.env.VITE_IMAGE_API_PROVIDER || 'openai';

  if (provider === 'openai') {
    // Base URL for the backend API. If not provided, fall back to the local
    // development server when running on the Vite dev port (5173). This avoids
    // 404 errors when the frontend and backend run on different ports.
    const defaultUrl =
      window.location.port === '5173'
        ? `${window.location.protocol}//${window.location.hostname}:3001`
        : window.location.origin;

    const url = import.meta.env.VITE_BACKEND_URL || defaultUrl;
    return new BackendImageConversionService(url);
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
