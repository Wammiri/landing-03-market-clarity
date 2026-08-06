/**
 * Analytics helper. SPEC.md section 6.
 *
 * Events pushed to dataLayer so they are visible to GA4 and assertable in the
 * Playwright pass without a live Measurement ID.
 */

export type FormLocation = "hero_form" | "final_form";

type EventName = "cta_click" | "webinar_signup" | "countdown_view";

type EventParams = {
  location?: FormLocation;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: EventName, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
