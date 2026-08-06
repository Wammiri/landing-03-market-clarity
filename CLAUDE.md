# CLAUDE.md: Market Clarity Live

## Identity

A single page webinar registration site for a fictional free weekly live session called Market Clarity Live. One job: get a first name and an email into the form. Concept build for Isaac Olorode's landing page portfolio. Part of a five project suite built in parallel.

This is the **unapologetic direct response piece** of the set: loud, hot, poster like, genre true. It should feel like a page pulled from a working investing education funnel, executed with real craft. Loud is the brief. Do not quieten it toward the other pages in the suite.

`SPEC.md` in this folder is the complete specification. It is self contained: palette, fonts, verbatim copy, code, analytics, and performance rules are all inside it. Build exactly to spec.

## Weight class: LIGHT

A single static page. No auth, no database, no money, no user accounts, no backend. Per the building methodology's right-sizing rule, this project gets the pack files but thin contents.

Explicitly NOT needed here, and this is a recorded decision, not an oversight:
- No control matrix. No permissions, no state machines, no persistent data.
- No adversarial pass. The two forms validate client side and post nowhere.
- No staging environment. No production database, no real users.
- No multi-batch decomposition beyond build then verify. See `BATCH_PLAN.md`.

Do not add process weight beyond this.

## Tech stack

Next.js App Router, TypeScript, Tailwind, framer-motion. That is the entire dependency list.

**A dependency is a decision.** Do not add any package beyond `framer-motion`. Specifically: **do not install a date library.** No date-fns, no dayjs, no luxon, no moment. The spec supplies the entire countdown date function; use it as written. If you believe something is needed, stop and flag it rather than installing it.

## The countdown is the one piece of real logic on this page

`nextThursday19()` is given verbatim in the spec. Use it exactly as written. It computes the next Thursday at 19:00 in the **viewer's local time**, rolling to next week if it is already past Thursday 19:00.

Two things matter and both are checked in the Playwright pass:

- **No hydration mismatch.** The server and the client will compute different times, and the server has no idea what timezone the viewer is in. The countdown must render a stable placeholder or mount client side so React never mismatches. This is the single most likely bug on this page.
- **No layout shift.** Fixed width digit boxes, `font-variant-numeric: tabular-nums`. The digits change every second, so any width jitter is immediately visible.

Under reduced motion the numbers **still update**, because that is content, not decoration. Only the pulsing dot stops.

## Honesty rules (non negotiable, they exist to protect Isaac's credibility)

- The footer must carry: `Concept build. Designed and built by Isaac Olorode. isaac.aperio.finance/landing` (linked). Not optional.
- Market Clarity Live is a fictional brand. Never use a real company name, a real logo, or a real person's name or likeness.
- **The countdown is honest evergreen webinar mechanics.** The label says `NEXT LIVE SESSION IN`, not a fake expiring offer. It counts to a genuinely recurring weekly time. Do not turn it into a fake scarcity timer, do not add "only 12 seats left", do not add a countdown that resets on reload to fake urgency.
- The two testimonials are fictional copy for a fictional brand, exactly as written. Do not invent additional statistics, attendee counts, conversion percentages, ratings, or press mentions.
- No fake price data anywhere. This is an investing education page; invented market numbers would be the worst possible failure.

## House style (enforced, not remembered)

**No em dashes anywhere.** Not in page copy, not in comments, not in metadata, not in commit messages, not in the pack files. Use periods, commas, colons, or parentheses. En dashes only for date ranges.

Checked mechanically before the batch is closed. From the project root:

```powershell
Get-ChildItem -Recurse -File -Include *.tsx,*.ts,*.css,*.md,*.json | Where-Object { $_.FullName -notmatch 'node_modules|\.next' } | Select-String -Pattern ([char]0x2014) | Select-Object Path, LineNumber, Line
```

Zero results is the pass condition.

Also forbidden per spec: cream backgrounds, serif fonts, emoji, icon libraries, raster images, fake price data, more than the one yellow micro accent, em dashes.

## Verification

Follow the verification ladder. This is a UI and behavior project with real date logic, so it earns rung 3 with an extra logic focus.

1. `npm run build` clean, `npm run lint` clean.
2. Targeted logic check on `nextThursday19()` across the rollover cases: before Thursday, on Thursday before 19:00, on Thursday after 19:00, and Sunday. Also the email validation and the reduced motion branches.
3. Playwright behavioral check via the `webapp-testing` skill. Assertions are listed in `BATCH_PLAN.md`.

Record which rung was used in `SESSION_LOG.md`.

## Human gates (stop and flag, do not invent)

- The GA4 Measurement ID. Leave `G-XXXXXXXXXX` exactly as written in `app/layout.tsx`.
- The Meta Pixel ID. The pixel block stays commented out.
- Any deploy to Vercel. Vercel CLI is not logged in on this machine.
- The session time (Thursdays 19:00) is a product decision, fixed by the spec. Do not change it.

## Git

This folder is its own git repository. Commit format: `type(scope): ID description`. One commit per task closed. Push at the end of the batch. Scan the diff for secrets before pushing.

## Onboarding read order

Every session, before touching code: `DECISIONS.md`, then `SESSION_LOG.md`, then `BATCH_PLAN.md`. Consult `DISCOVERY.md` for product intent. `SPEC.md` is binding on matters of design and copy.

## Stop condition

One batch per session. When the batch is done, update `SESSION_LOG.md`, `CHANGELOG.md`, and `BATCH_PLAN.md` status, commit, push, then stop and report. Do not chain into the next batch.
