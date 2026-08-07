import Reveal from "./Reveal";

/* Fictional copy for a fictional brand, exactly as SPEC.md section 4 gives it. */
const QUOTES = [
  {
    quote: "Forty five minutes on Thursday replaced two hours of doomscrolling every day.",
    name: "DAYO O.",
  },
  {
    quote: "The first finance thing I have ever attended twice.",
    name: "MARTA G.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-ink px-5 py-16 sm:py-20">
      <div className="mx-auto grid max-w-[980px] gap-10 sm:grid-cols-2 sm:gap-12">
        {QUOTES.map((item, i) => (
          <Reveal key={item.name} as="figure" delay={i * 0.08}>
            <blockquote className="text-lg font-semibold leading-snug text-type sm:text-2xl">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 font-mono text-xs font-medium tracking-[0.14em] text-type/70">
              {item.name}
            </figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
