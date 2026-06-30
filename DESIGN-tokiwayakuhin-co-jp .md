# Design System Inspired by 本日発売！『エクセル』から、大人気「朝用UVクリーム」のひんやりタイプが限定…

> Auto-extracted from `https://www.tokiwayakuhin.co.jp/cojp/t/t4213/` on 2026-06-30

## 1. Visual Theme & Atmosphere

Clean, minimal, and product-focused with deliberate use of whitespace.

The hero section leads with "本日発売！『エクセル』から、大人気「朝用UVクリーム」のひんやりタイプが限定登場！
水分感たっぷりのジェルクリームで、夏場のメイクのりアップ" followed by "詳しくはこちら＞＞
	https://noevirgroup.jp/excel/g/g78317/".

**Key Characteristics:**
- LocalYuGothicMedium as the heading font
- LocalYuGothicMedium as the body font for all running text
- Heading weight 700
- Light/white background (#ffffff) as the primary canvas
- Primary accent `#2ec3d0` used for CTAs and brand highlights
- Sharp corners (0-2px) for a precise, technical aesthetic
- Tags: light, sharp, accented, compact, sans-serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#2ec3d0`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
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
| 1 | `#ffffff` | `--palette-1` | button | large | text-dark |
| 2 | `#f8f8f8` | `--palette-2` | button | medium | text-dark |
| 3 | `#2ec3d0` | `--palette-3` | button | small | text-dark |
| 4 | `#f1eded` | `--palette-4` | badge | small | text-dark |
| 5 | `#9a9da1` | `--palette-5` | badge | small | text-dark |
| 6 | `#000080` | `--palette-6` | text-accent | small | text-light |

## 3. Typography Rules

- **Heading Font:** `LocalYuGothicMedium`, sans-serif
- **Body Font:** `LocalYuGothicMedium`, sans-serif

### Type Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | LocalYuGothicMedium | 20px | 700 | 31.4286px | normal |
| H2 | LocalYuGothicMedium | 14px | 700 | 22px | normal |
| Body | LocalYuGothicMedium | 14px | 400 | 22px | normal |
| Small | LocalYuGothicMedium | 11.6667px | 400 | 18.3334px | normal |

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `20px` | headings |
| H1 | `16px` | headings |
| H2 | `15px` | headings |
| H3 | `14px` | headings |
| H4 | `12px` | headings |
| Body L | `11.6667px` | body / supporting text |
| Body | `11px` | body / supporting text |
| Small | `10px` | body / supporting text |

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

### Primary Button

```css
.btn-primary {
  background: #ffffff;
  color: #565b62;
  border-radius: 300px;
  padding: 8px 10px;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid rgb(204, 204, 204);
  cursor: pointer;
}
```

## 5. Layout Principles

- **Base spacing unit:** `15px` — use multiples (30px, 45px, 60px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `15px` | element |
| spacing-2 | `36px` | card |
| spacing-3 | `8px` | element |
| spacing-4 | `10px` | element |
| spacing-5 | `5px` | element |
| spacing-6 | `18px` | element |
| spacing-7 | `19px` | element |
| spacing-8 | `20px` | element |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|

## 6. Depth & Elevation

No prominent box-shadows detected. This design likely uses flat surfaces with borders or background color changes for depth.

## 7. Do's and Don'ts

### Do
- Use `#ffffff` as the primary background color
- Use `LocalYuGothicMedium` for all headings and `LocalYuGothicMedium` for body text
- Use `#2ec3d0` as the single dominant accent/CTA color
- Maintain `15px` as the base spacing unit — all gaps should be multiples
- Keep corners sharp (0-2px radius) for a precise, technical feel
- Use weight 700 for headings to match the brand's typographic voice
- Use `line-height: 1.7-2.0` for Japanese body text
- Include Japanese font fallback (Noto Sans JP, Hiragino, Yu Gothic)

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute LocalYuGothicMedium/LocalYuGothicMedium with generic alternatives
- Don't use irregular spacing — stick to 15px grid
- Don't use dark/black backgrounds — this is a light-themed design
- Don't use large border-radius — keep everything crisp and geometric
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
- Maintain 15px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #ffffff
Text:        #565b62
Accent:      #2ec3d0
Border:      #f8f8f8
```

### Example Prompts

1. "Build a hero section with a `#ffffff` background, `LocalYuGothicMedium` heading in `#565b62`, and a `#2ec3d0` CTA button with 300px radius."
2. "Create a pricing card using background `#f8f8f8`, border `#f8f8f8`, `LocalYuGothicMedium` for text, and 45px padding."
3. "Design a navigation bar — `#ffffff` background, `#565b62` links, `#2ec3d0` for active state."
4. "Build a feature grid with 3 columns, 45px gap, each card using the card component style."
5. "Create a footer with `#565b62` background, `#ffffff` text, and 30px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Check responsive behavior — test mobile and tablet layouts
7. Final pass — verify all colors match, spacing is consistent, fonts are correct
