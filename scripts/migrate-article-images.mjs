import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const REPORTS_PATH = path.resolve(process.cwd(), "public/data/reports.json");
const UPLOADS_DIR = path.resolve(process.cwd(), "public/images/legacy-articles");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { headers: { "User-Agent": "ZRU-Migration-Bot/1.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: Status ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve(true);
      });
    });
    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function run() {
  console.log("Reading reports from:", REPORTS_PATH);
  const data = JSON.parse(fs.readFileSync(REPORTS_PATH, "utf-8"));
  let updatedCount = 0;

  for (const item of data) {
    // 1. Process Hero Image
    if (item.image && item.image.includes("zru.co.zw")) {
      try {
        const urlObj = new URL(item.image);
        const filename = path.basename(urlObj.pathname);
        const localPath = path.join(UPLOADS_DIR, filename);
        const publicPath = `/images/legacy-articles/${filename}`;

        if (!fs.existsSync(localPath)) {
          console.log(`Downloading hero: ${item.image} -> ${filename}`);
          await downloadImage(item.image, localPath);
        }
        item.image = publicPath;
        updatedCount++;
      } catch (err) {
        console.warn(`[SKIP] Hero image ${item.image}:`, err.message);
      }
    }

    // 2. Process Embedded Images in content HTML
    if (item.content && item.content.includes("zru.co.zw")) {
      const imgRegex = /https:\/\/zru\.co\.zw\/wp-content\/uploads\/[^\s"'>]+/gi;
      const matches = item.content.match(imgRegex) || [];
      for (const imgUrl of matches) {
        try {
          const cleanUrl = imgUrl.replace(/&amp;/g, "&");
          const urlObj = new URL(cleanUrl);
          const filename = path.basename(urlObj.pathname);
          const localPath = path.join(UPLOADS_DIR, filename);
          const publicPath = `/images/legacy-articles/${filename}`;

          if (!fs.existsSync(localPath)) {
            console.log(`Downloading inline img: ${cleanUrl} -> ${filename}`);
            await downloadImage(cleanUrl, localPath);
          }
          item.content = item.content.replaceAll(imgUrl, publicPath);
          updatedCount++;
        } catch (err) {
          console.warn(`[SKIP] Inline image ${imgUrl}:`, err.message);
        }
      }
    }
  }

  fs.writeFileSync(REPORTS_PATH, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Migration complete! Successfully processed and saved local paths for assets.`);
}

run().catch(console.error);
