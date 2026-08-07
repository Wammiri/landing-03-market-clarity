# SESSION_LOG: Market Clarity Live

Appended after every session. Never deleted. Newest entry at the bottom.

---

## 2026-08-06. Session 0: pack generation

**Who:** Claude Code, suite level setup session (run from the `landing-suite` root, covering all five projects).

**What landed:**

- `SPEC.md` renamed from `03-market-clarity.md` so the kickoff prompt resolves.
- Building pack created: `CLAUDE.md`, `DISCOVERY.md`, `DECISIONS.md`, `BATCH_PLAN.md`, `SESSION_LOG.md`, `CHANGELOG.md`.
- Weight class set to LIGHT and recorded as decision D-01.
- Git repository initialised and pushed to `Wammiri/landing-03-market-clarity` (public).

**Verification:** none applicable. No product code exists yet. Toolchain verified at suite level: Node 22.22.2, npm 10.9.7, git 2.53.0, Vercel CLI 52.0.0 present, GitHub CLI authenticated as `Wammiri`.

**Commits pushed:** `chore(pack): B0 building pack, spec, and gitignore`, pushed to `Wammiri/landing-03-market-clarity` (public) on branch `main`. The remote exists and is tracking, so B1 can push without stopping to ask.

**Flags for Isaac:**

1. **Countdown edge case found in the spec, recorded as D-05.** The spec's `nextThursday19()` rollover guard uses `getMinutes() > 0`, so between 19:00:00 and 19:00:59 on a Thursday the function returns a target that is already in the past. Symptom: for up to sixty seconds once a week the countdown reads negative or zero. The decision is to implement the function exactly as specced (the spec is binding) and clamp the display to all zeros when the target is past, which is arguably the right thing to show at session start anyway. If you want the function itself corrected instead, it is a one line change. Say the word.
2. **Vercel CLI is not logged in.** `vercel whoami` found no credentials. Run `vercel login` in a real terminal before any deploy.
3. **GA4 Measurement ID needed.** Create the property and the data stream for this site, then replace `G-XXXXXXXXXX` in `app/layout.tsx`.

**Parked:** B2 is blocked pending deploy, which is blocked pending Vercel login.

**Next:** Batch B1, using the session prompt at the bottom of `BATCH_PLAN.md`, in a fresh session.

---

## 2026-08-07. Session 1: batch B1, build the page to spec

**Who:** Claude Code, batch B1. Tasks B1-01 through B1-13.

**What landed** (one commit per task):

- `B1-01` Next.js 16.3.0 App Router, TypeScript, Tailwind 4, ESLint scaffolded. framer-motion pinned at 13.0.0 with `--save-exact`. Build and lint confirmed clean on the untouched tree before any product code.
- `B1-02` Design tokens, the three fonts via `next/font`, the vermilion gradient, focus rings, reduced motion rules, root layout with metadata, Open Graph, GA4 scripts, and the commented Meta Pixel block.
- `B1-03` `lib/countdown.ts` with `nextThursday19()` verbatim, plus `timeParts()` and `lib/track.ts`.
- `B1-04` The countdown chip.
- `B1-05` Top strip and hero stack.
- `B1-06` `RegistrationForm`, one component used twice.
- `B1-07` What you get rows. `B1-08` Host block and testimonials. `B1-09` Final call. `B1-10` Scroll progress bar. `B1-11` Footer.
- `B1-12` Two real fixes found during verification, described under flags below.
- `B1-13` Playwright behavioral verification and pack updates.

**Verification: rung 3, with the rung 2 logic focus the plan asked for.**

*Rung 2, countdown rollover, run before any UI was built on top of it.* The specced function reads the real clock, so its body was reproduced character for character in a throwaway node script with `now` injected. All four cases pass:

| Case | Given now | Target | Result |
|---|---|---|---|
| Before Thursday | Tue 2026-08-04 10:00 | Thu 2026-08-06 19:00 | pass |
| Thursday before 19:00 | Thu 2026-08-06 09:00 | Thu 2026-08-06 19:00 | pass |
| Thursday after 19:00 | Thu 2026-08-06 20:30 | Thu 2026-08-13 19:00 | pass |
| Sunday | Sun 2026-08-09 12:00 | Thu 2026-08-13 19:00 | pass |

The D-05 edge case was also exercised directly: at Thu 19:00:30 the function returns a target already in the past, confirming the analysis, and `timeParts()` clamps the display to `00 : 00 : 00 : 00`. The function itself is untouched, exactly as D-05 requires.

*Rung 3, Playwright, sixteen assertions, all passing.* The fourteen from `BATCH_PLAN.md` plus two added during the batch (see flag 2). Assertion 2, zero console errors and no hydration mismatch, passes: the D-04 placeholder plus client mount approach works.

`npm run build` clean. `npm run lint` clean. Em dash scan: zero results. Diff scanned for secrets: none.

**Flags for Isaac:**

1. **D-05, the countdown edge case, surfaced as required.** Unchanged from the plan: the spec's `nextThursday19()` is implemented verbatim, and the display clamps to all zeros for the sixty second window each Thursday where the specced guard returns a past target. Confirmed empirically this session. If you want the function itself corrected instead, it is a one line change (`getMinutes() > 0` to `>= 0`, or compare the target against now). Your call, nothing is built on top of the current behavior.

2. **A real content bug was found by verification and fixed, and it is worth knowing about.** The three what you get rows and both testimonials were rendering at `opacity: 0` permanently in any render that does not scroll, and the rows failed to reveal even after scrolling past them. A third of the page copy was invisible in full page screenshots, in print, and to any non scrolling crawler. Cause: the reveal used `whileInView` as the only path to the visible state, so content depended on an animation having fired. Fixed by extracting `components/Reveal.tsx`, where the hidden start state is armed only once the component is confirmed running on the client. Server output and reduced motion now render the visible resting state. Two assertions (15 and 16) were added because the original fourteen all passed while this bug was live. Screenshots at 1440px and 390px were checked by eye afterwards, which is how it was caught.

3. **`next dev` was rewriting `CLAUDE.md`.** Next.js 16 appends a managed agent rules block to `CLAUDE.md` on every dev run. It contains em dashes, so it broke the mandatory house style scan, and it edits a pack file that is outside every batch's bounded file list. Fixed with `agentRules: false` in `next.config.ts`, the supported switch. Recorded as D-16. Worth applying to the other four projects in the suite if they are on Next.js 16.

4. **GA4 Measurement ID still needed.** `G-XXXXXXXXXX` is untouched in `app/layout.tsx`, as required.

5. **Meta Pixel block still commented,** as required. Needs the Pixel ID.

6. **Vercel deploy not attempted.** Human gate, and the CLI is not logged in.

7. **One added devDependency, for verification only.** `@playwright/test` 1.62.1, pinned. The plan mandates a Playwright pass and Python is not installed on this machine, so the Node runner was the only route. It is a devDependency and does not touch the shipped bundle. `playwright.config.ts` was deliberately not created, since it is outside the bounded file list; configuration is passed as CLI flags instead.

**Ambiguities resolved with a default, per the protocol:**

- **Tailwind 4 has no `tailwind.config.ts`.** The scaffold produced v4, which configures through `@theme` in `app/globals.css`. `BATCH_PLAN.md` listed the config file, but creating one would be wrong. Tokens live in `globals.css`. Confidence high, cost if wrong near zero. Noted in D-02.
- **`components/Reveal.tsx` is a new file outside the bounded list.** It is a refactor of reveal logic that already lived inside two in-list components, created to fix the defect in flag 2 rather than duplicate the fix twice. Confidence high, cost if wrong near zero.
- **Favicon** is the D-11 vector mark: three ascending warm white bars on vermilion, in `app/icon.svg`. Medium confidence on the design, as recorded. Easy to replace.

**Parked:** B2, still blocked pending Isaac deploying to Vercel and running PageSpeed Insights. The real mobile Lighthouse score is deliberately not guessed.

**Next:** B2, after deploy.

---
