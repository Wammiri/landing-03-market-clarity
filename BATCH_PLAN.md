# BATCH_PLAN: Market Clarity Live

Two batches. B1 builds and verifies the page. B2 is the post deploy handoff and only runs after Isaac has deployed.

Status values: `not started`, `in progress`, `blocked: pending X`, `done`.

---

## B1. Build the page to spec

**Status:** done (2026-08-07). All thirteen tasks landed. Verification rung 3 plus the rung 2 countdown logic check. Sixteen Playwright assertions pass (the fourteen planned, plus two added after verification exposed a content bug the original set missed). See `SESSION_LOG.md`.

**Depends on:** nothing

**Goal:** A complete, verified Market Clarity Live page matching `SPEC.md` exactly, committed and pushed.

**Files this batch may touch** (greenfield scaffold, so this is the shape of the project):

```
package.json, package-lock.json, tsconfig.json, next.config.ts,
tailwind.config.ts, postcss.config.mjs, eslint.config.mjs, .gitignore
app/layout.tsx
app/page.tsx
app/globals.css
app/icon.svg              (or public/favicon.ico)
components/TopStrip.tsx
components/Hero.tsx
components/Countdown.tsx         (client, the signature)
components/RegistrationForm.tsx  (client, used twice with a location prop)
components/WhatYouGet.tsx
components/HostBlock.tsx
components/Testimonials.tsx
components/FinalCall.tsx
components/Footer.tsx
components/ScrollProgress.tsx    (client)
lib/countdown.ts                 (nextThursday19, verbatim from the spec)
lib/track.ts
tests/market-clarity.spec.ts     (Playwright, added in the verification step)
SESSION_LOG.md, CHANGELOG.md, BATCH_PLAN.md
```

Do not touch `SPEC.md`, `DISCOVERY.md`, `DECISIONS.md`, or `CLAUDE.md` except to record a newly resolved ambiguity in `DECISIONS.md`.

**Tasks, one commit each:**

| ID | Task | Commit message |
|---|---|---|
| B1-01 | Scaffold Next.js, install framer-motion, pin the version in `DECISIONS.md` D-02, confirm `npm run build` and `npm run lint` pass on the untouched tree | `chore(setup): B1-01 scaffold next app and pin deps` |
| B1-02 | Design tokens in `globals.css` and Tailwind config, Anton, Archivo, and IBM Plex Mono via `next/font`, the vermilion gradient background, root layout with GA4 scripts and commented pixel, metadata and Open Graph | `feat(system): B1-02 design tokens, fonts, layout, analytics` |
| B1-03 | `lib/countdown.ts` with `nextThursday19()` verbatim, plus `lib/track.ts`. Run the rollover logic check here and record it. | `feat(lib): B1-03 countdown date logic and track helper` |
| B1-04 | The countdown chip: server placeholder, client mount, ticking digits, fixed width tabular boxes, pulsing `go` dot, `countdown_view` fire once, past target clamped to zeros per D-05 | `feat(countdown): B1-04 evergreen countdown chip` |
| B1-05 | Top strip and hero: three stacked Anton lines, sub, entrance stagger | `feat(hero): B1-05 top strip and hero stack` |
| B1-06 | `RegistrationForm`: translucent card, two labeled fields with autocomplete, ink button, validation, GA events, success state, webinar platform comment | `feat(form): B1-06 registration form with success state` |
| B1-07 | What you get: three rows with scroll reveals and tint rules | `feat(content): B1-07 what you get rows` |
| B1-08 | Host block and the two testimonials on the ink band | `feat(content): B1-08 host block and testimonials` |
| B1-09 | Final call section on red with the second form instance, distinct location param | `feat(final): B1-09 final call with second form` |
| B1-10 | Scroll progress bar via `useScroll` and `scaleX`, absent under reduced motion | `feat(ui): B1-10 scroll progress bar` |
| B1-11 | Footer on the ink band with the concept credit line, linked | `feat(footer): B1-11 concept credit footer` |
| B1-12 | Accessibility and mobile pass: focus-visible `type` rings, contrast check on warm white over vermilion, both forms usable at 390px with the keyboard open, Anton lines wrap as designed. Em dash scan. | `fix(a11y): B1-12 contrast, focus rings, 390px pass` |
| B1-13 | Playwright behavioral verification, then update `SESSION_LOG.md`, `CHANGELOG.md`, and this file | `test(e2e): B1-13 behavioral verification` |

**Verification: rung 3, with an extra logic focus on the countdown.**

**Rung 2 logic check on `nextThursday19()`.** Prove all four cases before building the UI on top of it. Use a throwaway node script with a faked `now` or reason it through explicitly, and record the results in `SESSION_LOG.md`:

| Case | Given now | Expected target |
|---|---|---|
| Before Thursday | Tue 2026-08-04 10:00 | Thu 2026-08-06 19:00 |
| Thursday before 19:00 | Thu 2026-08-06 09:00 | Thu 2026-08-06 19:00 (same day) |
| Thursday after 19:00 | Thu 2026-08-06 20:30 | Thu 2026-08-13 19:00 (next week) |
| Sunday | Sun 2026-08-09 12:00 | Thu 2026-08-13 19:00 |

Note the known edge case at exactly 19:00:00 to 19:00:59 on a Thursday, recorded as D-05. The function stays as specced; the display clamps.

**Rung 3 Playwright** via the `webapp-testing` skill against `npm run dev`, asserting:

1. Page loads, H1 contains the three lines `STOP GUESSING`, `WHAT THE MARKET`, `IS DOING.` verbatim.
2. **Zero console errors on load, specifically no React hydration mismatch warning.** This is the highest value assertion on this page.
3. The countdown renders digits, and the seconds value changes between two samples two seconds apart.
4. The countdown's bounding box width is identical across three samples taken one second apart (no layout shift from digit changes).
5. `countdown_view` appears exactly once in `window.dataLayer`, and does not appear a second time after a scroll.
6. Submitting the hero form with an invalid email does not reach the success state.
7. Submitting the hero form with valid values swaps to `You are in. Check your inbox for the calendar invite.` and pushes `webinar_signup` with `location: "hero_form"`.
8. Submitting the final form pushes `webinar_signup` with `location: "final_form"`, and the two events are distinguishable in `dataLayer`.
9. Submitting the hero form leaves the final form in its initial state (independent state, per D-06).
10. The scroll progress bar's `scaleX` increases as the page scrolls.
11. At 390px viewport, `document.documentElement.scrollWidth` is not greater than `clientWidth`, and both forms are reachable and usable.
12. With `prefers-reduced-motion: reduce` emulated: the progress bar is absent, the `go` dot does not pulse, and **the countdown still updates** (content, not decoration).
13. Both form fields have real labels and correct `autocomplete` attributes (`given-name`, `email`).
14. The footer credit line is present and its link points to isaac.aperio.finance/landing.

Record the rung and the results in `SESSION_LOG.md`.

**Before pushing:** run the em dash scan from `CLAUDE.md`, and scan the diff for secrets.

**Human gates hit in this batch:** GA4 Measurement ID stays `G-XXXXXXXXXX` (flag it). Meta Pixel stays commented (flag it). Do not deploy. Do not change the Thursday 19:00 session time. Surface the D-05 countdown edge case at the top of the report.

---

## B1a. GA4 Measurement ID and deploy (out of band, human led)

**Status:** done (2026-08-07). Isaac created the GA4 property and web data stream for `landing-03-market-clarity.vercel.app`, supplied `G-0QXCCQYR17`, and deployed to Vercel. Not run through the batch protocol at the time (no fresh-session prompt, pack files not updated until this session reconciled them), since it was one human-led config change plus a deploy, both human gates. Recorded here after the fact so the plan matches what shipped. See D-12 and `SESSION_LOG.md`.

**Depends on:** B1 done.

**Task:**

| ID | Task | Commit |
|---|---|---|
| B1a-01 | Replace `G-XXXXXXXXXX` with the live Measurement ID in `app/layout.tsx`, record in `DECISIONS.md` D-12 | `feat(analytics): B1a-01 set live GA4 measurement ID` (already pushed) |

**Verification:** build and lint clean (per the commit message). Confirmed by WebFetch this session: the live URL serves the page, headline and footer credit both correct.

---

## B2. Post deploy handoff

**Status:** in progress. Site is live at `https://landing-03-market-clarity.vercel.app`, confirmed reachable this session. Split below by who can actually verify each piece: this machine has no working outbound network path to the live host (Playwright and curl both fail DNS resolution from this sandbox; WebFetch reached it once and then started timing out), and GA4 DebugView and PageSpeed both require Isaac's own Google login regardless.

**Depends on:** B1 done, B1a done, Isaac deployed. All satisfied.

**Goal:** Hand the production URL and the real Lighthouse mobile score to project `05-isaac-site` for `[TODO_URL_3]` and `[TODO_SCORE_3]`.

**Tasks:**

| ID | Task | Who | Status |
|---|---|---|---|
| B2-00 | Confirm the live URL serves the correct page | Claude | done, this session, via WebFetch: headline `STOP GUESSING WHAT THE MARKET IS DOING.` and footer credit both present |
| B2-01 | Confirm GA4 DebugView shows `page_view`, `countdown_view` once, `cta_click`, and `webinar_signup` with both location values on the live URL | **Isaac** (needs Google login to the GA4 property) | not started |
| B2-02 | Confirm the live countdown shows a sensible time in a real browser timezone | **Isaac** (this machine cannot reach the live host reliably from this sandbox to check it directly) | not started |
| B2-03 | Record the production URL and the real PageSpeed mobile score in `SESSION_LOG.md`. Do not guess the score. | Production URL: done, see below. Score: **Isaac**, do not guess | URL done, score not started |
| B2-04 | Report both to Isaac for entry into project 05 | Claude, once 01 to 03 are in | blocked on 01 to 03 |

**Production URL (B2-03, partial):** `https://landing-03-market-clarity.vercel.app`

**Steps for Isaac, B2-01 (GA4 DebugView):**

1. In GA4, open Admin > DebugView for the `landing-03-market-clarity.vercel.app` property.
2. Install the "Google Analytics Debugger" browser extension, or append `?gtm_debug=x` awareness is not needed for GA4; instead enable debug mode by visiting the live URL with the extension active, or run `gtag('config', 'G-0QXCCQYR17', {debug_mode: true})` from the browser console before reloading.
3. Load the live URL. Confirm `page_view` appears in DebugView.
4. Confirm `countdown_view` appears exactly once (should not repeat on scroll or reload within the same session view).
5. Click a CTA and confirm `cta_click`.
6. Submit the hero form with a real-looking name and email, confirm `webinar_signup` with `location: hero_form`.
7. Scroll to the final section, submit that form, confirm a second `webinar_signup` with `location: final_form`.

**Steps for Isaac, B2-02 (live countdown sanity check):** open the live URL in a normal browser, confirm the digits look right for "next Thursday at 19:00 in your local time" given today's date and time, and confirm the seconds are ticking.

**Steps for Isaac, B2-03 (PageSpeed):** run PageSpeed Insights (pagespeed.web.dev) against the live URL, mobile tab, record the performance score.

**Verification: rung 4**, live end to end against the deployed page and the real GA4 property. B2-00 is the only piece of that rung this session could complete; 01 to 03 need Isaac's own login and, right now, a working network path this sandbox does not have.

---

## Session prompt for B1

Copy this verbatim into a fresh Claude Code session in this folder.

```
Read the onboarding files first: DECISIONS.md, SESSION_LOG.md, BATCH_PLAN.md.
Then read SPEC.md in full. CLAUDE.md is auto loaded.

Context not yet in the files: nothing. This is the first session on this project.
The folder currently contains only the pack files and SPEC.md. Node 22.22.2,
npm 10.9.7, git 2.53 are verified present. Vercel CLI is installed but NOT
logged in, so do not attempt to deploy.

Note DECISIONS.md D-05 before you start: the spec's nextThursday19() has a known
one minute a week edge case. Implement the function exactly as specced and clamp
the display instead. Do not silently rewrite the function.

Batch: B1
Tasks: B1-01 through B1-13
Files to touch: only those listed under B1 in BATCH_PLAN.md.

Build the project exactly to SPEC.md. Do not browse the web. Do not add
dependencies, sections, images, or copy beyond the spec. In particular do not
install a date library: the spec supplies the countdown function. Where the spec
gives code, use it. Network use is limited to npm install and the next/font
fetch at build time.

Follow the protocol: bounded file list, verification ladder rung 3. Run the
four case countdown rollover logic check in BATCH_PLAN.md BEFORE building the
UI on top of it, then the fourteen Playwright assertions via the webapp-testing
skill. Assertion 2 (zero hydration mismatch) is the highest value one on this
page. Build and lint before commit, one commit per task as
type(scope): ID description, run the em dash scan from CLAUDE.md before
committing, push at the end, update SESSION_LOG.md, CHANGELOG.md, and
BATCH_PLAN.md status.

Leave the GA4 Measurement ID as G-XXXXXXXXXX and flag it. Leave the Meta Pixel
block commented. Do not change the Thursday 19:00 session time. Do not deploy:
that is a human gate.
For any ambiguity, pick a sensible default, isolate it as a one line switch,
and flag it in SESSION_LOG.md with confidence and cost if wrong.

Work through the acceptance checklist at the end of SPEC.md before telling me
you are done.

One batch only. Stop and report when done or paused.
```
