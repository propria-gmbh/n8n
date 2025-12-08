import sharp from 'sharp';

export const downloadImage = async (url: string): Promise<Buffer> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image ${url} (${response.status})`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export const isAnimatedImage = async (buffer: Buffer): Promise<boolean> => {
  const metadata = await sharp(buffer, { animated: true }).metadata();
  return Boolean((metadata.pages ?? 0) > 1);
};

export const convertToWebp = async (buffer: Buffer, quality: number): Promise<Buffer> =>
  sharp(buffer, { animated: false })
    .webp({ quality })
    .toBuffer();
