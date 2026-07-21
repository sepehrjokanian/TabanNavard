# UI Considerations — Taban Elevator

## Direction
Premium, luxury, modern industrial brand. Think: high-end architecture/real estate site meets engineering precision. Not playful — confident, clean, spacious, with subtle motion to feel "interactive and alive."

## Layout & Language
- **RTL first-class.** All layout, icons, arrows, form fields mirrored correctly. Use `dir="rtl"` at root; use Tailwind logical properties (`ps-`, `pe-`, `ms-`, `me-`) instead of `pl-`/`pr-` to avoid mirroring bugs.
- **Typography:** A premium Farsi font — e.g. **Vazirmatn** or **Yekan Bakh** for body/UI, and a bold display cut of Vazirmatn (or IranSans Bold) for headlines. Load via `next/font` or self-hosted woff2 for performance.
- **Grid:** 12-col responsive grid, generous whitespace, max-width container ~1280–1440px with wide hero breakouts.

## Color System (from logo)
- Primary background: off-white `#F7F9FB` (light sections) and deep navy `#0B2A4A` (dark sections — hero, footer)
- Primary accent: cyan/sky blue `#29ABE2` — used for CTAs, links, highlights, icons
- Secondary accent: mid blue `#1565A8` — gradients, hover states
- Text: near-black `#111417` on light, white/`#F1F5F9` on dark
- Premium accent (sparingly): muted gold `#C9A24B` for "featured"/"premium" badges, dividers, certificate frame accents — signals luxury without looking gaudy
- Gradients: navy→cyan diagonal gradients echoing the logo's roof shape, used in hero background and section dividers

## Hero Section
- Full-viewport height (or ~90vh), dark navy gradient background with subtle animated blueprint/grid pattern or slow-panning elevator shaft visual (SVG/CSS, not heavy video initially)
- Large Farsi headline (company tagline), short subtext, two CTAs: "مشاهده محصولات" (View Products) and "درخواست مشاوره" (Request Consultation)
- Subtle scroll-cue animation
- Logo mark used as a recurring geometric motif (the roof/chevron shape) in section dividers and background accents — reinforces brand without repeating the literal logo

## Interactivity & Motion
- Scroll-reveal animations (fade+slide) for sections — Framer Motion
- Hover states: cards lift with soft shadow + subtle scale (1.02), accent border glow in cyan
- Sticky, semi-transparent nav that solidifies on scroll
- Product filter interactions animated (smooth grid re-flow)
- Counters/stats animate on scroll into view (years of experience, projects completed, clients)
- Subtle parallax on hero background elements — kept tasteful, not gimmicky

## Component Style
- **Cards:** rounded-xl (12–16px), soft navy-tinted shadows, thin 1px border in light mode, glassmorphism accent panels on dark hero (frosted navy glass with cyan glow border)
- **Buttons:** primary = solid cyan-to-blue gradient, pill or rounded-lg, subtle glow on hover; secondary = outline navy
- **Forms:** floating labels, generous padding, cyan focus rings, clear Farsi validation messages
- **Icons:** line-style icons (Lucide), consistent stroke width, cyan accent color

## Section-Specific Notes
- **History/About:** timeline component (vertical on mobile, horizontal on desktop) with milestone years
- **Founder:** split layout — large portrait photo one side, quote-style bio other side, signature-style accent element
- **Products grid:** card per product — placeholder image (fixed aspect ratio, subtle navy overlay if no image), category tag, price or "تماس بگیرید", quick "مشاهده" button
- **Product detail:** gallery (placeholder carousel), spec table styled like a premium datasheet, sticky "request quote" button on scroll (mobile especially)
- **Certificates:** masonry/grid gallery with lightbox on click, gold-accented frame to signal credibility
- **Contact:** two-column — form on one side, map + info card on other; map styled with a custom dark theme matching palette

## Responsiveness
- Mobile-first; hero copy shortens on small screens; sticky CTA bar on mobile product pages
- Nav collapses to a slide-in RTL drawer menu

## Admin Panel UI (separate, functional-first)
- Clean dashboard using a neutral light theme (not the marketing palette) with navy accents for brand consistency — but prioritize clarity, data density, and speed over "wow factor"
- Use a component library (shadcn/ui) for tables, forms, modals — fast to build, consistent, RTL-compatible with adjustments

## Accessibility
- Sufficient contrast (navy/cyan combos checked against WCAG AA)
- Focus states visible, form labels always present (not placeholder-only)
- Alt text (Farsi) for all images/placeholders
