# Design System Inspired by ニュース一覧｜常盤薬品工業株式会社（ノエビアグループ）

> Auto-extracted from `https://www.tokiwayakuhin.co.jp/cojp/topic/topiclist.aspx` on 2026-06-30

## 1. Visual Theme & Atmosphere

Clean, minimal, and product-focused with deliberate use of whitespace.

The hero section leads with "ニュース".

**Key Characteristics:**
- LocalYuGothicMedium as the heading font
- LocalYuGothicMedium as the body font for all running text
- Heading weight 700
- Light/white background (#ffffff) as the primary canvas
- Primary accent `#e7382d` used for CTAs and brand highlights
- Rounded corners (20px+) creating a friendly, approachable feel
- Tags: light, rounded, accented, compact, sans-serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#e7382d`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Secondary Accent** (`#2ec3d0`) · `--color-secondary`: Secondary brand, hover states, complementary highlights.
- **Background** (`#ffffff`) · `--color-bg`: Page background, primary canvas.
- **Background Secondary** (`#f8f8f8`) · `--color-bg-secondary`: Cards, surfaces, alternating sections.

### Text
- **Text Primary** (`#565b62`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#9a9da1`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces
- **Border** (`#f8f8f8`) · `--color-border`: Dividers, outlines, input borders.

### Full Extracted Palette

| # | Hex | CSS Variable | Role | Area | Contrast |
|---|---|---|---|---|---|
| 1 | `#ffffff` | `--palette-1` | section | large | text-dark |
| 2 | `#f8f8f8` | `--palette-2` | block | large | text-dark |
| 3 | `#6cd5de` | `--palette-3` | text-accent | medium | text-dark |
| 4 | `#2ec3d0` | `--palette-4` | button | small | text-dark |
| 5 | `#e7382d` | `--palette-5` | badge | small | text-light |
| 6 | `#f1eded` | `--palette-6` | badge | small | text-dark |
| 7 | `#9a9da1` | `--palette-7` | badge | small | text-dark |

## 3. Typography Rules

- **Heading Font:** `LocalYuGothicMedium`, sans-serif
- **Body Font:** `LocalYuGothicMedium`, sans-serif

### Type Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | LocalYuGothicMedium | 22px | 700 | 34.5715px | normal |
| H2 | LocalYuGothicMedium | 20px | 700 | 31.4286px | normal |
| Body | LocalYuGothicMedium | 14px | 400 | 22px | normal |
| Small | LocalYuGothicMedium | 11.6667px | 400 | 18.3334px | normal |

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `22px` | headings |
| H1 | `20px` | headings |
| H2 | `16px` | headings |
| H3 | `15px` | headings |
| H4 | `14px` | headings |
| Body L | `12px` | body / supporting text |
| Body | `11.6667px` | body / supporting text |
| Small | `11px` | body / supporting text |
| XS | `10px` | body / supporting text |

### Japanese Typography (CJK)

This site uses Japanese (CJK) text. Apply the following rules:

- **Line height:** Use `1.7`–`2.0` for body text (CJK needs more vertical space than Latin)
- **Letter spacing:** Use `0.04em`–`0.08em` for body text (improves Japanese readability)
- **Font fallback:** Always include a Japanese font fallback: `LocalYuGothicMedium, "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif`
- **Word break:** Use `word-break: normal` and `overflow-wrap: anywhere` — never `break-all` for Japanese
- **Kinsoku (禁則処理):** Avoid line breaks before closing brackets 」）】 or after opening brackets 「（【
- **Heading line-height:** `1.3`–`1.5` (tighter than body, but looser than Latin headings)
- **Minimum body font size:** `14px` (Japanese characters are complex, smaller is hard to read)

## 4. Component Stylings

No prominent button or card components detected. Use the color palette and typography rules above to create components consistent with the brand.

## 5. Layout Principles

- **Base spacing unit:** `5px` — use multiples (10px, 15px, 20px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `5px` | element |
| spacing-2 | `15px` | element |
| spacing-3 | `36px` | card |
| spacing-4 | `10px` | element |
| spacing-5 | `20px` | element |
| spacing-6 | `30px` | card |
| spacing-7 | `8px` | element |
| spacing-8 | `18px` | element |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|
| radius-card | `20px` | card |
| radius-subtle | `3px` | subtle |

## 6. Depth & Elevation

No prominent box-shadows detected. This design likely uses flat surfaces with borders or background color changes for depth.

## 7. Do's and Don'ts

### Do
- Use `#ffffff` as the primary background color
- Use `LocalYuGothicMedium` for all headings and `LocalYuGothicMedium` for body text
- Use `#e7382d` as the single dominant accent/CTA color
- Maintain `5px` as the base spacing unit — all gaps should be multiples
- Use rounded corners (`20px`+) consistently for all interactive elements
- Use weight 700 for headings to match the brand's typographic voice
- Use `line-height: 1.7-2.0` for Japanese body text
- Include Japanese font fallback (Noto Sans JP, Hiragino, Yu Gothic)

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute LocalYuGothicMedium/LocalYuGothicMedium with generic alternatives
- Don't use irregular spacing — stick to 5px grid
- Don't use dark/black backgrounds — this is a light-themed design
- Don't use sharp corners — they feel hostile in this rounded design language
- Don't use oversized hero text — this brand uses restrained type
- Don't use pure black (#000000) for text — use `#565b62` instead
- Don't add decorative elements not present in the original design — no badges, ribbons, banners, or ornaments unless the source site uses them
- Don't invent UI patterns the source site doesn't have — if the original has no NEW badge, don't add one just because a red is in the palette
- Don't use `word-break: break-all` for Japanese text — it breaks in the middle of words
- Don't set body font size below 14px for Japanese — characters are too complex
- Don't use Latin-optimized line-height (1.2-1.4) for Japanese body text

## 8. Responsive Behavior

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, stack sections, reduce font sizes ~80% |
| Tablet | 640–1024px | 2-column where appropriate, maintain spacing ratios |
| Desktop | 1024–1440px | Full layout as designed |
| Wide | > 1440px | Max-width container, center content |

- Touch targets: minimum 44×44px on mobile
- Maintain 5px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #ffffff
Text:        #565b62
Accent:      #e7382d
Secondary:   #2ec3d0
Border:      #f8f8f8
```

### Example Prompts

1. "Build a hero section with a `#ffffff` background, `LocalYuGothicMedium` heading in `#565b62`, and a `#e7382d` CTA button."
2. "Create a pricing card using background `#f8f8f8`, border `#f8f8f8`, `LocalYuGothicMedium` for text, and 15px padding."
3. "Design a navigation bar — `#ffffff` background, `#565b62` links, `#e7382d` for active state."
4. "Build a feature grid with 3 columns, 15px gap, each card using the card component style."
5. "Create a footer with `#565b62` background, `#ffffff` text, and 10px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Check responsive behavior — test mobile and tablet layouts
7. Final pass — verify all colors match, spacing is consistent, fonts are correct
