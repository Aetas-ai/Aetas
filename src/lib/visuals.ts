import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import aiWorkflows from '../assets/visuals/visual-ai-workflows.webp';
import securityOps from '../assets/visuals/visual-security-ops.webp';
import globalOps from '../assets/visuals/visual-global-ops.webp';
import aboutAgi from '../assets/visuals/visual-about-agi.webp';
import operationsCommand from '../assets/visuals/agi-operations-command.webp';

/** Shared content visuals, optimized by astro:assets at build time. */
export const visuals = { aiWorkflows, securityOps, globalOps, aboutAgi, operationsCommand };

export type ResponsiveImage = { src: string; srcset: string; width: number; height: number };

/**
 * Resolves responsive WebP variants for React islands, which cannot call
 * getImage themselves. Astro templates should use <Image> directly.
 */
export async function responsiveImage(image: ImageMetadata, widths = [480, 768, 1080, 1440]): Promise<ResponsiveImage> {
  const result = await getImage({ src: image, widths, format: 'webp' });
  return {
    src: result.src,
    srcset: result.srcSet.attribute,
    width: image.width,
    height: image.height,
  };
}
