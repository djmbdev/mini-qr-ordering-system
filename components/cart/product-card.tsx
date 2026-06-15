"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium">₱{product.price.toFixed(2)}</div>
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
