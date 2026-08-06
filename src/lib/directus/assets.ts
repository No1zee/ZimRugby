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

const UUID_RE = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

export function assetUrl(id?: string, transform?: ImageTransformations, fallbackUrl: string = '/zru-placeholder-hero.webp'): string {
  if (!id) return fallbackUrl;
  if (id.startsWith("http://") || id.startsWith("https://") || id.startsWith("/")) {
    return id;
  }
  if (!UUID_RE.test(id)) return fallbackUrl;

  const url = new URL(`/api/assets/${id}`, "http://localhost:3000");

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
    if (transform.format) {
      url.searchParams.append("format", transform.format);
    } else {
      url.searchParams.append("format", "webp");
    }
  }

  return url.pathname + url.search;
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
