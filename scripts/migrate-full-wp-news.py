import urllib.request
import json
import html
import re
import os
from datetime import datetime

print("Fetching all posts from zru.co.zw...")
url = "https://zru.co.zw/wp-json/wp/v2/posts?per_page=100&_embed=true"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})

with urllib.request.urlopen(req) as resp:
    posts = json.loads(resp.read().decode())

print(f"Successfully fetched {len(posts)} articles from WordPress API.")

reports = []

for idx, p in enumerate(posts):
    post_id = str(p.get("id"))
    slug = p.get("slug") or f"article-{post_id}"
    raw_title = p.get("title", {}).get("rendered", "")
    title = html.unescape(raw_title).strip()
    
    raw_content = p.get("content", {}).get("rendered", "")
    
    # Clean up elementor/wp inline style quirks while preserving HTML structure
    cleaned_content = re.sub(r'style="[^"]*"', '', raw_content)
    cleaned_content = re.sub(r'class="[^"]*"', '', cleaned_content)
    cleaned_content = re.sub(r'<div[^>]*>\s*</div>', '', cleaned_content)
    cleaned_content = re.sub(r'<p[^>]*>\s*</p>', '', cleaned_content)
    cleaned_content = html.unescape(cleaned_content).strip()
    
    # Excerpt: clean text without HTML
    raw_excerpt = p.get("excerpt", {}).get("rendered", "")
    clean_excerpt = re.sub(r'<[^>]+>', ' ', raw_excerpt).strip()
    clean_excerpt = html.unescape(re.sub(r'\s+', ' ', clean_excerpt))
    if not clean_excerpt or len(clean_excerpt) < 20:
        plain_text = re.sub(r'<[^>]+>', ' ', cleaned_content).strip()
        plain_text = re.sub(r'\s+', ' ', plain_text)
        clean_excerpt = plain_text[:180] + "..." if len(plain_text) > 180 else plain_text

    # Image
    featured_media = ""
    try:
        embedded = p.get("_embedded", {})
        media_list = embedded.get("wp:featuredmedia", [])
        if media_list and isinstance(media_list, list) and len(media_list) > 0:
            featured_media = media_list[0].get("source_url", "")
    except Exception:
        pass
        
    if not featured_media:
        featured_media = "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1200&auto=format&fit=crop"

    # Date formatting
    date_raw = p.get("date", "")
    date_formatted = "2026"
    if date_raw:
        try:
            dt = datetime.fromisoformat(date_raw)
            date_formatted = dt.strftime("%B %d, %Y").upper()
        except Exception:
            date_formatted = date_raw[:10]

    report = {
        "id": str(idx),
        "slug": slug,
        "title": title,
        "excerpt": clean_excerpt,
        "content": cleaned_content,
        "date": date_formatted,
        "image": featured_media,
        "category": "Sables",
        "url": f"/media/{slug}",
        "source": "website",
        "type": "news"
    }
    reports.append(report)
    print(f"Processed [{idx+1}/{len(posts)}]: {title[:50]}... ({len(cleaned_content)} chars)")

output_path = os.path.join("public", "data", "reports.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(reports, f, indent=2, ensure_ascii=False)

print(f"\n✅ Successfully saved {len(reports)} FULL articles to {output_path}")
