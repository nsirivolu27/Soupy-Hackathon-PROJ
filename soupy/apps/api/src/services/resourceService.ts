import type { NeedCategory, Resource } from "@soupy/shared";
import { prisma } from "../db.js";

const resourceCategories = [
  "shelter",
  "food",
  "hygiene",
  "transportation",
  "healthcare",
  "mental_health",
  "employment",
  "legal_documentation"
] as const;

export async function getResourcesForNeeds(needs: NeedCategory[], limitPerCategory = 2): Promise<Resource[]> {
  const categories = needs.filter((need): need is (typeof resourceCategories)[number] =>
    resourceCategories.includes(need as (typeof resourceCategories)[number])
  );

  const results = await Promise.all(
    categories.map((category) =>
      prisma.resource.findMany({
        where: { category },
        take: limitPerCategory,
        orderBy: { name: "asc" }
      })
    )
  );

  return results.flat().map((resource) => ({
    id: resource.id,
    name: resource.name,
    category: resource.category,
    address: resource.address,
    phone: resource.phone,
    hours: resource.hours,
    notes: resource.notes
  }));
}

export async function getResourcesByCategories(categories: NeedCategory[]): Promise<Resource[]> {
  return getResourcesForNeeds(categories, 10);
}
