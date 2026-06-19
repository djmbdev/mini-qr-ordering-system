"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, GlassWater, Hamburger, XCircle } from "lucide-react";
import { motion, type Variants } from "motion/react";
import CartSheet from "@/components/cart/cart-sheet";
import ProductCard from "@/components/cart/product-card";
import { animateOnce } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface RawProduct {
  id: string;
  name: string;
  description: string;
  price: number | string;
  imageUrl: string;
  category: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

interface GroupedCategory extends Category {
  items: Product[];
}

const categories: Category[] = [
  {
    id: "burgers",
    title: "Burgers",
    description:
      "Handcrafted patties served with fresh buns and seasonal toppings.",
    icon: <Hamburger className="size-5 text-primary" />,
  },
  {
    id: "drinks",
    title: "Drinks",
    description: "Chilled beverages to pair with your order.",
    icon: <GlassWater className="size-5 text-primary" />,
  },
];

const introVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const categorySectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.3 },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.5,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function MenuPage() {
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>(
    [],
  );
  const isMobile = useIsMobile();

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");

        const products: RawProduct[] = await res.json();
        if (!isMounted) return;

        const grouped: GroupedCategory[] = categories.map(
          (category: Category): GroupedCategory => ({
            ...category,
            items: products
              .filter((product: RawProduct) => product.category === category.id)
              .map(
                (product: RawProduct): Product => ({
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: Number(product.price),
                  image: product.imageUrl,
                }),
              ),
          }),
        );

        setGroupedCategories(grouped);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main
      style={{
        background: `linear-gradient(
          color-mix(in srgb, var(--background) 85%, transparent), 
          color-mix(in srgb, var(--background) 60%, transparent)
        ), url('/images/hero-bg.png') no-repeat left center / cover fixed`,
      }}
      className="px-4 pb-12 pt-32 sm:px-6 lg:px-8 min-h-screen max-sm:bg-none! max-sm:bg-scroll!"
    >
      <section className="mx-auto mb-14 max-w-6xl">
        <motion.div
          className="space-y-3 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: animateOnce, amount: 0.3 }}
          variants={introVariants}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary">
            Menu
          </p>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Browse our full selection
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Choose between signature burgers and refreshingly cold drinks,
            paired perfectly for every craving. Order now!
          </p>
        </motion.div>
      </section>
      <section id="menu" className="mx-auto max-w-6xl space-y-10">
        {groupedCategories.length > 0 &&
          groupedCategories.map((category: GroupedCategory) => (
            <motion.section
              key={category.id}
              id={category.id}
              className="rounded-[2rem] border border-border bg-card/60 p-6 shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: animateOnce, amount: isMobile ? 0 : 0.2 }}
              variants={categorySectionVariants}
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

              <motion.div
                className="grid gap-4 sm:grid-cols-2"
                variants={containerVariants}
              >
                {category.items.map((product: Product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          ))}
      </section>
      <CartSheet />
      <Toaster
        position={isMobile ? "top-center" : "bottom-left"}
        icons={{
          success: <CheckCircle2 className="size-4 text-green-500" />,
          error: <XCircle className="size-4 text-red-500" />,
        }}
      />
    </main>
  );
}
