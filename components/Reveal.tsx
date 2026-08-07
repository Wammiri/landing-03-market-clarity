"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* Reports false during server render and true once running on the client. */
const emptySubscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

/*
  Scroll reveal that can never hide content.

  The hidden starting state is only armed after the component has mounted on the
  client. Server output, reduced motion, and any render that does not scroll
  (a full page screenshot, print, a crawler) all show the resting state, because
  copy must not depend on an animation having fired. Found during B1
  verification: the earlier whileInView-only version left the three what you get
  rows and both testimonials permanently invisible in a full page capture.
*/
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: "div" | "figure";
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const armed = useIsClient();

  const Component = as === "figure" ? motion.figure : motion.div;
  const animate = reduceMotion || !armed;

  return (
    <Component
      className={className}
      initial={animate ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={animate ? { duration: 0 } : { duration: 0.45, ease: "easeOut", delay }}
    >
      {children}
    </Component>
  );
}
