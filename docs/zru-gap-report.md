# Gap Analysis: zru.co.zw vs zimrugby.vercel.app

This report summarizes structural, content, and design gaps identified during migration of the live ZRU site to our unified template system.

## 1. Missing Sections on Target Site

* **Video Hub / Popular Videos:** The source site lists a dedicated video hub page/section ("Popular videos" slider with the VIDEO HUB heading). The target site requires a matching grid widget.
* **Sponsors / Partners:** The source homepage features a "Partners & Sponsors" section. The target layout should include a partner logo strip.
* **Awards Carousel:** The source site utilizes an auto-rotating carousel highlighting champions. Our target layout should map this to a static, high-end grid or badge layout.
* **Team Roster (Scopress):** The source homepage's "THE SABLES PLAYERS" block is driven by a scopress widget; the target needs a structured roster component.

## 2. Empty or Weak Content on Source

* **Sables Players Block:** Source shows "No Data". We must supply structured player statistics and roster details from secondary database/squad sheets.

## 3. Design Gaps (Carousel vs Static)

* Source renders match schedule and results as JavaScript carousels (custom `carousel-slide` and `ova-custom-events-slider owl-carousel`). Target renders a static, server-friendly match list. Data extraction used the static slide DOM, so fixture/result order and visibility differ from the animated source.

## 4. Link & Domain Differences

* Links pointing to `zru.co.zw`, `backasable.co.zw`, and `sablesrugbyshop.com` must be intercepted and redirected to static pages on `zimrugby.vercel.app`.
* The legacy page `/?page_id=3729` returns **404** on the live site; it is dropped from the source-of-truth set.

---
*Report generated automatically on 2026-08-02.*
