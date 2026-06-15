"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
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

  const simulatePayment = async () => {
    setProcessing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 800));
    const success = Math.random() > 0.25;
    if (success) {
      setResult("success");
      clearCart();
    } else {
      setResult("failure");
    }
    setProcessing(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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

      <SheetContent side="right">
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
                onClick={simulatePayment}
                disabled={items.length === 0 || processing}
                className="flex-1"
              >
                {processing ? "Processing..." : "Complete Order"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Close
              </Button>
            </div>

            {result === "success" && (
              <div className="mt-3 text-sm text-green-600">
                Payment successful — order placed.
              </div>
            )}
            {result === "failure" && (
              <div className="mt-3 text-sm text-red-600">
                Payment failed — please try again.
              </div>
            )}
          </div>
        </div>

        <SheetFooter>
          <div className="text-xs text-muted-foreground">
            This is a mock payment flow for demo purposes.
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
