export interface ImageConversionService {
  convertImage(options: { image: File; prompt: string }): Promise<string>;
}

class BackendImageConversionService implements ImageConversionService {
  private endpoint: string;

  constructor(endpoint = '/api/convert-image') {
    this.endpoint = endpoint;
  }

  async convertImage({ image, prompt }: { image: File; prompt: string }): Promise<string> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);

    const response = await fetch(this.endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image conversion failed');
    }
    const data = await response.json();
    return data.url as string;
  }
}

export function createImageConversionService(): ImageConversionService {
  return new BackendImageConversionService();
}
