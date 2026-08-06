# DISCOVERY: Market Clarity Live

**Mode:** New build from a PRD (`SPEC.md`). The spec is unusually complete, so discovery is a thin pass recording intent, weight class, and open ambiguities. Not a full grill; the spec already answers what a grill would have asked.

**Date:** 2026-08-06

---

## 1. What is being built and why

A single page webinar registration site for a fictional free weekly live briefing. The conversion goal is a first name and an email into a form. This is the **webinar registration** pattern in the four pattern portfolio set.

The real purpose is portfolio evidence, and this page carries a specific burden the others do not: it has to prove Isaac can execute the loud, genre true direct response register **without it looking cheap**. Anyone can build a tasteful page. The skill being demonstrated is a hot red DR poster that still reads as craft.

## 2. The real audience, two layers

- **Fictional:** a retail investor who is drowning in market noise and wants someone to tell them what actually happened this week. They respond to urgency and clarity. They have registered for webinars before and know the genre.
- **Real:** the recruiter and the end client, on a phone, briefly. This page is the one that most resembles the work the actual job involves. If the client runs investing education funnels, this is the page that says "I can do your existing job on day one."

## 3. Why this pattern, in this suite

Four concept pages, four DR patterns, four visual identities. Market Clarity Live is the **webinar registration** entry and the loud one.

Its counterparts: Foundations (lead capture, dark market terminal), Cambr (free trial, light and restrained), Tally (waitlist, graph paper minimal). The contrast with Cambr is the sharpest in the set and it is deliberate: it demonstrates range, which is the thesis of the whole portfolio.

## 4. Success criteria

- Reads as a real working funnel page, not a parody of one and not a tasteful designer's idea of one.
- Everything above the fold on desktop: headline, promise, countdown, form.
- The countdown is correct in the viewer's local timezone and rolls over properly.
- Zero hydration mismatch warnings in the console.
- Lighthouse mobile 95+, achieved honestly with zero raster images.
- GA4 fires `cta_click`, `webinar_signup` with distinct location params from the two forms, and `countdown_view` once.

## 5. Scale assumptions

None that matter. Static page, CDN served, no backend, no database, no per user state. Both forms post nowhere; they swap to a success state client side. Traffic is portfolio traffic.

This is why the weight class is LIGHT.

## 6. Failure modes worth designing against

| Failure | Why it matters | Mitigation |
|---|---|---|
| **Hydration mismatch on the countdown** | The most likely real bug on this page. Server and client compute different times and the server does not know the viewer's timezone | Render a stable placeholder on the server, mount the live countdown client side, verify zero console errors in the Playwright pass |
| Countdown layout shift | Digits change every second, so jitter is constantly visible and costs Lighthouse points | Fixed width digit boxes, tabular numerals |
| Countdown rollover bug | A timer showing a Thursday that has passed destroys the credibility of the whole page | Explicit logic check across four cases: before Thursday, Thursday before 19:00, Thursday after 19:00, Sunday |
| Reading as cheap rather than genre true | This is the whole burden of the page | Anton at real display scale, disciplined single yellow micro accent, one black chip, generous negative space inside the loudness |
| The two forms firing identical events | Kills the ability to compare hero versus final conversion, which is the DR proof point | Distinct `location` params, verified separately in Playwright |
| Contrast failure of warm white on vermilion | Real accessibility failure and a visible quality tell | Full opacity `type` for body copy, 90% only on the short sub line, large display type only where the ratio is comfortable |
| Fake scarcity creeping in | Honesty rule violation | The label is `NEXT LIVE SESSION IN` and the target is a genuinely recurring weekly time |

## 7. Data model

There is none. The only data is a first name and an email string held in client state for the duration of a submission, then discarded. Nothing is persisted, transmitted, or stored.

A code comment marks where the webinar platform (Zoom, Brevo) would receive the lead in production. That comment is the deliverable, not an integration.

**Implication:** no privacy policy, no consent management, no data protection surface beyond GA4 itself. Recorded as a decision, see `DECISIONS.md` D-07.

## 8. Ambiguities the spec leaves open

Resolved with sensible defaults, isolated as one line switches, flagged for Isaac. Full record with confidence and cost in `DECISIONS.md`.

- Server render strategy for the countdown. Default: stable placeholder plus client mount, which is the only approach that avoids a mismatch.
- `countdown_view` timing. Default: fires once on the chip's first mount, as the spec says, not on scroll into view.
- Whether the two form cards share state. Default: independent. Submitting the hero form does not change the final form.
- Both forms are the same component with a `location` prop. Default: yes, the spec says "same component, same events with a different location param".
- Favicon design. Default: a vector mark, warm white on vermilion.

## 9. Where this is heading next

Nowhere. Fixed scope, deadline tonight. Not a product with a roadmap.

One downstream dependency, external: once deployed, the production URL and real Lighthouse mobile score go to project `05-isaac-site` for `[TODO_URL_3]` and `[TODO_SCORE_3]`. Tracked in `BATCH_PLAN.md` as an outbound handoff.

## 10. Weight class decision

**LIGHT.** No heavy signal present: one anonymous role, no multi-tenancy, no regulated data, no money, no irreversible actions, no AI with tool use.

The countdown is the only real logic in the project, and it is fifteen lines given verbatim in the spec. It earns a targeted logic check across its rollover cases, not a control matrix.

Pack files exist because they are cheap and carry the trail. Contents stay thin.
