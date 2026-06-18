"use client";

import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({
  product,
}: {
  product: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
  };
}) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="order-2 sm:order-1 space-y-4">
            <div>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </div>
            <div className="text-lg font-semibold">
              ₱{product.price.toFixed(2)}
            </div>
          </div>
          {product.image ? (
            <div className="order-1 sm:order-2 flex items-center justify-center">
              <div className="relative h-48 w-full overflow-hidden rounded-3xl bg-muted/70 sm:h-40 sm:w-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" onClick={handleAdd}>
          Add to cart
          <ShoppingCart className="size-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
