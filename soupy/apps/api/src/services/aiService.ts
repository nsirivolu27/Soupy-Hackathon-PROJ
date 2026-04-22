import OpenAI from "openai";
import type { NeedCategory, Resource } from "@soupy/shared";

const systemPrompt = `You are Soupy, a supportive AI assistant for resource navigation and emotional support for people in Washington, DC.
You are not a therapist, doctor, lawyer, case worker, or emergency service.
Use calm, respectful, concise language at a low reading level.
Do not provide medical, psychiatric, or legal advice.
Prefer next steps and simple choices. Keep paragraphs short.
If crisis or emergency content appears, tell the user to call 911 for immediate danger or medical emergency and 988 for suicide or emotional crisis support.`;

export async function generateSupportiveReply(input: {
  message: string;
  needs: NeedCategory[];
  resources: Resource[];
}): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackReply(input.needs, input.resources);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const resourceSummary = input.resources
    .slice(0, 4)
    .map((resource) => `${resource.name} (${resource.category}) - ${resource.phone}`)
    .join("; ");

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.3,
    max_tokens: 280,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `User message: ${input.message}\nDetected needs: ${input.needs.join(", ") || "unknown"}\nMatching resources: ${resourceSummary || "none"}`
      }
    ]
  });

  return completion.choices[0]?.message.content?.trim() || fallbackReply(input.needs, input.resources);
}

function fallbackReply(needs: NeedCategory[], resources: Resource[]): string {
  const needText = needs.length > 0 ? needs.filter((need) => need !== "crisis").join(", ") : "support";
  const resourceText = resources.length > 0
    ? ` A good next step is to contact ${resources[0].name} at ${resources[0].phone}.`
    : " I can help narrow this down. Choose one need below or type what feels most urgent.";

  return `I hear you. It sounds like you may need ${needText}.${resourceText} You deserve help that is clear and respectful.`;
}
