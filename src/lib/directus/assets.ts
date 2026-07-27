/**
 * Central asset URL builder for Directus CMS managed assets.
 * Supports on-the-fly transformations using query parameters.
 */

interface ImageTransformations {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'png' | 'jpg';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
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
    if (transform.fit) {
      url.searchParams.append("fit", transform.fit);
    }
    // Set webp as standard default
    if (transform.format) {
      url.searchParams.append("format", transform.format);
    } else {
      url.searchParams.append("format", "webp");
    }
  }

  return url.toString();
}

/** Hero banner — full-width, high quality */
export function heroAssetUrl(id?: string): string | undefined {
  return assetUrl(id, { width: 1920, quality: 80, fit: 'cover' });
}

/** Team logo — small, square */
export function logoAssetUrl(id?: string): string | undefined {
  return assetUrl(id, { width: 96, quality: 75, fit: 'contain' });
}

/** Gallery / event photo — medium */
export function photoAssetUrl(id?: string): string | undefined {
  return assetUrl(id, { width: 800, quality: 75, fit: 'cover' });
}

/** Video thumbnail — small */
export function thumbnailAssetUrl(id?: string): string | undefined {
  return assetUrl(id, { width: 400, quality: 70, fit: 'cover' });
}

/** Player headshot — small */
export function headshotAssetUrl(id?: string): string | undefined {
  return assetUrl(id, { width: 200, quality: 75, fit: 'cover' });
}
