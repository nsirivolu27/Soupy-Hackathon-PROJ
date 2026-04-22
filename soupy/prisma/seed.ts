import { PrismaClient, ResourceCategory } from "@prisma/client";

const prisma = new PrismaClient();

const resources: Array<{
  name: string;
  category: ResourceCategory;
  address: string;
  phone: string;
  hours: string;
  notes: string;
}> = [
  {
    name: "Downtown Day Services Center",
    category: "shelter",
    address: "1313 New York Ave NW, Washington, DC 20005",
    phone: "(202) 383-8810",
    hours: "Weekdays, daytime hours",
    notes: "Example listing for intake, showers, laundry, phones, and connection to shelter resources."
  },
  {
    name: "DC Shelter Hotline",
    category: "shelter",
    address: "Washington, DC",
    phone: "(202) 399-7093",
    hours: "24/7 seasonal and emergency support",
    notes: "Call for current shelter availability and transportation options. Verify details before travel."
  },
  {
    name: "SOME Dining Room",
    category: "food",
    address: "71 O St NW, Washington, DC 20001",
    phone: "(202) 797-8806",
    hours: "Daily meals, call to confirm times",
    notes: "Example meal provider. Offers food support and connections to additional services."
  },
  {
    name: "Capital Area Food Bank Partner Locator",
    category: "food",
    address: "Washington, DC metro area",
    phone: "(202) 644-9800",
    hours: "Varies by partner site",
    notes: "Use partner listings to find nearby pantry and meal options. Call ahead when possible."
  },
  {
    name: "Thrive DC Day Program",
    category: "hygiene",
    address: "1525 Newton St NW, Washington, DC 20010",
    phone: "(202) 737-9311",
    hours: "Weekdays, call to confirm",
    notes: "Example hygiene and basic needs support including showers, laundry, and meals."
  },
  {
    name: "Unity Health Care - Healthcare for the Homeless",
    category: "healthcare",
    address: "1220 12th St SE, Washington, DC 20003",
    phone: "(202) 469-4699",
    hours: "Clinic hours vary",
    notes: "Primary care, behavioral health, and support services. Call for same-day guidance."
  },
  {
    name: "Community Connections Behavioral Health",
    category: "mental_health",
    address: "801 Pennsylvania Ave SE, Washington, DC 20003",
    phone: "(202) 546-1512",
    hours: "Weekdays, call first",
    notes: "Example mental health support provider. For immediate danger, use crisis options first."
  },
  {
    name: "DC 988 Lifeline",
    category: "mental_health",
    address: "Washington, DC",
    phone: "988",
    hours: "24/7",
    notes: "Free, confidential crisis support by phone, text, or chat."
  },
  {
    name: "Metro Reduced Fare and Trip Planning Help",
    category: "transportation",
    address: "Washington, DC",
    phone: "(202) 637-7000",
    hours: "Daily service information",
    notes: "Example transit information resource. Ask local providers about passes or emergency transport."
  },
  {
    name: "Bread for the City Legal Clinic",
    category: "legal_documentation",
    address: "1525 7th St NW, Washington, DC 20001",
    phone: "(202) 265-2400",
    hours: "Weekdays, appointment availability varies",
    notes: "Example support for public benefits, identification documents, and legal referrals."
  },
  {
    name: "DC Department of Human Services Service Center",
    category: "legal_documentation",
    address: "64 New York Ave NE, Washington, DC 20002",
    phone: "(202) 727-5355",
    hours: "Weekdays, call to confirm",
    notes: "Benefits and documentation navigation. Bring any available ID or paperwork."
  },
  {
    name: "DC Department of Employment Services",
    category: "employment",
    address: "4058 Minnesota Ave NE, Washington, DC 20019",
    phone: "(202) 724-7000",
    hours: "Weekdays",
    notes: "Workforce support, job search help, and training referrals."
  }
];

async function main() {
  await prisma.resource.deleteMany();
  await prisma.resource.createMany({ data: resources });
  console.log(`Seeded ${resources.length} DC example resources.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
