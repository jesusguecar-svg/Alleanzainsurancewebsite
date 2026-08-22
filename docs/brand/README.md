# Alleanza Brand Guardrails

Official brand reference for this website. **Read this before making visual
changes.** The website follows official Alleanza branding, not subjective taste.

## Source Files

- `Alleanza_Brandbook_98_paginas_COMPRIMIDO.pdf` — the official brandbook (98 pages).
  Page references below point into it.
- `color-tipography-Alleanza.pdf` — Alleanza Insurance colour and typography reference.
- `color-tipography-Academy.pdf` — Alleanza Academy colour and typography reference.

The brandbook is image-based, so text cannot be extracted from it. Read it as
rendered pages.

---

## Colour

### Primary palette (brandbook p. 14)

| Name | Hex | Tailwind token | Role |
| --- | --- | --- | --- |
| Cian Alleanza | `#04C0FE` | `cyan` | Accents, **buttons, links, figures, icons, CTAs** |
| Azul marino Alleanza | `#061431` | `navy` | Text, headings, dark/institutional backgrounds, navigation |

### Secondary palette (p. 15)

| Name | Hex | Tailwind token | Role |
| --- | --- | --- | --- |
| Aqua Alleanza | `#1DD4B7` | `aqua` | Categories, positive messages, education, progress, **Alleanza Academy** |
| Gris institucional | `#EAEDF3` | `mist` | Supporting backgrounds, dividers, cards, information blocks |
| Blanco | `#FFFFFF` | `white` | The recommended primary background for the website |

Secondary colours complement the primary pair and must never replace the
presence of navy and cyan.

### Proportion (p. 18) — the rule most easily broken

**60% light backgrounds · 30% azul marino · 10% cian or aqua.**

Accent colours must never dominate a composition. A full-bleed cyan or aqua
section violates this; use white or gris institucional for large surfaces and
keep cyan for the interactive elements sitting on them.

### Approved combinations (p. 17)

Navy + white · Cyan + navy · Gris + navy · Aqua + navy · Cyan + white ·
Navy + cyan + aqua.

Do **not** pair cyan and aqua in large proportions without navy present — the
institutional solidity is lost. On light backgrounds, body text is navy; on dark
backgrounds use white, cyan or aqua by hierarchy.

### Digital pieces (p. 19)

Navy for text, headings, institutional backgrounds and navigation. Cyan
**reserved principally** for buttons, links, figures, icons and calls to action.
Aqua for categories, positive messages, educational content, progress
indicators and Academy-linked resources.

Do not invent tints. Every colour on the site should resolve to a token above.

---

## Typography (pp. 21-25)

**Inter is the only brand typeface**, across every touchpoint. It is committed at
`public/fonts/Inter-V.ttf` and self-hosted via `next/font/local`, so the site
never depends on a third-party font CDN. Arial or Helvetica are the only
sanctioned substitutes, and only under technical limitation.

There is **no serif in the brand system.** `font-display` maps to Inter.

### Weights

| Weight | Use |
| --- | --- |
| Regular 400 | Body copy, paragraphs, descriptions, legal notes |
| Medium 500 | Labels, menus, categories, small headings, support text |
| Semibold 600 | Subtitles, secondary headings, **buttons and CTAs** |
| Bold 700 | Main headings, high-impact headlines |

Excessive bold must be avoided — each weight should answer a specific function.
Do not use weights above 700 (`font-extrabold`/800 is off-system). Avoid
excessive uppercase, and keep headings short, direct and scannable.

### Digital hierarchy (p. 25)

Main heading → Bold · Section heading → Bold/Semibold · Subtitle → Semibold ·
Lead paragraph → Medium · Body → Regular · Labels → Medium · Button/CTA → Semibold.
Legal text may be smaller but must stay legible; never shrink it to hide
relevant information.

---

## Logo (pp. 6-11)

The lockup is the symbol + `ALLEANZA INSURANCE` + the descriptor
`Health & Life Insurance`.

### Versions

- **Horizontal** — the primary application; prefer it in formal communication.
- **Vertical** — for square formats, covers and social pieces where horizontal
  does not fit.
- **Symbol alone** — for very reduced spaces.

### Committed assets

| File | Use |
| --- | --- |
| `public/brand/alleanza/logo-primary-horizontal.svg` | Light backgrounds |
| `public/brand/alleanza/logo-light-horizontal.svg` | Navy and other dark backgrounds |
| `public/brand/alleanza/logo-primary-icon.svg` | Symbol; favicon and compact use |
| `public/brand/alleanza/logo-light-icon.svg` | Symbol on dark backgrounds |
| `public/brand/academy/academy-logo-*.svg` | Only when the Academy brand is visibly referenced |

PNG fallbacks live in the `png/` subfolders — use them only where SVG cannot
render. Vertical, dark, lightblue and secondary variants are also committed for
future use.

### Clearspace and minimum sizes (pp. 8-9)

Clearspace on all four sides equals the width of the symbol (`X`). No text,
image, border or graphic may enter that zone.

Minimum sizes: full lockup **120px** wide on screen (25mm in print). Below that,
use the symbol alone, minimum **64px** (14mm).

### Misuse — explicitly forbidden (p. 12)

Changing the institutional colours · distorting · tilting or rotating ·
changing the typography · **removing the descriptor** · adding effects ·
placing the logo on low-contrast backgrounds.

Use the committed artwork unmodified. Never re-draw the mark by hand.

### On backgrounds and photography (pp. 10-11)

Light backgrounds take the primary colour version; dark backgrounds take the
white or high-contrast version. Over photography, place the logo in clean,
low-noise areas, and add a frame, band, gradient or institutional overlay when
the image is busy. Photography should reinforce family protection, trust, clear
advice, health, life and human accompaniment.

---

## Visual tone (p. 5)

Clear, human, professional and reassuring. Every piece should feel like the
visitor is accompanied by an expert, trustworthy and close brand.

**Avoid drama, fear and commercial pressure.** Prefer luminous imagery, simple
messages, clean composition and graphics that communicate protection, guidance
and stability.

- Speaking to **families** → warm, serene, protective.
- Speaking to **agents or about the Academy** → inspiring, dynamic, growth-oriented.
- Speaking about **services** → clear, educational, responsible.

This tone reinforces, and is reinforced by, the compliance posture already in
the codebase: cautious policy language, deferral to licensed agents, and the
verified-facts gate in `lib/config/company.ts`.

---

## Where brand decisions live in the code

| Concern | File |
| --- | --- |
| Colour tokens, font family | `tailwind.config.ts` |
| CSS custom properties, base background | `app/globals.css` |
| Inter font loading | `app/layout.tsx` |
| Logo component and rules | `components/Logo.tsx` |
| Favicon | `app/icon.svg` |
| Social preview | `app/opengraph-image.tsx` |

## Intentional Exclusions

The original folder also contains Illustrator files, a large editable Figma
file, and a 97 MB high-resolution brandbook. Those were not committed, to keep
the repository practical. The committed SVGs, PNG fallbacks and compressed PDFs
are enough for implementation.
