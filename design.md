# Design System — Taban Elevator

## Brand Essence
Engineering precision + luxury trust. The site should feel like it belongs to a company that installs elevators in five-star hotels and premium towers — not a generic industrial catalog site.

## Logo Usage
- Primary logo (attached, white circle version) used in nav (on light bg) and footer
- For dark hero/nav-on-scroll states, use a version with transparent background (extract from provided PNG) or an all-white monoline variant of the mark for small placements
- The chevron/roof geometric shape from the logo mark is extracted as a standalone **brand motif** — used as:
  - Section divider shapes (subtle, low-opacity, in background)
  - Bullet/list markers in specs
  - Loading/transition accent shape

## Color Tokens
| Token | Hex | Usage |
|---|---|---|
| `--navy-900` | #0B2A4A | Dark backgrounds, footer, hero |
| `--navy-700` | #123A63 | Secondary dark surfaces, cards on dark |
| `--blue-600` | #1565A8 | Gradient mid-tone, secondary buttons |
| `--cyan-500` | #29ABE2 | Primary accent, CTAs, links, icons |
| `--cyan-300` | #7FD1F2 | Hover glows, light accents |
| `--paper-50` | #F7F9FB | Light section backgrounds |
| `--ink-900` | #111417 | Body text on light |
| `--white` | #FFFFFF | Text on dark, card backgrounds |
| `--gold-500` | #C9A24B | Premium accents, badges, certificate frames (sparingly) |

## Typography
- **Display/Headings:** Vazirmatn ExtraBold / Bold
- **Body:** Vazirmatn Regular/Medium
- **Scale:** H1 ~56px/64px (desktop) → 32px (mobile); H2 ~40px; H3 ~28px; Body 16–18px; small 14px
- Line-height generous for Farsi readability (1.7–1.8 for body)

## Spacing & Radius
- Base spacing unit: 4px scale (Tailwind default)
- Section vertical padding: 96–128px desktop, 56–72px mobile
- Card radius: 16px; Button radius: 12px (or pill for primary CTA)

## Imagery Style (placeholders)
- Use clean geometric placeholder graphics (elevator cabin silhouette / gear icon) on navy-tinted background instead of generic gray boxes — reinforces brand even before real photos exist
- Consistent aspect ratio: 4:3 for product cards, 16:9 for hero/banners

## Motion Principles
- Easing: `ease-out` for entrances, `ease-in-out` for hover
- Durations: 200–300ms micro-interactions, 500–700ms scroll-reveals
- Never block interactivity with animation; respect `prefers-reduced-motion`

## Iconography
- Lucide icons, 1.5–2px stroke, cyan-500 default color, navy-900 on light-icon-on-dark contexts

## Tone of Voice (Farsi copy)
- Professional, confident, reassuring — emphasizes safety, precision engineering, years of experience, after-sales support
- CTAs action-oriented: "درخواست مشاوره رایگان", "مشاهده محصولات", "تماس با ما"

## Deliverable Consistency Checklist
- [ ] Every page uses only tokens from this palette (no ad-hoc colors)
- [ ] All CTAs use primary gradient button style consistently
- [ ] RTL mirroring verified on every custom icon/arrow
- [ ] Placeholder product images visually distinct from "no image" broken state
