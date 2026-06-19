import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const burgerItems = [
  {
    name: "Classic Burger",
    price: 120.0,
    description: "Juicy patty with cheddar, lettuce, tomato, and house sauce.",
    imageUrl: "/images/burgers/classic-burger.png",
    category: "burgers",
  },
  {
    name: "Spicy BBQ Burger",
    price: 135.0,
    description: "Smoky bacon, onion rings, and spicy BBQ sauce.",
    imageUrl: "/images/burgers/spicy-bbq-burger.png",
    category: "burgers",
  },
  {
    name: "Mushroom Swiss Burger",
    price: 145.0,
    description: "Caramelized mushrooms and Swiss cheese on a toasted bun.",
    imageUrl: "/images/burgers/mushroom-swiss-burger.png",
    category: "burgers",
  },
  {
    name: "Crispy Chicken Burger",
    price: 150.0,
    description:
      "Golden fried chicken breast with chipotle mayo and crispy slaw.",
    imageUrl: "/images/burgers/crispy-chicken-burger.png",
    category: "burgers",
  },
];

const drinkItems = [
  {
    name: "Soda",
    price: 50.0,
    description: "Refreshing classic cola served chilled.",
    imageUrl: "/images/drinks/soda.png",
    category: "drinks",
  },
  {
    name: "Iced Tea",
    price: 60.0,
    description: "Fresh brewed and lightly sweetened.",
    imageUrl: "/images/drinks/iced-tea.png",
    category: "drinks",
  },
  {
    name: "Sparkling Lemonade",
    price: 75.0,
    description: "Citrus refreshment with bubbles.",
    imageUrl: "/images/drinks/sparkling-lemonade.png",
    category: "drinks",
  },
  {
    name: "Mango Shake",
    price: 95.0,
    description: "Creamy blended mango with vanilla ice cream.",
    imageUrl: "/images/drinks/mango-shake.png",
    category: "drinks",
  },
];

async function main() {
  console.log("Seeding database items...");

  // Clean out existing products before filling to prevent duplicate entries
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [...burgerItems, ...drinkItems],
  });

  console.log("Database seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
