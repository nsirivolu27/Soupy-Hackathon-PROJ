import { Disclaimer } from "../components/Disclaimer";

export function HomePage({ onStart }: { onStart: () => void }) {
  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-5 py-8">
        <p className="text-lg font-bold uppercase tracking-wide text-calm">Washington, DC resource support</p>
        <h1 className="mt-3 text-6xl font-black leading-none text-ink sm:text-7xl">Soupy</h1>
        <p className="mt-6 max-w-2xl text-2xl leading-relaxed text-slate-700">
          A calm AI assistant for finding shelter, food, hygiene, healthcare, documents, work support, transportation, and emotional support.
        </p>
        <div className="mt-8">
          <Disclaimer />
        </div>
        <button
          className="mt-8 w-full bg-calm px-8 py-6 text-3xl font-black text-white shadow-lg transition hover:bg-teal-800 sm:w-auto"
          type="button"
          onClick={onStart}
        >
          Start
        </button>
        <p className="mt-6 text-lg text-slate-600">
          No account is needed. Use Start Over anytime to clear this public-machine session.
        </p>
      </div>
    </main>
  );
}
