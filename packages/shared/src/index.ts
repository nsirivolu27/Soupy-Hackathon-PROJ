export const needCategories = [
  "shelter",
  "food",
  "hygiene",
  "transportation",
  "healthcare",
  "mental_health",
  "employment",
  "legal_documentation",
  "crisis"
] as const;

export type NeedCategory = (typeof needCategories)[number];

export type Resource = {
  id: string;
  name: string;
  category: Exclude<NeedCategory, "crisis">;
  address: string;
  phone: string;
  hours: string;
  notes: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type CrisisDetection = {
  isCrisis: boolean;
  reasons: string[];
};

export type ChatResponse = {
  sessionId: string;
  reply: string;
  needs: NeedCategory[];
  resources: Resource[];
  crisis: CrisisDetection;
};

export type ChatRequest = {
  sessionId?: string;
  message: string;
};
