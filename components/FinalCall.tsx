import RegistrationForm from "./RegistrationForm";

export default function FinalCall() {
  return (
    <section className="px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-[980px] text-center">
        <h2
          className="font-display uppercase leading-[0.95] text-type"
          style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)" }}
        >
          Thursday. 19:00. Be there.
        </h2>

        <div className="mx-auto mt-8 max-w-[620px] text-left">
          {/* Same component as the hero, distinct location param. */}
          <RegistrationForm location="final_form" />
        </div>
      </div>
    </section>
  );
}
