# Alleanza Brand Guardrails

This folder contains the official Alleanza brand reference files that should guide visual work on this website.

## Source Files

- `Alleanza_Brandbook_98_paginas_COMPRIMIDO.pdf` - compressed official brandbook for design rules, logo usage, color, typography, and visual guidance.
- `color-tipography-Alleanza.pdf` - Alleanza Insurance color and typography reference.
- `color-tipography-Academy.pdf` - Alleanza Academy color and typography reference.

## Website Assets

Alleanza Insurance logo SVGs are in:

- `public/brand/alleanza/`
- PNG fallbacks are in `public/brand/alleanza/png/`

Alleanza Academy logo SVGs are in:

- `public/brand/academy/`
- PNG fallbacks are in `public/brand/academy/png/`

The Inter variable font is in:

- `public/fonts/Inter-V.ttf`

## Recommended Website Usage

- Use `public/brand/alleanza/logo-primary-horizontal.svg` on light backgrounds.
- Use `public/brand/alleanza/logo-light-horizontal.svg` on dark/navy backgrounds.
- Use `public/brand/alleanza/logo-primary-icon.svg` for compact icon usage, favicon work, or app icon references.
- Use `public/brand/academy/academy-logo-principal-horizontal.svg` only when the Academy brand is visibly referenced.
- Prefer SVGs in implementation. Use the PNG files only as fallbacks for tooling, previews, or contexts that cannot render SVG reliably.
- Use Inter as the primary UI typeface unless the brandbook specifies a more specific web-safe implementation.

## Intentional Exclusions

The original folder also contains Illustrator files, a large editable Figma file, and a high-resolution 97 MB brandbook PDF. Those were not committed to keep the repository practical for Claude Code and normal GitHub workflows. The committed SVGs, PNG fallbacks, and compressed PDFs should be enough for brand implementation.

## Implementation Rule

Before redesigning or restyling the website, read the brandbook and color/typography PDFs. The website should follow official Alleanza branding rather than subjective visual taste.
