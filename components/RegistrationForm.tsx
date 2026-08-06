"use client";

import { useId, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { track, type FormLocation } from "@/lib/track";

/*
  Decision D-06. One component, used twice with a location prop. Each instance
  holds its own state, so submitting the hero form does not change the final
  form. There is no backend, so there is no shared knowledge of a registration.
*/
export default function RegistrationForm({ location }: { location: FormLocation }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const reduceMotion = useReducedMotion();

  const uid = useId();
  const nameId = `${uid}-first-name`;
  const emailId = `${uid}-email`;
  const errorId = `${uid}-error`;

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    track("cta_click", { location });

    if (!firstName.trim()) {
      setError("Enter your first name.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(null);

    /*
      Production integration point. In a live funnel the lead would be posted to
      the webinar platform here (Zoom Webinars registrant API, or Brevo, which
      would then send the calendar invite and the replay link). This is a concept
      build: nothing is transmitted, nothing is stored, and the values below are
      discarded when the component unmounts.
    */

    track("webinar_signup", { location });
    setSubmitted(true);
  }

  const cardClass =
    "rounded-lg border border-tint bg-tint p-5 backdrop-blur-md sm:p-6";

  if (submitted) {
    return (
      <div className={cardClass} data-testid={`form-${location}`}>
        <p
          data-testid={`success-${location}`}
          role="status"
          className="py-6 text-center text-lg font-semibold text-type sm:text-xl"
        >
          You are in. Check your inbox for the calendar invite.
        </p>
      </div>
    );
  }

  return (
    <div className={cardClass} data-testid={`form-${location}`}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={nameId} className="text-xs font-semibold tracking-[0.1em] text-type">
              FIRST NAME
            </label>
            <input
              id={nameId}
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-tint bg-ink/25 px-3.5 py-3 text-base text-type placeholder:text-type/45"
              placeholder="Alex"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={emailId} className="text-xs font-semibold tracking-[0.1em] text-type">
              EMAIL
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className="w-full rounded-lg border border-tint bg-ink/25 px-3.5 py-3 text-base text-type placeholder:text-type/45"
              placeholder="alex@example.com"
            />
          </div>
        </div>

        {error && (
          <p
            id={errorId}
            data-testid={`error-${location}`}
            role="alert"
            className="mt-3 text-sm font-semibold text-type"
          >
            {error}
          </p>
        )}

        <motion.button
          type="submit"
          data-testid={`submit-${location}`}
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="mt-4 w-full rounded-lg bg-ink px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-type sm:text-base"
        >
          Save my free seat
        </motion.button>
      </form>

      <p className="mt-3 text-center text-xs text-type/85">
        Can not make it live? Register anyway and the replay lands in your inbox.
      </p>
    </div>
  );
}
