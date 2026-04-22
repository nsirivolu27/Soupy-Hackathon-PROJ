import type { CrisisDetection } from "@soupy/shared";

const crisisPatterns: Array<{ reason: string; pattern: RegExp }> = [
  { reason: "self-harm", pattern: /\b(hurt myself|cut myself|self[-\s]?harm|end my life|kill myself)\b/i },
  { reason: "suicidal ideation", pattern: /\b(suicide|suicidal|do not want to live|don't want to live|want to die)\b/i },
  { reason: "violence", pattern: /\b(kill someone|hurt someone|attack|weapon|gun|knife|violent)\b/i },
  { reason: "abuse", pattern: /\b(abused|abuse|assaulted|rape|trafficked|domestic violence|someone is hurting me)\b/i },
  { reason: "overdose", pattern: /\b(overdose|od\b|took too much|poisoned|fentanyl|naloxone|narcan)\b/i },
  { reason: "urgent medical need", pattern: /\b(chest pain|can't breathe|cannot breathe|bleeding badly|stroke|seizure|medical emergency)\b/i }
];

export function detectCrisis(text: string): CrisisDetection {
  const reasons = crisisPatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ reason }) => reason);

  return {
    isCrisis: reasons.length > 0,
    reasons
  };
}

export function crisisReply(reasons: string[]): string {
  const reasonText = reasons.length > 0 ? ` I noticed possible ${reasons.join(", ")} language.` : "";
  return [
    `I am really glad you said something.${reasonText}`,
    "If you might hurt yourself or someone else, or there is an overdose or medical emergency, call 911 now or ask a nearby person to call.",
    "For suicide or emotional crisis support, call or text 988. If you can, move near another person, a staffed desk, or a public place while you get help."
  ].join(" ");
}
