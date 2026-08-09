import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const MANIFEST_PATH = path.join(process.cwd(), 'public', 'data', 'media-manifest.json');

const BREAKPOINTS = [480, 768, 1200, 1600];
const FORMATS = ['avif', 'webp'] as const;

interface ImageVariant {
  width: number;
  format: string;
  filename: string;
  sizeBytes: number;
  src: string;
}

interface ImageManifestEntry {
  original: string;
  originalWidth: number;
  originalHeight: number;
  aspectRatio: number;
  blurDataURL: string;
  variants: ImageVariant[];
}

type Manifest = Record<string, ImageManifestEntry>;

async function generateBlurPlaceholder(imagePath: string): Promise<string> {
  const buffer = await sharp(imagePath)
    .resize(10, 10, { fit: 'inside' })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

async function processImage(filepath: string, relativePath: string, manifest: Manifest) {
  try {
    const metadata = await sharp(filepath).metadata();
    if (!metadata.width || !metadata.height) return;

    const blurDataURL = await generateBlurPlaceholder(filepath);
    
    const entry: ImageManifestEntry = {
      original: relativePath,
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      aspectRatio: metadata.width / metadata.height,
      blurDataURL,
      variants: [],
    };

    const parsedPath = path.parse(filepath);

    for (const width of BREAKPOINTS) {
      if (width > metadata.width) continue;

      for (const format of FORMATS) {
        const outFilename = `${parsedPath.name}-${width}w.${format}`;
        const outPath = path.join(parsedPath.dir, outFilename);
        
        // Skip if already exists
        if (!fs.existsSync(outPath)) {
          let pipeline = sharp(filepath).resize(width);
          
          if (format === 'avif') {
            pipeline = pipeline.avif({ quality: 65, effort: 4 });
          } else if (format === 'webp') {
            pipeline = pipeline.webp({ quality: 75, effort: 4 });
          }
          
          await pipeline.toFile(outPath);
        }

        const outStat = fs.statSync(outPath);
        entry.variants.push({
          width,
          format,
          filename: outFilename,
          sizeBytes: outStat.size,
          src: `/images/${path.relative(PUBLIC_IMAGES_DIR, parsedPath.dir).replace(/\\/g, '/')}/${outFilename}`.replace('//', '/'),
        });
      }
    }

    manifest[relativePath.replace(/\\/g, '/')] = entry;
    console.log(`✅ Processed: ${relativePath}`);
  } catch (err) {
    console.error(`❌ Failed to process ${relativePath}:`, err);
  }
}

async function scanDirectory(dir: string, manifest: Manifest) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await scanDirectory(fullPath, manifest);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext) && !entry.name.match(/-\d{3,4}w\.(avif|webp)$/)) {
        const relativePath = path.relative(PUBLIC_IMAGES_DIR, fullPath);
        await processImage(fullPath, relativePath, manifest);
      }
    }
  }
}

async function main() {
  console.log('🖼️  Starting image optimization pipeline...');
  const manifest: Manifest = {};
  
  // Create data dir if not exists
  const dataDir = path.dirname(MANIFEST_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  await scanDirectory(PUBLIC_IMAGES_DIR, manifest);
  
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n✨ Optimization complete! Manifest saved to ${MANIFEST_PATH}`);
}

main().catch(console.error);
