"use client";

import { motion, useReducedMotion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  // Decoration, not content: absent entirely under reduced motion.
  if (reduceMotion) return null;

  return (
    <motion.div
      data-testid="scroll-progress"
      aria-hidden="true"
      style={{ scaleX: scrollYProgress }}
      className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left bg-type"
    />
  );
}
