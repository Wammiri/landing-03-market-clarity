# SPEC: Market Clarity Live. Weekly live briefing (webinar registration)

## 0. What this is

A single page webinar registration site for a fictional free weekly live session called Market Clarity Live. One job: get a name and email into the form. This is the unapologetic direct response piece of the set: loud, hot, poster like, genre true. It should feel like a page pulled from a working investing education funnel, executed with real craft. Concept build for Isaac Olorode's portfolio.

Do not browse the web. Everything needed is in this file. Network use: npm install and the automatic next/font fetch only.

## 1. Setup

```
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
npm i framer-motion
```

No other dependencies. No images in /public except favicon.

## 2. Design system

Identity: hot red DR poster. A full bleed vermilion field, giant white condensed type, one black countdown chip. High contrast, high urgency, zero clutter.

Palette:
- bg: vertical gradient from #E63B12 (top) to #C22F0C (bottom), fixed attachment not required
- type: #FFF7F2 (warm white)
- ink: #14100E (the black chip, buttons, footer band)
- tint: rgba(255,255,255,0.14) (hairlines, translucent panels)
- go: #FFD84D (one tiny use: the live dot next to the countdown label)

Fonts via next/font/google:
- Display: Anton, weight 400 (it only has one), used uppercase at clamp(2.8rem, 9vw, 6.5rem), line height 0.95
- Body and form: Archivo, weights 400, 600
- Countdown digits and labels: IBM Plex Mono, 500, tabular

Layout: max width 980px, centered, everything above the fold on desktop: headline, three word promise, form. Sections tight (64 to 88px). Radius 8px on the form card, 999px on pills.

Forbidden: cream backgrounds, serif fonts, emoji, icon libraries, raster images, fake price data, more than the one yellow micro accent, em dashes.

## 3. Signature element: the black countdown chip

A single ink colored pill, centered above the form: a `go` colored 8px dot with a soft 1.5s opacity pulse, the mono label NEXT LIVE SESSION IN, then DD : HH : MM : SS in IBM Plex Mono tabular figures with small mono unit labels underneath each pair.

Logic: the session is evergreen weekly, Thursdays at 19:00 in the viewer's local time. Compute the next Thursday 19:00 from now (if it is Thursday after 19:00, roll to next week). Tick every second via a client component. Under reduced motion the numbers still update (that is content) but the dot does not pulse. This is honest evergreen webinar mechanics: the label says next live session, not a fake expiring offer.

```ts
export function nextThursday19(): Date {
  const now = new Date();
  const d = new Date(now);
  const day = d.getDay(); // Thu = 4
  let add = (4 - day + 7) % 7;
  if (add === 0 && (d.getHours() > 19 || (d.getHours() === 19 && d.getMinutes() > 0))) add = 7;
  d.setDate(d.getDate() + add);
  d.setHours(19, 0, 0, 0);
  return d;
}
```

Secondary micro signature: a 3px scroll progress bar fixed at the top of the viewport in `type` color.

## 4. Page structure and copy (verbatim)

1) Slim top strip (ink bg, type text, Archivo 600, centered, small): FREE LIVE SESSION · EVERY THURSDAY · 45 MINUTES

2) Hero, centered.
- H1 (Anton, uppercase, three stacked lines): STOP GUESSING / WHAT THE MARKET / IS DOING.
- Sub (Archivo, max 52ch, type color at 90% opacity): A free 45 minute live briefing every Thursday. What moved this week, why it moved, and what careful investors are watching next. Plain language, no signals, no pitches.
- The countdown chip (section 3).
- The form card: translucent panel (tint bg, hairline border, backdrop blur). Two labeled fields, First name and Email, stacked on mobile, side by side on desktop, then a full width ink button in Archivo 600 uppercase: SAVE MY FREE SEAT. Micro line below in small type: Can not make it live? Register anyway and the replay lands in your inbox.
- On submit: validate, fire GA event, swap the card content for: You are in. Check your inbox for the calendar invite. Include a comment marking where the webinar platform (Zoom, Brevo) would receive the lead in production.

3) What you get. Three short rows, each a bold Archivo 600 lead phrase then one plain sentence. A thin `tint` rule between rows. Rows rise 16px and fade in on scroll.
- The week, decoded. The five moves that mattered, explained in plain language in the first fifteen minutes.
- The why behind the noise. What actually drove the moves, separated from the stories your feed invented.
- Next week's watchlist. The events and levels careful investors are watching, so Monday does not surprise you.

4) Host block: H3 in Anton, smaller: WHO RUNS THE BRIEFING. One Archivo paragraph: Market Clarity Live is hosted by a small team of market practitioners who spend the week inside the data so you do not have to. No courses to sell you at the end. The briefing is the product. (Fictional copy for a fictional brand.)

5) Two testimonials on the ink band (full width ink section, type text): large Archivo 600 quotes, mono attribution. (Fictional.)
- "Forty five minutes on Thursday replaced two hours of doomscrolling every day." DAYO O.
- "The first finance thing I have ever attended twice." MARTA G.

6) Final call, back on red: H2 (Anton, uppercase): THURSDAY. 19:00. BE THERE. A second identical form card (same component, same events with a different location param).

7) Footer (ink band): wordmark MARKET CLARITY LIVE in Anton small, then a muted line: Concept build. Designed and built by Isaac Olorode. isaac.aperio.finance/landing (link). Copyright 2026.

## 5. Motion spec

framer-motion: hero stack entrance on load (lines stagger 0.08, rise and fade), scroll reveals on the three rows and testimonials, button hover scale 1.02. The countdown ticks via state, the dot pulses via CSS. Scroll progress bar driven by useScroll + scaleX. useReducedMotion turns off entrances, pulse, and progress bar; countdown keeps updating.

## 6. Analytics

Same suite pattern in app/layout.tsx: GA4 gtag scripts with placeholder G-XXXXXXXXXX, commented Meta Pixel block, lib/track.ts helper.

Events: `cta_click` { location: "hero_form" | "final_form" } on button press; `webinar_signup` { location } on valid submit; `countdown_view` fired once when the chip first mounts.

## 7. Performance and quality floor

- Zero raster images. The whole page is type, color, and CSS.
- Lighthouse mobile 95+. The countdown must not shift layout: fixed width digit boxes, tabular numbers.
- Server render everything except the countdown, progress bar, forms, and reveals.
- Contrast: warm white on vermilion passes for large display type; body copy uses full opacity `type` where longer. Ink button text is `type`. focus-visible rings in `type`.
- Both forms fully labeled, autocomplete attributes (given-name, email), usable at 390px with the keyboard open.
- Metadata: title "Market Clarity Live. The free weekly market briefing", one line description, Open Graph basics.
- No em dashes anywhere.

## 8. Acceptance checklist

- [ ] `npm run build` clean
- [ ] Countdown targets next Thursday 19:00 local, rolls over correctly, no layout shift
- [ ] Both forms submit to success state and fire distinct location params
- [ ] Scroll progress bar tracks, absent under reduced motion
- [ ] 390px pass: Anton lines wrap as designed, forms usable
- [ ] Footer concept credit present and linked
- [ ] No raster images, no cream, no serif, no em dashes
