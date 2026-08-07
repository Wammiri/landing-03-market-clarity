# Changelog

All notable changes to Market Clarity Live. Format based on Keep a Changelog. This project does not use semantic versioning; entries are grouped by batch.

## [Unreleased]

### Added

- Building pack: `CLAUDE.md`, `DISCOVERY.md`, `DECISIONS.md`, `BATCH_PLAN.md`, `SESSION_LOG.md`, `CHANGELOG.md`.
- `SPEC.md`, renamed from `03-market-clarity.md`.

### Notes

- A countdown edge case in the spec is recorded as decision D-05 and flagged in `SESSION_LOG.md`.

## B1. Build the page to spec (2026-08-07)

### Added

- The complete single page site: top strip, hero, countdown chip, two registration forms, what you get rows, host block, testimonials, final call, and footer.
- The evergreen countdown chip. Targets the next Thursday at 19:00 in the viewer's local time, ticks every second, renders a stable placeholder on the server and mounts live on the client so there is no hydration mismatch. Fixed width tabular digit boxes, so ticking cannot shift layout.
- Two registration forms from one component with distinct `location` params, independent state, client side validation, and a success state. A comment marks where a webinar platform would receive the lead in production. Nothing is transmitted or stored.
- Scroll progress bar driven by `useScroll`, absent under reduced motion.
- Design system: vermilion gradient field, Anton, Archivo, and IBM Plex Mono via `next/font`, the single yellow micro accent, focus rings in warm white.
- Analytics: `cta_click`, `webinar_signup`, and `countdown_view` pushed to `dataLayer`. GA4 scripts with a placeholder Measurement ID, Meta Pixel block left commented.
- SVG favicon, so the zero raster images claim stays honest.
- `tests/market-clarity.spec.ts`, sixteen Playwright behavioral assertions.

### Fixed

- Scroll reveals no longer hide content. The three what you get rows and both testimonials previously rendered at zero opacity in any view that does not scroll, and the rows never revealed at all. The reveal is now an enhancement over a visible resting state.
- `next dev` no longer rewrites `CLAUDE.md`. Next.js 16 appended a managed agent rules block containing em dashes on every run. Disabled with `agentRules: false`, recorded as D-16.

### Notes

- GA4 Measurement ID is still the `G-XXXXXXXXXX` placeholder, and the Meta Pixel ID is still absent. Both are human gates.
- Not deployed. Deployment is a human gate.
