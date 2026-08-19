# Design System Document

## 1. Overview & Creative North Star: "Milk White Premium"
The design system for Zimbabwe Rugby Union (ZimRugby) is built around a clean, institutional, yet highly dynamic aesthetic. The core visual identity shifts away from dark, heavy interfaces towards a "Milk White" premium feel, accented by the official ZRU Green. 

## 2. Color Palette
- **Primary Green (ZRU Green)**: `#006747` (Pantone 349 C). This is the primary brand accent color.
- **Accent Teal**: `#00C88C`. Secondary accent for highlights, badges, and interactive emphasis.
- **Background (Milk White)**: `#FDFBF0`. This serves as the primary canvas for the application, providing a warm, premium feel.
- **Base Text (Black / Rich Black)**: `#000000` / `#0A1A12`. High contrast for readability against the Milk White background.
- **Contrasts (White)**: `#FFFFFF`. Used for text on dark backgrounds or solid structural elements.

## 3. Typography & Two-Tone Heading Plate Standard
The typography system relies on two main typefaces and an athletic two-tone plate system across all section titles:
- **Headings & Display**: `Unison Pro` (and `Unison`). Used exclusively for strong, impactful headlines and large display text.
- **Body & Subheadings**: `Helvetica Neue LT Std`. Used for all body copy, subheadings, and UI elements.

### Two-Tone Slanted Heading Plate (`heading-plate`)
All major section headings across the entire application must use the signature athletic two-tone heading plate:
- **Slanted Tint Plate**: Rendered using `.heading-plate` (`clip-path: polygon(14px 0%, 100% 0%, calc(100% - 14px) 100%, 0% 100%)` with a subtle `rgba(0, 103, 71, 0.12)` ZRU Green tint behind the text on light canvases, or `rgba(255, 255, 255, 0.18)` on dark canvases).
- **Two-Tone Color Contrast**:
  - **Line 1 / Primary Words**: Solid Rich Black (`#000000` / `text-rich-black`) on light backgrounds, or Crisp White (`#FFFFFF`) on dark backgrounds.
  - **Line 2 / Accent Words**: ZRU Green (`#006747` / `text-zru-green`) on light backgrounds, or Accent Teal (`#00C88C` / `text-accent-teal`) on dark backgrounds.
- **Example Pattern**:
  ```tsx
  <div className="heading-plate">
    <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-wide leading-[1.05]">
      <span className="block text-rich-black">MATCHDAY, MEDIA &</span>
      <span className="block text-zru-green">MERCHANDISE</span>
    </h2>
  </div>
  ```

## 4. Component Styles
- **Buttons**:
  - Primary: ZRU Green background, white text. Incorporate a subtle "slanted" or athletic cut (`clip-slanted`).
  - Hover states should intensify the green or add a frosted glass inner glow, never a gold ring.
- **Cards & Surfaces**:
  - Bento-grid style layouts.
  - Border radius: `16px`.
  - Dark cards on the Milk White background use a "frosted glass" effect: ZRU Green tinted background with backdrop blur and a subtle green border.
  - Bento Hero Spotlight Card: Features a `24px` (`rounded-[24px]`) border radius, deep forest green frosted glass backdrop (`bg-[#002214]/60 backdrop-blur-xl`), solid white category badges with green text, high-contrast ZRU Green/Teal `VS` separator, and athletic action buttons.

## 5. Spacing & Layout
- Generous padding and "obsessive whitespace" are required to maintain the premium feel.
- Standard border radii for inputs and smaller buttons: `0.5rem`.

## 6. Asset & Crest Sourcing Blueprint
- **Official Team Crest Sourcing Required**: All national team logos (Zimbabwe Sables, Lady Sables, Junior Sables, Cheetahs) and opposition team crests (Namibia, Kenya, Uganda, World Rugby participants) must be sourced as high-resolution vector SVGs or transparent high-DPI PNG master assets to eliminate pixelation and ensure crisp 4K display.
- **Commercial Partner Logos**: Sponsor logos (Nedbank, CFAO Mobility, Gilbert, Seed Co, BLK) must strictly use official mono-chrome vector SVGs aligned with the ZRU Green visual system.
