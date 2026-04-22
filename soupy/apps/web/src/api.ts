import type { ChatRequest, ChatResponse, NeedCategory } from "@soupy/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${apiBaseUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error("Unable to send message");
  }

  return response.json();
}

export async function resetSession(sessionId?: string): Promise<{ sessionId: string }> {
  const response = await fetch(
    sessionId ? `${apiBaseUrl}/sessions/${sessionId}` : `${apiBaseUrl}/sessions/reset`,
    { method: sessionId ? "DELETE" : "POST" }
  );

  if (!response.ok) {
    throw new Error("Unable to reset session");
  }

  return response.json();
}

export const quickPrompts: Array<{ label: string; message: string; need: NeedCategory }> = [
  { label: "I need shelter tonight", message: "I need shelter tonight", need: "shelter" },
  { label: "I need food nearby", message: "I need food nearby", need: "food" },
  { label: "I need help getting documents", message: "I need help getting documents", need: "legal_documentation" },
  { label: "I feel overwhelmed", message: "I feel overwhelmed", need: "mental_health" },
  { label: "I need healthcare", message: "I need healthcare", need: "healthcare" }
];
