# DECISIONS: Market Clarity Live

Every significant decision, including the ones where nothing gets built. Status is one of: settled, inferred (with confidence), open, deferred.

---

## D-01. Weight class is LIGHT

**Chosen:** Pack files present, contents thin. No control matrix, no adversarial pass, no staging, no multi-batch decomposition beyond build then verify.

**Why:** No heavy signal applies. One anonymous role, no multi-tenancy, no regulated data, no money, no irreversible actions, no AI with tool use. The forms post nowhere.

**Traded off:** Less process trail. Acceptable; the trail scales to the risk. The one piece of real logic (the countdown) gets a targeted logic check instead, which is the right sized response.

**Status:** settled

---

## D-02. Next.js App Router, TypeScript, Tailwind, framer-motion. Nothing else.

**Chosen:** The stack the spec names, with framer-motion as the single added dependency.

**Why:** framer-motion earns its place: hero stack entrance with stagger, scroll reveals on the three rows and testimonials, and the scroll progress bar driven by `useScroll` and `scaleX`. The progress bar in particular is meaningfully simpler with `useScroll` than with a manual scroll listener.

**Traded off:** Roughly 30 to 50 KB gzipped on a page targeting Lighthouse 95+.

**Pinned version:** `framer-motion` 13.0.0, installed with `--save-exact` so `package.json` carries the exact version rather than a caret range. Installed 2026-08-07 in batch B1-01 alongside Next.js 16.3.0, React 19.2.8, Tailwind 4.

**Note on Tailwind:** the scaffold produced Tailwind v4, which configures through `@theme` in `app/globals.css` and has no `tailwind.config.ts`. `BATCH_PLAN.md` lists that file under B1, but it is not created, since v4 does not use one. Design tokens live in `globals.css` instead.

**Status:** settled

---

## D-03. No date library. Use the spec's `nextThursday19()` as written.

**Chosen:** No date-fns, no dayjs, no luxon, no moment, no Temporal polyfill. The spec supplies the complete function; use native `Date`.

**Why:** The default answer to a new dependency is no until justified. The function is fifteen lines and already written. A date library would add bundle weight to a page targeting 95+ for zero benefit.

**Status:** settled

---

## D-04. Countdown renders a placeholder on the server and mounts live on the client

**Chosen:** The countdown chip server renders with a stable placeholder (fixed width digit boxes showing `--`), then a `useEffect` mounts the live ticking value on the client.

**Why:** This is the single most likely bug on the page. `nextThursday19()` depends on the viewer's local timezone and on `now`. The server has neither. Rendering a computed time on the server guarantees a React hydration mismatch, which shows as a console error and can cause a visible flash.

**Traded off:** The countdown is not in the server rendered HTML. That is correct here: it is live data, not content a scraper needs, and everything else on the page stays server rendered per the spec.

**Confidence:** high. **Cost if wrong:** low, the alternative is a `suppressHydrationWarning`, which hides the problem rather than fixing it.

**Status:** inferred, high confidence

---

## D-05. Known edge case in the spec's `nextThursday19()`, left as specced

**The issue:** the spec's rollover guard is

```ts
if (add === 0 && (d.getHours() > 19 || (d.getHours() === 19 && d.getMinutes() > 0))) add = 7;
```

Between 19:00:00 and 19:00:59 on a Thursday, `getHours() === 19` and `getMinutes() === 0`, so neither branch is true and `add` stays 0. The target is then set to today at 19:00:00, which is in the past, and the countdown shows a negative or zeroed value for up to sixty seconds once a week.

**Chosen:** Implement the function exactly as the spec gives it, since the spec is binding and says "where the spec gives code, use it". Then **guard the display**, not the function: if the computed target is in the past, clamp the rendered digits to `00 : 00 : 00 : 00` rather than showing negative numbers.

**Why:** The spec's code is authoritative, and a one minute a week edge case does not justify silently diverging from it. Clamping the display fixes the only user visible symptom without touching the specced function.

**Traded off:** For up to sixty seconds each Thursday the countdown reads all zeros, which is arguably the correct thing to show at exactly the session start time anyway.

**Confidence:** high on the analysis, medium on whether Isaac wants the function itself corrected.

**Cost if wrong:** very low. If Isaac wants the function fixed, the change is `getMinutes() > 0` to `getMinutes() >= 0`, or more simply comparing the computed target against `now` and adding seven days if it is not in the future. One line, isolated.

**Status:** inferred, flagged for Isaac. Surface this at the top of the B1 session report.

---

## D-06. The two forms are one component with a `location` prop, holding independent state

**Chosen:** A single `RegistrationForm` component used twice, taking `location` as a prop (`hero_form` or `final_form`). Each instance holds its own state, so submitting the hero form does not change the final form.

**Why:** The spec says "same component, same events with a different location param". Independent state is the honest behavior: there is no backend, so there is no shared knowledge of a registration.

**Confidence:** high. **Cost if wrong:** low.

**Status:** inferred, high confidence

---

## D-07. No privacy policy, cookie banner, or consent management

**Chosen:** Build none of it.

**Why:** The forms store nothing and transmit nothing. The page transmits only GA4 pageviews and events. Recording the decision matters more than building the feature.

**Trigger that would change this:** if the forms are ever wired to a real webinar platform and start collecting real names and addresses, a consent banner and privacy policy become mandatory before launch.

**Status:** deferred, with trigger recorded

---

## D-08. No test framework beyond the Playwright behavioral pass

**Chosen:** No Jest, no Vitest. Verification is build, lint, a targeted logic check on the countdown rollover cases, and one Playwright behavioral script.

**Why:** The countdown is the only pure logic worth checking, and it is checked directly against the four rollover cases in the logic step. A full unit test framework for one function is process for its own sake.

**Note:** if the countdown check is easier to run as a throwaway node script than by inspection, that is fine. Record the result in `SESSION_LOG.md` either way.

**Status:** settled

---

## D-09. `countdown_view` fires once on the chip's first mount

**Chosen:** Fired in the countdown component's mount effect, guarded by a ref so React strict mode double invocation does not double fire.

**Why:** The spec says "fired once when the chip first mounts", which is mount timing, not scroll into view timing. The chip is above the fold anyway.

**Confidence:** high. **Cost if wrong:** near zero.

**Status:** inferred, high confidence

---

## D-10. Session time stays Thursdays at 19:00 local

**Chosen:** Exactly as the spec states. Do not change it.

**Why:** Product decision, therefore a human gate, even for a fictional brand.

**Status:** settled, human gated

---

## D-11. Favicon is a vector mark, not a raster file

**Chosen:** An SVG favicon, warm white `#FFF7F2` on vermilion `#E63B12`.

**Why:** The spec permits a favicon but forbids raster images everywhere else. A vector favicon keeps the zero raster claim honest.

**Confidence:** medium on the exact design, high on the approach.

**Status:** inferred, medium confidence, flagged for Isaac

---

## D-12. GA4 Measurement ID stays as the placeholder

**Chosen:** `G-XXXXXXXXXX` is left exactly as written. The Meta Pixel block stays commented.

**Why:** Human gate. Only Isaac can create the GA4 property and its data streams.

**Status:** settled, blocked pending Isaac

---

## D-13. Em dash prevention is mechanical, not remembered

**Chosen:** A PowerShell scan for U+2014 across all source and markdown, run before every commit. Zero results is the pass condition. Command is in `CLAUDE.md`.

**Why:** House style says enforce deterministically, not by asking the model to remember.

**Status:** settled

---

## D-14. Git: own repository, own remote

**Chosen:** Standalone git repo with its own GitHub remote, not a monorepo.

**Why:** Five Claude Code instances run in parallel. A shared repo would produce constant push conflicts. Separate repos map cleanly to separate Vercel projects.

**Status:** settled

---

## D-15. Deployment is a human gate

**Chosen:** Claude builds and verifies locally. Isaac runs `vercel` and `vercel --prod`.

**Why:** Vercel CLI on this machine is not logged in. Deployment is also outward facing.

**Status:** settled, blocked pending Isaac

---

## D-16. `agentRules: false` in `next.config.ts`, to stop Next.js rewriting `CLAUDE.md`

**The issue found in B1:** Next.js 16 runs `writeAgentFiles()` on every `next dev`. It appends a managed block to `AGENTS.md`, or to `CLAUDE.md` when no `AGENTS.md` hosts it. On the first dev run it appended that block to this project's `CLAUDE.md`. The block contains two em dashes, so the mandatory em dash scan failed, and it silently rewrote a pack file that is outside every batch's bounded file list. The block re-adds itself, so deleting it is not durable.

**Chosen:** Set `agentRules: false` in `next.config.ts`. The generated block is removed and never regenerates. No `AGENTS.md` is created.

**Why:** It is the supported off switch, named by Next.js itself in the dev output. The alternative considered and tested was to keep a stub `AGENTS.md` to absorb the block, which works (verified: `CLAUDE.md` is then skipped) but leaves an em dash carrying file in the repo and an extra file nobody asked for. Turning the feature off is cleaner and keeps the scan honest.

**Traded off:** Nothing of value. The block only tells an agent to read the bundled Next.js docs, which is not a project rule and is not something this pack depends on.

**Confidence:** high. **Cost if wrong:** near zero, it is one line in `next.config.ts`.

**Status:** settled
