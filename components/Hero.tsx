"use client";

import { motion, useReducedMotion } from "framer-motion";
import Countdown from "./Countdown";
import RegistrationForm from "./RegistrationForm";

const LINES = ["STOP GUESSING", "WHAT THE MARKET", "IS DOING."];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  // Entrance is decoration: reduced motion gets the finished state immediately.
  const rise = reduceMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
      };

  const stack = reduceMotion
    ? { hidden: {}, show: {} }
    : { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

  return (
    <section className="px-5 pb-16 pt-12 sm:pb-20 sm:pt-16">
      <div className="mx-auto max-w-[980px] text-center">
        <motion.h1
          variants={stack}
          initial="hidden"
          animate="show"
          className="font-display uppercase leading-[0.95] tracking-[0.01em] text-type"
          style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)" }}
        >
          {LINES.map((line) => (
            <motion.span key={line} variants={rise} className="block">
              {line}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          variants={rise}
          initial="hidden"
          animate="show"
          transition={reduceMotion ? undefined : { delay: 0.28, duration: 0.5, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-type/90 sm:text-lg"
        >
          A free 45 minute live briefing every Thursday. What moved this week, why it moved, and
          what careful investors are watching next. Plain language, no signals, no pitches.
        </motion.p>

        <motion.div
          variants={rise}
          initial="hidden"
          animate="show"
          transition={reduceMotion ? undefined : { delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="mt-8 flex justify-center"
        >
          <Countdown />
        </motion.div>

        <motion.div
          variants={rise}
          initial="hidden"
          animate="show"
          transition={reduceMotion ? undefined : { delay: 0.5, duration: 0.5, ease: "easeOut" }}
          className="mx-auto mt-8 max-w-[620px] text-left"
        >
          <RegistrationForm location="hero_form" />
        </motion.div>
      </div>
    </section>
  );
}
