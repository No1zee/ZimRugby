#!/usr/bin/env python3
"""
ZRU Media Intelligence Processing Script
-----------------------------------------
Does all the heavy lifting so the AI doesn't waste tokens:
  --scan       : Recursively scan a folder, output compact JSON manifest stub
  --optimise   : Convert/resize images to WebP for web, using manifest JSON
  --write-manifest : Merge scan + analysis results into final media-manifest.json
  --audit      : Check existing public/images/ for unoptimised files
  --stats      : Print summary stats (counts, total KB saved)

Usage examples:
  python scripts/process-media.py --scan --source "Gallery/Sables" --out scratch/scan.json
  python scripts/process-media.py --optimise --manifest scratch/scan.json --dest public/images/gallery/sables
  python scripts/process-media.py --write-manifest
  python scripts/process-media.py --stats
"""

import argparse
import json
import os
import sys
import shutil
import hashlib
from pathlib import Path
from datetime import datetime, timezone

try:
    from PIL import Image
    PIL_OK = True
except ImportError:
    PIL_OK = False
    print("[WARN] Pillow not installed. Run: pip install pillow", file=sys.stderr)

# ─── Config ────────────────────────────────────────────────────────────────────

ROOT = Path(__file__).parent.parent  # ZimRugby/
MANIFEST_PATH = ROOT / "public" / "data" / "media-manifest.json"
SCRATCH_DIR = ROOT / "scratch"
PUBLIC_IMAGES = ROOT / "public" / "images"

# Web optimisation targets: category → (max_width, max_height, quality, target label)
WEB_TARGETS = {
    "hero":     (1920, 1080, 85, "hero"),
    "gallery":  (900,  600,  82, "gallery"),
    "team":     (400,  400,  88, "team"),
    "thumb":    (400,  250,  80, "thumb"),
    "sponsor":  (200,  80,   90, "sponsor"),
    "og":       (1200, 630,  85, "og"),
}

# Infer category from folder name keywords
CATEGORY_KEYWORDS = {
    "hero":     ["hero", "banner", "cover"],
    "team":     ["team", "squad", "player", "headshot", "portrait"],
    "sponsor":  ["sponsor", "partner", "logo"],
    "event":    ["event", "ceremony", "award"],
    "training": ["training", "gym", "practice", "drill"],
    "gallery":  ["sables", "match", "game", "zambia", "nations", "battle", "women"],
}

SKIP_PREFIXES = ("._",)   # macOS metadata artefacts
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff"}
VIDEO_EXTS = {".mp4", ".mov", ".avi", ".mkv", ".webm"}

# ─── Helpers ───────────────────────────────────────────────────────────────────

def file_hash(path: Path, chunk=8192) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()[:12]

def infer_category(path: Path) -> str:
    combined = " ".join(p.lower() for p in path.parts)
    for cat, keywords in CATEGORY_KEYWORDS.items():
        if any(k in combined for k in keywords):
            return cat
    return "gallery"

def infer_photographer(path: Path) -> str:
    """Extract photographer name from folder structure."""
    parts = [p for p in path.parts if p[0].isupper() and len(p) > 2]
    # Known photographer folders
    for part in path.parts:
        if part.lower() in ["martin", "dhiran", "dhi"]:
            return part
        if part.startswith("_DHI") or "DHI" in part:
            return "DHiran"
    return ""

def infer_match_info(path: Path) -> dict:
    """Extract match/event info from folder hierarchy."""
    info = {}
    parts_lower = [p.lower() for p in path.parts]
    full_path_lower = str(path).lower()

    if "zambia" in full_path_lower and ("zimbabwe" in full_path_lower or "sables" in full_path_lower):
        info["teams"] = ["Zimbabwe Sables", "Zambia"]
        info["event"] = "Battle of Zambezi 2026"
    if "nations cup" in full_path_lower:
        info["event"] = "Africa Cup of Nations 2026"
    if "training" in full_path_lower:
        info["session_type"] = "training"
    if "gym" in full_path_lower:
        info["session_type"] = "gym"
    if "women" in full_path_lower:
        info["team"] = "Sables Women"
    elif "sables" in full_path_lower:
        info["team"] = "Zimbabwe Sables"

    # Extract week/day from path
    for part in path.parts:
        lp = part.lower()
        if lp.startswith("week "):
            info["week"] = part
        if lp.startswith("day ") or lp.startswith("game day"):
            info["day"] = part

    return info

def get_image_dims(path: Path):
    if not PIL_OK:
        return None, None
    try:
        with Image.open(path) as img:
            return img.size  # (width, height)
    except Exception:
        return None, None

def slugify(name: str) -> str:
    import re
    name = name.lower()
    name = re.sub(r"[^a-z0-9\-_]", "-", name)
    name = re.sub(r"-+", "-", name).strip("-")
    return name

def generate_label(path: Path, idx: int, match_info: dict) -> str:
    """Generate a human-readable slug from path context (no vision needed)."""
    parts = []

    team = match_info.get("team", "sables").replace(" ", "-").lower()
    parts.append(team)

    event = match_info.get("event", "")
    if "zambezi" in event.lower():
        parts.append("battle-of-zambezi")
    elif "nations" in event.lower():
        parts.append("nations-cup")

    session = match_info.get("session_type", "")
    if session:
        parts.append(session)

    week = match_info.get("week", "").replace(" ", "-").lower()
    day = match_info.get("day", "").replace(" ", "").lower()
    if week:
        parts.append(week)
    if day:
        parts.append(day)

    # Try to get a number from the original filename
    stem = path.stem
    import re
    nums = re.findall(r"\d+", stem)
    num_suffix = nums[-1] if nums else str(idx).zfill(4)

    parts.append(num_suffix)
    return slugify("-".join(p for p in parts if p))

# ─── Commands ──────────────────────────────────────────────────────────────────

def cmd_scan(source: str, out: str):
    """
    Scan a folder recursively and output a compact JSON manifest stub.
    This is the token-free alternative to listing files in the AI context.
    """
    source_path = Path(source).resolve()
    if not source_path.exists():
        print(f"[ERROR] Source not found: {source_path}", file=sys.stderr)
        sys.exit(1)

    assets = []
    skipped = []
    idx = 0

    for file_path in sorted(source_path.rglob("*")):
        if not file_path.is_file():
            continue
        if file_path.name.startswith(SKIP_PREFIXES):
            continue

        ext = file_path.suffix.lower()
        kb = round(file_path.stat().st_size / 1024, 1)

        # Compute relative path: prefer ROOT-relative, fall back to source-relative
        try:
            rel_path = str(file_path.relative_to(ROOT))
        except ValueError:
            rel_path = str(file_path.relative_to(source_path.parent))

        if ext in IMAGE_EXTS:
            match_info = infer_match_info(file_path)
            cat = infer_category(file_path)
            photographer = infer_photographer(file_path)
            label = generate_label(file_path, idx, match_info)
            w, h = get_image_dims(file_path)
            idx += 1

            assets.append({
                "id": f"{cat}-{idx:04d}",
                "label": label,
                "src_original": rel_path,
                "src_web": f"/images/{cat}/{label}.webp",
                "category": cat,
                "ext": ext,
                "kb_original": kb,
                "dims_original": {"w": w, "h": h} if w else None,
                "match_info": match_info,
                "photographer": photographer,
                "analysed": False,
                "alt": "",
                "tags": list(match_info.values()) if match_info else [],
                "hero_candidate": kb > 2000,  # >2MB originals are likely high quality
            })
        elif ext in VIDEO_EXTS:
            assets.append({
                "id": f"video-{idx:04d}",
                "label": slugify(file_path.stem),
                "src_original": rel_path,
                "src_web": f"/videos/{slugify(file_path.stem)}.webm",
                "category": "video",
                "ext": ext,
                "kb_original": kb,
                "analysed": False,
                "alt": "",
                "tags": [],
            })
            idx += 1
        else:
            skipped.append(str(file_path.name))

    summary = {
        "scanned_at": datetime.now(timezone.utc).isoformat(),
        "source": str(source_path),
        "total_images": sum(1 for a in assets if a["category"] != "video"),
        "total_videos": sum(1 for a in assets if a["category"] == "video"),
        "total_kb_original": round(sum(a["kb_original"] for a in assets), 1),
        "hero_candidates": sum(1 for a in assets if a.get("hero_candidate")),
        "skipped": len(skipped),
        "assets": assets,
    }

    out_path = Path(out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    # Print compact summary (not the full JSON — that would waste tokens)
    print(f"[OK] SCAN COMPLETE")
    print(f"   Source:          {source_path}")
    print(f"   Images found:    {summary['total_images']}")
    print(f"   Videos found:    {summary['total_videos']}")
    print(f"   Total size:      {summary['total_kb_original']:,.0f} KB ({summary['total_kb_original']/1024:.1f} MB)")
    print(f"   Hero candidates: {summary['hero_candidates']}")
    print(f"   Skipped:         {summary['skipped']}")
    print(f"   Output written:  {out_path}")
    print(f"\n   TOP HERO CANDIDATES (largest files, likely highest quality):")
    hero_sorted = sorted([a for a in assets if a.get("hero_candidate")], key=lambda x: x["kb_original"], reverse=True)
    for a in hero_sorted[:8]:
        dims = f" {a['dims_original']['w']}×{a['dims_original']['h']}" if a.get("dims_original") else ""
        print(f"   [{a['kb_original']:>7.0f} KB]{dims}  {a['src_original']}")



def cmd_optimise(manifest: str, dest: str, category_override: str = None):
    """
    Read manifest JSON, convert all images to WebP at web targets.
    Writes optimised files to dest folder. Updates manifest with web dims + KB.
    """
    if not PIL_OK:
        print("[ERROR] Pillow required. Run: pip install pillow", file=sys.stderr)
        sys.exit(1)

    manifest_path = Path(manifest)
    with open(manifest_path, encoding="utf-8") as f:
        data = json.load(f)

    assets = data.get("assets", data) if isinstance(data, dict) else data
    dest_path = Path(dest)

    stats = {"processed": 0, "skipped": 0, "errors": 0,
             "kb_before": 0, "kb_after": 0}

    for asset in assets:
        if asset.get("category") == "video":
            continue  # Skip video — use ffmpeg separately

        cat = category_override or asset.get("category", "gallery")
        target = WEB_TARGETS.get(cat, WEB_TARGETS["gallery"])
        max_w, max_h, quality, _ = target

        src_path = ROOT / asset["src_original"]
        if not src_path.exists():
            # Try resolving as absolute or relative to Gallery
            alt_path = Path(asset["src_original"]).resolve()
            if alt_path.exists():
                src_path = alt_path
            else:
                print(f"[MISS] {asset['src_original']}")
                stats["errors"] += 1
                continue

        # Build output path
        out_dir = dest_path / cat
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / f"{asset['label']}.webp"

        # Skip if already done and not stale
        if out_file.exists():
            asset["src_web"] = f"/images/{cat}/{asset['label']}.webp"
            asset["kb_web"] = round(out_file.stat().st_size / 1024, 1)
            stats["skipped"] += 1
            continue

        try:
            with Image.open(src_path) as img:
                # Convert to RGB (handles RGBA PNGs etc.)
                if img.mode in ("RGBA", "P", "LA"):
                    img = img.convert("RGB")

                # Smart resize: maintain aspect ratio, don't upscale
                orig_w, orig_h = img.size
                scale = min(max_w / orig_w, max_h / orig_h, 1.0)
                new_w = int(orig_w * scale)
                new_h = int(orig_h * scale)
                if scale < 1.0:
                    img = img.resize((new_w, new_h), Image.LANCZOS)

                img.save(out_file, "WEBP", quality=quality, method=6)

            kb_before = asset["kb_original"]
            kb_after = round(out_file.stat().st_size / 1024, 1)
            saving_pct = round((1 - kb_after / kb_before) * 100) if kb_before > 0 else 0

            asset["src_web"] = f"/images/{cat}/{asset['label']}.webp"
            asset["dims_web"] = {"w": new_w, "h": new_h}
            asset["kb_web"] = kb_after
            asset["kb_saved"] = round(kb_before - kb_after, 1)

            stats["processed"] += 1
            stats["kb_before"] += kb_before
            stats["kb_after"] += kb_after

            print(f"  [OK] {asset['label']}.webp  {kb_before:.0f}KB -> {kb_after:.0f}KB  (-{saving_pct}%)")

        except Exception as e:
            print(f"  [ERROR] {src_path.name}: {e}")
            stats["errors"] += 1

    # Save updated manifest stub
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    total_saved = stats["kb_before"] - stats["kb_after"]
    print(f"\n[OK] OPTIMISE COMPLETE")
    print(f"   Processed:    {stats['processed']}")
    print(f"   Skipped:      {stats['skipped']} (already done)")
    print(f"   Errors:       {stats['errors']}")
    if stats["kb_before"] > 0:
        pct = round((1 - stats["kb_after"] / stats["kb_before"]) * 100)
        print(f"   Size before:  {stats['kb_before']/1024:.1f} MB")
        print(f"   Size after:   {stats['kb_after']/1024:.1f} MB")
        print(f"   Total saved:  {total_saved/1024:.1f} MB  (-{pct}%)")



def cmd_write_manifest(scan_files: list = None):
    """
    Merge all scan JSON files from scratch/ into the master media-manifest.json.
    Preserves existing entries (won't overwrite alt text or tags added by AI analysis).
    """
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)

    # Load existing manifest if present
    existing = {}
    if MANIFEST_PATH.exists():
        with open(MANIFEST_PATH, encoding="utf-8") as f:
            existing_data = json.load(f)
        for asset in existing_data.get("assets", []):
            existing[asset["id"]] = asset

    # Find all scan files to merge
    if scan_files:
        sources = [Path(f) for f in scan_files]
    else:
        sources = list(SCRATCH_DIR.glob("scan*.json")) + list(SCRATCH_DIR.glob("*scan*.json"))

    merged = dict(existing)  # start from existing

    for src in sources:
        with open(src, encoding="utf-8") as f:
            data = json.load(f)
        assets = data.get("assets", [])
        for asset in assets:
            aid = asset["id"]
            if aid in merged:
                # Preserve AI-added fields, update mechanical ones
                for key in ["src_web", "dims_web", "kb_web", "kb_saved", "dims_original", "kb_original"]:
                    if key in asset:
                        merged[aid][key] = asset[key]
            else:
                merged[aid] = asset

    all_assets = list(merged.values())
    manifest = {
        "version": 2,
        "generated": datetime.now(timezone.utc).isoformat(),
        "total_assets": len(all_assets),
        "total_images": sum(1 for a in all_assets if a.get("category") != "video"),
        "total_videos": sum(1 for a in all_assets if a.get("category") == "video"),
        "analysed_count": sum(1 for a in all_assets if a.get("analysed")),
        "assets": all_assets,
    }

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"[OK] MANIFEST WRITTEN -> {MANIFEST_PATH}")
    print(f"   Total assets:  {manifest['total_assets']}")
    print(f"   Analysed:      {manifest['analysed_count']} / {manifest['total_assets']}")
    print(f"   Images:        {manifest['total_images']}")
    print(f"   Videos:        {manifest['total_videos']}")


def cmd_stats():
    """Print summary stats from the master manifest."""
    if not MANIFEST_PATH.exists():
        print("[INFO] No manifest yet. Run --scan first.")
        return
    with open(MANIFEST_PATH, encoding="utf-8") as f:
        data = json.load(f)
    assets = data.get("assets", [])
    total_kb_orig = sum(a.get("kb_original", 0) for a in assets)
    total_kb_web = sum(a.get("kb_web", 0) for a in assets if a.get("kb_web"))
    categories = {}
    for a in assets:
        c = a.get("category", "unknown")
        categories[c] = categories.get(c, 0) + 1

    print(f"[STATS] MEDIA MANIFEST STATS")
    print(f"   Generated:    {data.get('generated', 'unknown')}")
    print(f"   Total assets: {len(assets)}")
    print(f"   Analysed:     {data.get('analysed_count', 0)}")
    print(f"   By category:")
    for cat, count in sorted(categories.items()):
        print(f"     {cat:<14} {count}")
    if total_kb_web > 0:
        saved = total_kb_orig - total_kb_web
        pct = round((1 - total_kb_web / total_kb_orig) * 100) if total_kb_orig else 0
        print(f"   Size original: {total_kb_orig/1024:.1f} MB")
        print(f"   Size web:      {total_kb_web/1024:.1f} MB")
        print(f"   Savings:       {saved/1024:.1f} MB  (-{pct}%)")
    else:
        print(f"   Size original: {total_kb_orig/1024:.1f} MB")
        print(f"   Run --optimise to generate web versions.")


def cmd_audit():
    """Scan public/images/ for non-WebP files and large files that need optimising."""
    issues = []
    total = 0
    for f in PUBLIC_IMAGES.rglob("*"):
        if not f.is_file():
            continue
        ext = f.suffix.lower()
        if ext not in IMAGE_EXTS:
            continue
        total += 1
        kb = f.stat().st_size / 1024
        if ext != ".webp":
            issues.append(f"  [NOT-WEBP]  {kb:>7.0f} KB  {f.relative_to(ROOT)}")
        elif kb > 200:
            issues.append(f"  [LARGE]     {kb:>7.0f} KB  {f.relative_to(ROOT)}")

    print(f"[AUDIT] PUBLIC IMAGES AUDIT  ({total} files)")
    if issues:
        for line in issues:
            print(line)
        print(f"\n  {len(issues)} issues found.")
    else:
        print("  [OK] All good — all images are WebP and under 200 KB.")



# ─── CLI ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="ZRU Media Intelligence Pipeline")
    sub = parser.add_subparsers(dest="cmd")

    # --scan
    p_scan = sub.add_parser("scan", help="Scan folder and output manifest stub JSON")
    p_scan.add_argument("--source", required=True)
    p_scan.add_argument("--out", default="scratch/scan.json")

    # --optimise
    p_opt = sub.add_parser("optimise", help="Convert images to WebP at web targets")
    p_opt.add_argument("--manifest", required=True)
    p_opt.add_argument("--dest", default="public/images")
    p_opt.add_argument("--category", default=None)

    # --write-manifest
    p_wm = sub.add_parser("write-manifest", help="Merge scan files into master manifest")
    p_wm.add_argument("--sources", nargs="*")

    # --stats
    sub.add_parser("stats", help="Print stats from master manifest")

    # --audit
    sub.add_parser("audit", help="Audit public/images/ for issues")

    # Legacy --flag style (backward compat)
    parser.add_argument("--scan", action="store_true")
    parser.add_argument("--optimise", action="store_true")
    parser.add_argument("--write-manifest", action="store_true", dest="write_manifest_flag")
    parser.add_argument("--stats", action="store_true")
    parser.add_argument("--audit", action="store_true")
    parser.add_argument("--source")
    parser.add_argument("--out", default="scratch/scan.json")
    parser.add_argument("--manifest")
    parser.add_argument("--dest", default="public/images")
    parser.add_argument("--category")

    args = parser.parse_args()

    # Subcommand dispatch
    if args.cmd == "scan":
        cmd_scan(args.source, args.out)
    elif args.cmd == "optimise":
        cmd_optimise(args.manifest, args.dest, args.category)
    elif args.cmd == "write-manifest":
        cmd_write_manifest(args.sources)
    elif args.cmd == "stats":
        cmd_stats()
    elif args.cmd == "audit":
        cmd_audit()
    # Legacy --flag dispatch
    elif args.scan:
        cmd_scan(args.source, args.out)
    elif args.optimise:
        cmd_optimise(args.manifest, args.dest, args.category)
    elif args.write_manifest_flag:
        cmd_write_manifest()
    elif args.stats:
        cmd_stats()
    elif args.audit:
        cmd_audit()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
