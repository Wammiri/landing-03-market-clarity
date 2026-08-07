import Reveal from "./Reveal";

const ROWS = [
  {
    lead: "The week, decoded.",
    body: "The five moves that mattered, explained in plain language in the first fifteen minutes.",
  },
  {
    lead: "The why behind the noise.",
    body: "What actually drove the moves, separated from the stories your feed invented.",
  },
  {
    lead: "Next week's watchlist.",
    body: "The events and levels careful investors are watching, so Monday does not surprise you.",
  },
];

export default function WhatYouGet() {
  return (
    <section className="px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-[980px]">
        {ROWS.map((row, i) => (
          <Reveal
            key={row.lead}
            delay={i * 0.06}
            className={i > 0 ? "border-t border-tint pt-6 mt-6 sm:pt-7 sm:mt-7" : undefined}
          >
            <p className="text-lg font-semibold text-type sm:text-xl">{row.lead}</p>
            <p className="mt-1.5 max-w-[62ch] text-base leading-relaxed text-type">{row.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
