import json
import os
from PIL import Image

output_dir = 'public/images/shields'

# Copy aliases:
# DZA -> Algeria (ALG)
# ASM/ASA -> Samoa (SAM)
# TGA -> Tonga (TON)
# CIV -> Ivory Coast (CIV)
# TZA -> Tanzania (TAN)
# RSA -> South Africa (SAF)
# FJI/FIJ -> Fiji
# ZIM -> Zimbabwe

aliases = {
    'alg': 'dza',
    'sam': 'asm',
    'ton': 'tga',
    'saf': 'rsa',
    'uga': 'ken', # Fallback neighbor if Uganda not in WR sprite or keep SVG
}

for target, src in aliases.items():
    src_webp = os.path.join(output_dir, f"{src}.webp")
    src_png = os.path.join(output_dir, f"{src}.png")
    if os.path.exists(src_webp):
        out_webp = os.path.join(output_dir, f"{target}.webp")
        out_png = os.path.join(output_dir, f"{target}.png")
        with open(src_webp, 'rb') as f_in, open(out_webp, 'wb') as f_out:
            f_out.write(f_in.read())
        with open(src_png, 'rb') as f_in, open(out_png, 'wb') as f_out:
            f_out.write(f_in.read())
        print(f"Created alias {target} -> {src}")
