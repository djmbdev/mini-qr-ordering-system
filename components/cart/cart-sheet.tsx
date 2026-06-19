"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";

export default function CartSheet() {
  const { items, itemCount, total, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Single entry point for open/close so every close path clears the leftover message
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setResult(null);
  };

  const submitOrder = async () => {
    setProcessing(true);
    setResult(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount: total,
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      if (!response.ok) {
        console.error("Order submission failed", response.status);
        setResult("failure");
        return;
      }

      setResult("success");
      clearCart();
    } catch (error) {
      console.error("Order submission failed", error);
      setResult("failure");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <div className="fixed bottom-6 right-6 z-50">
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="default"
            onClick={() => setOpen(true)}
          >
            <ShoppingCart className="size-4 mr-2" />
            Cart ({itemCount})
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>

        <div className="p-4 flex flex-col gap-4">
          {items.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Your cart is empty.
            </div>
          )}

          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between gap-2"
            >
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-muted-foreground">
                  ₱{(it.price * it.quantity).toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => updateQuantity(it.id, it.quantity - 1)}
                >
                  <Minus />
                </Button>
                <div className="w-8 text-center">{it.quantity}</div>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => updateQuantity(it.id, it.quantity + 1)}
                >
                  <Plus />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeFromCart(it.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}

          <div className="mt-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="font-medium">₱{total.toFixed(2)}</div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                onClick={submitOrder}
                disabled={items.length === 0 || processing}
                className="flex-1"
              >
                {processing ? "Processing..." : "Complete Order"}
              </Button>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
            </div>

            {result === "success" && (
              <div className="mt-3 text-sm text-green-600">
                Order placed successfully.
              </div>
            )}
            {/* Test purposes only, order failed limit reached */}
            {result === "failure" && (
              <div className="mt-3 text-sm text-red-600">
                Order failed, limit reached.
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
