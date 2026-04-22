import type { CrisisDetection } from "@soupy/shared";

export function CrisisAlert({ crisis }: { crisis: CrisisDetection }) {
  if (!crisis.isCrisis) {
    return null;
  }

  return (
    <section className="border-4 border-danger bg-red-50 p-5 text-ink" role="alert" aria-live="assertive">
      <h2 className="text-2xl font-black text-danger">Immediate support</h2>
      <p className="mt-3 text-xl leading-relaxed">
        If there is immediate danger, an overdose, or a medical emergency, call <strong>911</strong> now.
      </p>
      <p className="mt-3 text-xl leading-relaxed">
        For suicide or emotional crisis support, call or text <strong>988</strong>. You can also ask a nearby person or staff member to stay with you.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a className="block bg-danger px-5 py-4 text-center text-xl font-bold text-white" href="tel:911">
          Call 911
        </a>
        <a className="block bg-ink px-5 py-4 text-center text-xl font-bold text-white" href="tel:988">
          Call 988
        </a>
      </div>
    </section>
  );
}
