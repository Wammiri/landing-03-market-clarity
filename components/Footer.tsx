export default function Footer() {
  return (
    <footer className="bg-ink px-5 py-12">
      <div className="mx-auto max-w-[980px]">
        <p
          className="font-display uppercase leading-none text-type"
          style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)" }}
        >
          Market Clarity Live
        </p>

        {/* Honesty rule: the concept credit is not optional. */}
        <p className="mt-4 text-sm leading-relaxed text-type/70">
          Concept build. Designed and built by Isaac Olorode.{" "}
          <a
            href="https://isaac.aperio.finance/landing"
            className="underline underline-offset-4 hover:text-type"
          >
            isaac.aperio.finance/landing
          </a>
        </p>

        <p className="mt-2 text-sm text-type/70">Copyright 2026.</p>
      </div>
    </footer>
  );
}
