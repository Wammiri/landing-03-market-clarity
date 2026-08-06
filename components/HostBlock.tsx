export default function HostBlock() {
  return (
    <section className="px-5 pb-16 sm:pb-20">
      <div className="mx-auto max-w-[980px]">
        <h3
          className="font-display uppercase leading-[0.95] text-type"
          style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}
        >
          Who runs the briefing
        </h3>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-type">
          Market Clarity Live is hosted by a small team of market practitioners who spend the week
          inside the data so you do not have to. No courses to sell you at the end. The briefing is
          the product.
        </p>
      </div>
    </section>
  );
}
