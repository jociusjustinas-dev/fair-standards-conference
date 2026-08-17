# Fair Standards Alliance — extracted design system

Source: live CSS and markup from [fair-standards.org](https://fair-standards.org/) (custom WordPress theme **wamvite**, inspected August 2026). Values below are from compiled Tailwind (`app-I1BCVtE8.css`) and rendered HTML, not from screenshots.

This prototype maps those tokens into `css/styles.css`. On integration, prefer the theme header/footer partials and existing utility classes over duplicating CSS.

## Colour palette

| Token (theme class) | Hex / RGB | Use |
|---|---|---|
| `midnightblue` | `#0D0838` / `rgb(13 8 56)` | Body background, dark heroes, footer, primary text on light |
| `royalblue` | `#5754FF` / `rgb(87 84 255)` | Primary buttons, eyebrow labels, H2 accent spans, badges |
| `whitesmokebase` | `#F5F5F5` | Light text on dark, mega-open header bg, button hover |
| `whitesmoke` | `#F5F5F5C2` | Secondary text on dark |
| `midnightindigo` | `#0D083814` | Hairline borders, card dividers |
| `whiteveil` | `#FFFFFF1F` | Translucent card fill on light (`bg-whiteveil`) |
| `powderblue` | `#B9E2F3` / `rgb(185 226 243)` | Occasional light wash |
| `midnightbluegray` | `#0D0838CC` | Muted body text |
| Muted copy | `#0D083899` | Body on light, nav on light header |
| Card fill | `#F5F5F58F` | News / feature cards |
| Header bar | `#15103914` + `blur(5px)` | Sticky header over hero |
| Header border | `#E6E6E633` | Header hairline |
| Magenta blob | `#991F6E73` + `blur(100px)` | Dark section atmosphere (hero, footer) |
| Cyan blob | `rgba(0,186,255,0.25)` + `blur(100px)` | Light section atmosphere (Join band) |
| Photo overlay (`roselinear`) | `linear-gradient(180deg, transparent 32%, #0D083814 48%, #991F6EB3)` | Editorial image treatment |

Dark sections: midnight blue + magenta blobs + `herofigure.webp` or `object.svg`.  
Light sections: white or whitesmoke + cyan blobs + `object.svg`.

## Typography

| Role | Family | Notes |
|---|---|---|
| Body, nav, buttons, H1–H3 | **Neue Haas Unica** (`font-neue`) | `body { font-family: Neue Haas Unica, system-ui, sans-serif }` |
| Card titles, accordion headers, 19px labels | **Archia** (`font-archia`) | Medium (500) on feature titles |

Files live at `/wp-content/themes/wamvite/assets/fonts/`. This prototype hotlinks those WOFF2 files.

### Scale (from live heading classes)

| Element | Mobile | sm (640) | lg (1024) | Tracking / leading |
|---|---|---|---|---|
| H1 (hero) | 40px / 1.12 | 54px / 1.15 | 68px / 1.2 | `-0.01em` |
| H2 (sections) | 34px / 1.12 | 40px / 1.1 | 48px / 1.1 | `-0.03em`; `span` = royalblue |
| H3 (cards) | 30px / 1.15 | 34px / 1.2 | 39px / 1.2 | `-0.03em` |
| Archia title | 19px / 1.3 | — | — | |
| Body | 14px (`text-sm`) | 16px (`md:text-base`) | — | leading 1.3, tracking `-0.02em` |
| Eyebrow / date | 14px medium royalblue | — | — | 6px royalblue dot |
| Button / badge | 13px | — | — | |
| Nav | 14px (`text-sm`) | — | — | |

Content headings inside `.text-part`: H1 32/40/44, H2 28/34/39, H3 20/22/23.

## Layout

- Breakpoints: **640 / 768 / 1024 / 1500** (`sm` / `md` / `lg` / container cap).
- Horizontal padding on sections: **20px / 40px / 96px** (`px-5 sm:px-10 lg:px-24`).
- `.container`: `width: 100%; max-width: 1500px; margin-inline: auto`.
- Section vertical padding: **56px / 80px** (`py-14 sm:py-20`). Some bands use `py-16 sm:py-24`.
- Hero inner: `pt-28 sm:pt-40 pb-16 sm:pb-24`, `min-h-[80vh] lg:min-h-screen`.
- Header inner padding: `py-3.5` (14px). Logo width: `w-32` (128px).
- Desktop nav gap: `gap-9` (36px). Nav hidden below 1024px.

## Recurring components

**Header** — `position: fixed; z-50`. Frosted bar. `data-contrast="dark"` over midnight heroes (white logo, whitesmoke nav). Swaps to black logo + `#0D083899` nav over light sections. Mobile: hamburger, full midnight drawer, same items + nested links. Desktop mega-menus (photo cards + `roselinear`) are **not** rebuilt here — use the theme header partial on WordPress.

**Primary button** — `inline-flex py-2 px-4 rounded-lg bg-royalblue text-whitesmokebase text-[13px]` + Phosphor-style arrow. Hover: `bg-whitesmokebase text-royalblue` on dark; `hover:bg-midnightblue` on light Join CTA.

**Become a member** — same primary button in the header (hover inverts on light contrast).

**Eyebrow** — 6px royalblue dot + 14px medium royalblue label (“About FSA”, “Press Releases” dates).

**Badge / tag** — `inline-flex py-2 px-4 rounded-lg bg-royalblue text-white text-[13px]` (“Press Releases”).

**News / feature card** — `rounded-lg bg-[#f5f5f58f] border border-[#0d083814]` + `object.svg` watermark.

**Accordion** (How FSA drives / this page’s panels) — `.accordions > .accordion` with `.accordion__header` (Archia 19px) and `.accordion__content`. First item open on the live site.

**Join band** — `bg-white`, cyan blobs, centred `object.svg`, H2 with royalblue span, centred royalblue CTA.

**Footer** — midnight + magenta blobs, `blur(30px)` content, newsletter field `bg-[#f5f5f514]` + royalblue square submit, then `© Fair Standards Alliance. All Right Reserved` (verbatim), “Created with love” + wearemarketing.lt wordmark, Privacy Policy.

## Imagery

- Editorial photos with `object-cover` and `roselinear` overlay (often hover-only).
- `object.svg` — large geometric watermark on light and some dark sections.
- `herofigure.webp` — homepage hero texture.
- Thin-line SVG icons in 52×52 rounded tiles (`bg-[#ffffff73]`, border `#0d083814`) on the Join band.

## Integration notes for WAM

1. Replace this page’s header/footer with `header.php` / `footer.php` (mega menus, newsletter AJAX, Complianz).
2. Rebuild sections as theme blocks using existing utilities — do not ship `css/styles.css` into production if the Tailwind build already contains these tokens.
3. Registration CTAs are placeholders to `/contacts/` — search `TODO: replace with real registration link`.
4. Draft speaker slots are verbatim, including unconfirmed names.
