export interface ImageConversionService {
  convertImage(options: { image: File; prompt: string }): Promise<string>;
}

export class OpenAIImageConversionService implements ImageConversionService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async convertImage({ image, prompt }: { image: File; prompt: string }): Promise<string> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);
    formData.append('n', '1');
    formData.append('size', '1024x1024');

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('OpenAI image generation failed');
    }

    const data = await response.json();
    return data.data?.[0]?.url as string;
  }
}

export function createImageConversionService(): ImageConversionService {
  const provider = import.meta.env.VITE_IMAGE_API_PROVIDER || 'openai';

  if (provider === 'openai') {
    const key = import.meta.env.VITE_OPENAI_KEY;
    if (!key) {
      throw new Error('Missing OpenAI API key');
    }
    return new OpenAIImageConversionService(key);
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
