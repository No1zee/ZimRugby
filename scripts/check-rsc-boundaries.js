const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "../src");

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
    return;
  }

  // Check if file uses client-only hooks or Framer Motion primitives
  const clientKeywords = [
    "useState",
    "useEffect",
    "useContext",
    "useReducer",
    "useRef",
    "useMemo",
    "useCallback",
    "usePathname",
    "useRouter",
    "useSearchParams",
    "framer-motion",
    "lenis"
  ];

  const usesClientHook = clientKeywords.some((keyword) => content.includes(keyword));

  if (!usesClientHook) {
    console.warn(`[RSC WARNING] File "${filePath}" has 'use client' but does not consume client hooks or Framer Motion. Consider converting to Server Component.`);
  }
}

function traverse(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      checkFile(fullPath);
    }
  }
}

console.log("[RSC AUDIT] Scanning src/ for unnecessary 'use client' directives...");
traverse(srcDir);
console.log("[RSC AUDIT] Audit complete.");
