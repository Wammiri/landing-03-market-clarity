"use client";

import { useEffect, useRef, useState } from "react";
import { nextThursday19, timeParts, PLACEHOLDER_PARTS, type TimeParts } from "@/lib/countdown";
import { track } from "@/lib/track";

const UNITS: { key: keyof TimeParts; label: string }[] = [
  { key: "days", label: "DAYS" },
  { key: "hours", label: "HRS" },
  { key: "minutes", label: "MIN" },
  { key: "seconds", label: "SEC" },
];

export default function Countdown() {
  /*
    Decision D-04. The server has no idea what timezone the viewer is in, so it
    renders a stable placeholder and the live value mounts client side. Rendering
    a computed time on the server would guarantee a hydration mismatch, which is
    the single most likely bug on this page.
  */
  const [parts, setParts] = useState<TimeParts>(PLACEHOLDER_PARTS);
  const viewFired = useRef(false);

  useEffect(() => {
    const tick = () => setParts(timeParts(nextThursday19(), new Date()));
    tick();
    const id = setInterval(tick, 1000);

    // D-09: once on first mount, guarded against strict mode double invocation.
    if (!viewFired.current) {
      viewFired.current = true;
      track("countdown_view");
    }

    return () => clearInterval(id);
  }, []);

  return (
    <div
      data-testid="countdown"
      className="mx-auto inline-flex flex-col items-center gap-3 rounded-[999px] bg-ink px-6 py-4 sm:flex-row sm:gap-5 sm:px-8"
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="go-dot block h-2 w-2 shrink-0 rounded-full bg-go"
        />
        <span className="font-mono text-[0.68rem] font-medium tracking-[0.16em] text-type/85">
          NEXT LIVE SESSION IN
        </span>
      </div>

      <div className="flex items-start gap-1.5 sm:gap-2" role="timer" aria-live="off">
        {UNITS.map((unit, i) => (
          <div key={unit.key} className="flex items-start gap-1.5 sm:gap-2">
            {i > 0 && (
              <span
                aria-hidden="true"
                className="font-mono text-xl font-medium leading-none text-type/40 pt-0.5"
              >
                :
              </span>
            )}
            <div className="flex w-[2.4rem] flex-col items-center sm:w-[2.6rem]">
              {/* Fixed width box plus tabular figures: the digits cannot shift layout. */}
              <span
                data-testid={`countdown-${unit.key}`}
                className="tabular font-mono text-xl font-medium leading-none text-type sm:text-2xl"
              >
                {parts[unit.key]}
              </span>
              <span className="mt-1.5 font-mono text-[0.55rem] font-medium tracking-[0.12em] text-type/55">
                {unit.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">
        The next live session starts on Thursday at 19:00 your local time.
      </span>
    </div>
  );
}
