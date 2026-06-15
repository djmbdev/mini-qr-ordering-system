import { GlassWater, Hamburger } from "lucide-react";
import CartSheet from "@/components/cart/cart-sheet";
import ProductCard from "@/components/cart/product-card";

const burgerItems = [
  {
    id: "burger-1",
    name: "Classic Burger",
    price: 65,
    description: "Juicy patty with cheddar, lettuce, tomato, and house sauce.",
  },
  {
    id: "burger-2",
    name: "Spicy BBQ Burger",
    price: 75,
    description: "Smoky bacon, onion rings, and spicy BBQ sauce.",
  },
  {
    id: "burger-3",
    name: "Mushroom Swiss Burger",
    price: 80,
    description: "Caramelized mushrooms and Swiss cheese on a toasted bun.",
  },
  {
    id: "burger-4",
    name: "Crispy Chicken Burger",
    price: 95,
    description:
      "Golden fried chicken breast with chipotle mayo and crispy slaw.",
  },
];

const drinkItems = [
  {
    id: "drink-1",
    name: "Soda",
    price: 50,
    description: "Classic cola or lemon-lime soda.",
  },
  {
    id: "drink-2",
    name: "Iced Tea",
    price: 55,
    description: "Fresh brewed and lightly sweetened.",
  },
  {
    id: "drink-3",
    name: "Sparkling Lemonade",
    price: 65,
    description: "Citrus refreshment with bubbles.",
  },
  {
    id: "drink-4",
    name: "Mango Shake",
    price: 85,
    description: "Creamy blended mango with vanilla ice cream.",
  },
];

const categories = [
  {
    id: "burgers",
    title: "Burgers",
    description:
      "Handcrafted patties served with fresh buns and seasonal toppings.",
    icon: <Hamburger className="size-5 text-primary" />,
    items: burgerItems,
  },
  {
    id: "drinks",
    title: "Drinks",
    description: "Chilled beverages to pair with your order.",
    icon: <GlassWater className="size-5 text-primary" />,
    items: drinkItems,
  },
];

export default function MenuPage() {
  return (
    <main
      style={{
        background: `linear-gradient(
      color-mix(in srgb, var(--background) 80%, transparent), 
      color-mix(in srgb, var(--background) 60%, transparent)
    ), url('/images/hero-bg.png') no-repeat left center / cover fixed`,
      }}
      className="px-4 pb-12 pt-32 sm:px-6 lg:px-8"
    >
      <section className="mx-auto mb-14 max-w-6xl">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">
            Menu
          </p>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Browse our full selection
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Choose between signature burgers and refreshingly cold drinks. Tap
            the &quot;Add to cart&quot; button to add it to your cart instantly.
          </p>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-6xl space-y-10">
        {categories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="rounded-[2rem] border border-border bg-card/60 p-6 shadow-sm"
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3 text-2xl font-semibold text-foreground">
                  {category.icon}
                  <span>{category.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {category.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </section>

      <CartSheet />
    </main>
  );
}
