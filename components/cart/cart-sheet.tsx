"use client";

import React, { useRef, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { Plus, Minus, Trash2, ShoppingCart, Download } from "lucide-react";
import {
  downloadElementAsImage,
  formatCurrency,
  formatDate,
} from "@/lib/utils";

type ReceiptItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderApiResponse = {
  orderNumber: number;
};

export default function CartSheet() {
  const { items, itemCount, total, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    items: ReceiptItem[];
    total: number;
  } | null>(null);

  const receiptRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setResult(null);
      setOrderNumber(null);
      setReceiptData(null);
    }
  };

  const submitOrder = async () => {
    setProcessing(true);
    setResult(null);

    // Capture cart contents before clearing, so the receipt still has something to show
    const snapshotItems: ReceiptItem[] = items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
    const snapshotTotal = total;

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

      const order: OrderApiResponse = await response.json();

      setOrderNumber(order.orderNumber);
      setReceiptData({ items: snapshotItems, total: snapshotTotal });
      setResult("success");
      clearCart();
    } catch (error) {
      console.error("Order submission failed", error);
      setResult("failure");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current || orderNumber === null) return;

    setDownloading(true);
    try {
      await downloadElementAsImage(
        receiptRef.current,
        `order-${orderNumber}-receipt.png`,
      );
    } catch (error) {
      console.error("Receipt download failed", error);
    } finally {
      setDownloading(false);
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
                  {formatCurrency(it.price * it.quantity)}
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
              <div className="font-medium">{formatCurrency(total)}</div>
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

            {result === "success" && orderNumber !== null && receiptData && (
              <div className="mt-3 flex flex-col gap-2">
                <div className="text-sm text-green-600">
                  Order placed successfully.
                </div>

                <div ref={receiptRef} className="rounded-lg border p-4 text-sm">
                  <div className="text-base font-bold mb-1">Order Receipt</div>
                  <div className="font-medium">Order #: {orderNumber}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {formatDate(new Date(), true)}
                  </div>
                  <hr className="border-t border-gray-300" />
                  {receiptData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1">
                      <span>
                        {item.name} x {item.quantity}
                        <span className="block text-xs text-muted-foreground">
                          {formatCurrency(item.price)} each
                        </span>
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <hr className="border-t-2 border-gray-900" />
                  <div className="flex justify-between font-bold pt-1.5">
                    <span>Total</span>
                    <span>{formatCurrency(receiptData.total)}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadReceipt}
                  disabled={downloading}
                  className="self-start"
                >
                  <Download className="size-4 mr-2" />
                  {downloading ? "Downloading..." : "Download Receipt"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Note: Please download this receipt to keep track of your
                  order.
                </p>
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

