import { FormEvent, useEffect, useRef, useState } from "react";
import type { ChatMessage, CrisisDetection, NeedCategory, Resource } from "@soupy/shared";
import { quickPrompts, resetSession, sendChatMessage } from "../api";
import { CrisisAlert } from "../components/CrisisAlert";
import { Disclaimer } from "../components/Disclaimer";
import { ResourceCards } from "../components/ResourceCards";

const emptyCrisis: CrisisDetection = { isCrisis: false, reasons: [] };

export function ChatPage({ onHome }: { onHome: () => void }) {
  const [sessionId, setSessionId] = useState<string>(() => localStorage.getItem("soupy-session-id") || "");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi, I am Soupy. Tell me what you need right now, or choose one of the buttons below.",
      createdAt: new Date().toISOString()
    }
  ]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [needs, setNeeds] = useState<NeedCategory[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [crisis, setCrisis] = useState<CrisisDetection>(emptyCrisis);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, resources, crisis]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("soupy-session-id", sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    const clearSession = () => {
      localStorage.removeItem("soupy-session-id");
    };
    window.addEventListener("beforeunload", clearSession);
    return () => window.removeEventListener("beforeunload", clearSession);
  }, []);

  async function submitMessage(messageText: string) {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading || crisis.isCrisis) {
      return;
    }

    setError("");
    setInput("");
    setIsLoading(true);
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: trimmed, createdAt: new Date().toISOString() }
    ]);

    try {
      const response = await sendChatMessage({ sessionId: sessionId || undefined, message: trimmed });
      setSessionId(response.sessionId);
      setNeeds(response.needs);
      setResources(response.resources);
      setCrisis(response.crisis);
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: response.reply, createdAt: new Date().toISOString() }
      ]);
    } catch {
      setError("Soupy could not respond right now. Please try again or start over.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReset() {
    setIsLoading(true);
    setError("");
    try {
      const response = await resetSession(sessionId || undefined);
      localStorage.setItem("soupy-session-id", response.sessionId);
      setSessionId(response.sessionId);
      setMessages([
        {
          id: "welcome-reset",
          role: "assistant",
          content: "Fresh start. What do you need help with right now?",
          createdAt: new Date().toISOString()
        }
      ]);
      setResources([]);
      setNeeds([]);
      setInput("");
      setCrisis(emptyCrisis);
    } catch {
      setError("Could not reset the session. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitMessage(input);
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b-4 border-ink bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button className="text-left text-4xl font-black" type="button" onClick={onHome} aria-label="Back to Soupy home">
              Soupy
            </button>
            <p className="text-lg text-slate-700">Supportive AI for DC resource navigation</p>
          </div>
          <button
            className="bg-ink px-5 py-4 text-xl font-bold text-white"
            type="button"
            onClick={handleReset}
            disabled={isLoading}
          >
            Start Over
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.35fr_0.85fr]">
        <section className="space-y-5">
          <Disclaimer />
          <CrisisAlert crisis={crisis} />

          <section className="min-h-[420px] bg-white p-4 shadow-sm" aria-label="Conversation">
            <div className="space-y-4" aria-live="polite">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[92%] p-4 text-xl leading-relaxed ${
                    message.role === "user" ? "ml-auto bg-calm text-white" : "mr-auto bg-slate-100 text-ink"
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && <div className="mr-auto bg-slate-100 p-4 text-xl">Soupy is thinking...</div>}
              <div ref={endRef} />
            </div>
          </section>

          {error && (
            <div className="border-2 border-danger bg-red-50 p-4 text-xl font-bold text-danger" role="alert">
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Quick prompts">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.need}
                className="border-2 border-calm bg-white px-4 py-4 text-left text-xl font-bold text-calm hover:bg-teal-50 disabled:opacity-50"
                type="button"
                disabled={isLoading || crisis.isCrisis}
                onClick={() => submitMessage(prompt.message)}
              >
                {prompt.label}
              </button>
            ))}
          </div>

          <form className="bg-white p-4 shadow-sm" onSubmit={onSubmit}>
            <label className="text-xl font-black" htmlFor="message">
              Type what you need
            </label>
            <textarea
              id="message"
              className="mt-3 min-h-32 w-full border-4 border-slate-300 p-4 text-2xl leading-relaxed disabled:bg-slate-100"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={crisis.isCrisis ? "Use Start Over after getting immediate help." : "Example: I need a place to sleep tonight"}
              disabled={isLoading || crisis.isCrisis}
            />
            <button
              className="mt-3 w-full bg-warm px-6 py-5 text-2xl font-black text-white disabled:opacity-50"
              type="submit"
              disabled={isLoading || crisis.isCrisis || input.trim().length === 0}
            >
              Send
            </button>
          </form>
        </section>

        <aside className="space-y-5">
          <section className="bg-white p-5 shadow-sm" aria-label="Detected needs">
            <h2 className="text-2xl font-black">Needs noticed</h2>
            {needs.length === 0 ? (
              <p className="mt-2 text-lg text-slate-700">No category yet.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {needs.map((need) => (
                  <span className="bg-slate-200 px-3 py-2 text-lg font-bold" key={need}>
                    {need.replace("_", " ")}
                  </span>
                ))}
              </div>
            )}
          </section>
          <ResourceCards resources={resources} />
        </aside>
      </div>
    </main>
  );
}
