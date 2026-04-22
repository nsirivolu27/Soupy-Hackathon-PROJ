import { needCategories, type NeedCategory } from "@soupy/shared";

const categoryKeywords: Record<NeedCategory, RegExp[]> = {
  shelter: [/\bshelter\b/i, /\bsleep\b/i, /\btonight\b/i, /\bhousing\b/i, /\bplace to stay\b/i, /\boutside\b/i],
  food: [/\bfood\b/i, /\bhungry\b/i, /\bmeal\b/i, /\beat\b/i, /\bpantry\b/i],
  hygiene: [/\bshower\b/i, /\bbathroom\b/i, /\blaundry\b/i, /\bclothes\b/i, /\bhygiene\b/i],
  transportation: [/\btransport\b/i, /\bbus\b/i, /\bmetro\b/i, /\btrain\b/i, /\bride\b/i, /\bget to\b/i],
  healthcare: [/\bdoctor\b/i, /\bclinic\b/i, /\bmedicine\b/i, /\bhealth\b/i, /\bsick\b/i, /\bpain\b/i],
  mental_health: [/\boverwhelmed\b/i, /\banxious\b/i, /\bdepressed\b/i, /\bmental\b/i, /\bpanic\b/i, /\bstressed\b/i],
  employment: [/\bjob\b/i, /\bwork\b/i, /\bemployment\b/i, /\bresume\b/i, /\btraining\b/i],
  legal_documentation: [/\bid\b/i, /\bdocument\b/i, /\bbirth certificate\b/i, /\bsocial security\b/i, /\blegal\b/i, /\bbenefits\b/i],
  crisis: [/\b988\b/i, /\b911\b/i, /\bemergency\b/i]
};

export function classifyNeeds(text: string, crisis = false): NeedCategory[] {
  const lowered = text.toLowerCase();
  const matches = needCategories.filter((category) =>
    categoryKeywords[category].some((pattern) => pattern.test(lowered))
  );

  if (crisis && !matches.includes("crisis")) {
    matches.unshift("crisis");
  }

  return Array.from(new Set(matches));
}
