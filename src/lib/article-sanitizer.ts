/**
 * Sanitizes WordPress/Elementor body HTML crawled from zru.co.zw:
 * 1. Strips Elementor wrapper divs (preserves inner content)
 * 2. Removes the duplicate <h2> title at the top of content
 * 3. Strips data-* and class attributes from Elementor containers
 * 4. Allows zru.co.zw image src through (external, rendered unoptimized)
 * 5. Normalizes whitespace and removes empty paragraphs
 *
 * This runs server-side (no DOM API needed — pure regex/string ops).
 */
export function sanitizeArticleHtml(html: string, articleTitle: string): string {
  if (!html) return "";

  let out = html;

  // 1. Strip Elementor wrapper divs — unwrap their inner content.
  //    Matches: <div data-elementor-*...> or <div data-element_type="container"...>
  //    We do multiple passes to handle nesting.
  for (let i = 0; i < 8; i++) {
    out = out.replace(
      /<div[^>]*\s(?:data-elementor-[a-z_-]+|data-element_type|data-widget_type|data-id)[^>]*>([\s\S]*?)<\/div>/gi,
      "$1"
    );
  }

  // 2. Strip remaining bare class-only Elementor divs (no semantic meaning)
  out = out.replace(/<div\s+class="[^"]*elementor[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, "$1");

  // 3. Remove duplicate title h2 at top — matches first <h2> whose text content
  //    roughly equals the article title (case-insensitive, ignore HTML tags inside).
  const titleText = articleTitle.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  out = out.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/i, (match, inner) => {
    const innerText = inner.replace(/<[^>]+>/g, "").toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
    // Remove if inner text starts with or equals the article title
    if (innerText.startsWith(titleText.slice(0, 30)) || titleText.startsWith(innerText.slice(0, 30))) {
      return "";
    }
    return match;
  });

  // 4. Strip data-* attributes and style="" from all remaining tags
  out = out.replace(/\s(?:data-[\w-]+|style|class)="[^"]*"/gi, "");
  out = out.replace(/\s(?:data-[\w-]+|style|class)='[^']*'/gi, "");

  // 5. Strip fetchpriority, decoding, srcset, sizes on img (we control rendering)
  out = out.replace(/\s(?:fetchpriority|decoding|srcset|sizes|loading)="[^"]*"/gi, "");

  // 6. Strip WordPress figure wrappers (keep img inside)
  out = out.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, "$1");

  // 7. Remove empty paragraphs and stray whitespace paragraphs
  out = out.replace(/<p[^>]*>\s*(?:&nbsp;|\s)*<\/p>/gi, "");

  // 8. Strip legacy WordPress post-meta lists, author links, and comment counts
  out = out.replace(/<ul[^>]*class="[^"]*(?:post-meta|entry-meta|meta)[^"]*"[^>]*>[\s\S]*?<\/ul>/gi, "");
  out = out.replace(/<ul[^>]*>(?:(?!<\/ul>)[\s\S])*?(?:Webmaster|\d+\s*Comments?|Leave a comment|#respond)[\s\S]*?<\/ul>/gi, "");
  out = out.replace(/<ol[^>]*>(?:(?!<\/ol>)[\s\S])*?(?:Webmaster|\d+\s*Comments?|Leave a comment|#respond)[\s\S]*?<\/ol>/gi, "");
  out = out.replace(/<li[^>]*>(?:(?!<\/li>)[\s\S])*?(?:Webmaster|\d+\s*Comments?|Leave a comment|#respond)[\s\S]*?<\/li>/gi, "");
  out = out.replace(/<p[^>]*>(?:(?!<\/p>)[\s\S])*?(?:ZRU Webmaster|\d+\s*Comments?|Leave a comment)[\s\S]*?<\/p>/gi, "");

  // 9. Remove "Issued by..." footer lines (legacy sign-off, not editorial content)
  out = out.replace(/<p[^>]*>(?:(?!<\/p>)[\s\S])*?Issued by[\s\S]*?<\/p>/gi, "");

  // 10. Remove contact info paragraphs (Marketing@zru.co.zw etc) - bounded to single paragraph
  out = out.replace(/<p[^>]*>(?:(?!<\/p>)[\s\S])*?(?:Contact Information|Marketing@zru\.co\.zw)[\s\S]*?<\/p>/gi, "");

  // 11. Normalise legacy zru.co.zw email links → plain text
  out = out.replace(/<a\s+href="mailto:[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, "$1");

  // 12. Trim leading/trailing whitespace
  out = out.trim();

  return out;
}

/**
 * Extracts a clean dek/lead from the article content.
 * The "dek" is the first meaningful paragraph after removing the title h2.
 * Returns null if the excerpt already IS the dek (to avoid duplication).
 */
export function extractDek(content: string, excerpt: string, title: string): string | null {
  if (!content) return null;

  // Get first <p> text from content
  const firstPMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!firstPMatch) return null;

  const firstPText = firstPMatch[1].replace(/<[^>]+>/g, "").trim();

  // Don't show dek if it's basically the title repeated or excerpt repeated
  const titleNorm = title.toLowerCase().replace(/[^a-z0-9\s]/g, "").slice(0, 40);
  const excerptNorm = excerpt.toLowerCase().replace(/[^a-z0-9\s]/g, "").slice(0, 40);
  const dekNorm = firstPText.toLowerCase().replace(/[^a-z0-9\s]/g, "").slice(0, 40);

  if (dekNorm.startsWith(titleNorm.slice(0, 20)) || dekNorm.startsWith(excerptNorm.slice(0, 20))) {
    return null;
  }

  if (firstPText.length < 20) return null;

  return firstPText;
}
