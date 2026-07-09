/**
 * Central asset URL builder for Directus CMS managed assets.
 * Supports on-the-fly transformations using query parameters.
 */

interface ImageTransformations {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'png' | 'jpg';
}

export function assetUrl(id?: string, transform?: ImageTransformations): string | undefined {
  if (!id) return undefined;

  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
  const url = new URL(`${baseUrl}/assets/${id}`);

  if (transform) {
    if (transform.width) {
      url.searchParams.append("width", String(transform.width));
    }
    if (transform.height) {
      url.searchParams.append("height", String(transform.height));
    }
    if (transform.quality) {
      url.searchParams.append("quality", String(transform.quality));
    }
    // Set webp as standard default if requested
    if (transform.format) {
      url.searchParams.append("format", transform.format);
    } else {
      url.searchParams.append("format", "webp");
    }
  }

  return url.toString();
}
