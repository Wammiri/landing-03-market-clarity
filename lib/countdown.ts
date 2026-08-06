/**
 * The next Thursday at 19:00 in the viewer's local time.
 *
 * Verbatim from SPEC.md section 3. Do not rewrite it. A known edge case between
 * 19:00:00 and 19:00:59 on a Thursday is recorded as decision D-05: the function
 * stays as specced and the display clamps to zeros instead. See timeParts below.
 */
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

export type TimeParts = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export const PLACEHOLDER_PARTS: TimeParts = {
  days: "--",
  hours: "--",
  minutes: "--",
  seconds: "--",
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Split the remaining milliseconds into padded DD HH MM SS strings.
 *
 * Clamps to all zeros when the target is not in the future. This is the D-05
 * guard: it covers the one minute a week where the specced function returns a
 * target that has just passed, and showing zeros at exactly session start is
 * the right thing to display anyway.
 */
export function timeParts(target: Date, now: Date): TimeParts {
  const remaining = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: pad(Math.floor(totalSeconds / 86400)),
    hours: pad(Math.floor((totalSeconds % 86400) / 3600)),
    minutes: pad(Math.floor((totalSeconds % 3600) / 60)),
    seconds: pad(totalSeconds % 60),
  };
}
