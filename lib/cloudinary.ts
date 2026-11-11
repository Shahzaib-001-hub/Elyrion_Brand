import { v2 as cloudinary } from 'cloudinary';

// Configure the official Cloudinary v2 SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'elyrion',
  api_key: process.env.CLOUDINARY_API_KEY || 'dummy_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'dummy_secret',
  secure: true,
});

export { cloudinary };

interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
  format?: string;
  aspectRatio?: string;
}

/**
 * Returns an optimized Cloudinary delivery URL using f_auto, q_auto, and dpr_auto.
 * Handles both public_ids and fallback full URLs.
 */
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options: ImageTransformOptions = {}
): string {
  if (!publicIdOrUrl) {
    return 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop';
  }

  // If already an absolute HTTP URL (e.g. initial placeholder or external CDN)
  if (publicIdOrUrl.startsWith('http://') || publicIdOrUrl.startsWith('https://')) {
    return publicIdOrUrl;
  }

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    'elyrion';

  const transformations: string[] = ['f_auto', 'q_auto', 'dpr_auto'];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.aspectRatio) transformations.push(`ar_${options.aspectRatio}`);

  const transformString = transformations.join(',');

  // Store public_id, return signed / optimized CDN transformation URL
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicIdOrUrl}`;
}

/**
 * Generates parameters for a signed Cloudinary client-side upload.
 */
export function generateSignedUploadParams(folder: string = 'elyrion/fragrances') {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

  const paramsToSign = {
    folder,
    timestamp,
  };

  const signature = apiSecret
    ? cloudinary.utils.api_sign_request(paramsToSign, apiSecret)
    : 'mock_signature_dev';

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY || 'mock_key',
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'elyrion',
    folder,
  };
}
