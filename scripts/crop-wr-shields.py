import json
import os
from PIL import Image

with open('scripts/wr-shield-mappings.json', 'r') as f:
    mappings = json.load(f)

# Load the @x2 high-res sprite (or fallback to standard)
sprite_path_x2 = 'public/images/teams/tLogo80x-sprite@x2.png'
sprite_path = 'public/images/teams/tLogo80x-sprite.png'

output_dir = 'public/images/shields'
os.makedirs(output_dir, exist_ok=True)

if os.path.exists(sprite_path_x2):
    img = Image.open(sprite_path_x2)
    # The @x2 sprite is double resolution
    scale = 2
else:
    img = Image.open(sprite_path)
    scale = 1

print(f"Loaded sprite: {img.size}, scale: {scale}")

extracted_count = 0
for code, pos in mappings.items():
    x = abs(pos['x']) * scale
    y = abs(pos['y']) * scale
    w = pos['width'] * scale
    h = pos['height'] * scale

    # Crop individual national shield
    shield_crop = img.crop((x, y, x + w, y + h))
    
    # Save as high-res PNG and WebP
    out_png = os.path.join(output_dir, f"{code}.png")
    out_webp = os.path.join(output_dir, f"{code}.webp")
    
    shield_crop.save(out_png, "PNG")
    shield_crop.save(out_webp, "WEBP", quality=95)
    extracted_count += 1

print(f"Successfully extracted {extracted_count} high-res national team shields to {output_dir}")
