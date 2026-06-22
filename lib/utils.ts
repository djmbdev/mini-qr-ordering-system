import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toPng } from "html-to-image";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: string | Date, withTime = false): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  if (withTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return new Intl.DateTimeFormat("en-PH", options).format(d);
}

export function formatOrderItemsSummary(
  items: { product: { name: string }; quantity: number }[] | undefined,
): string {
  if (!items || items.length === 0) {
    return "—";
  }

  return items
    .map(
      (item) =>
        `${item.product.name} ${item.quantity}pc${item.quantity === 1 ? "" : "s"}`,
    )
    .join(", ");
}

export function trimToDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export async function downloadElementAsImage(
  element: HTMLElement,
  filename: string,
  options?: {
    backgroundColor?: string;
    textColor?: string;
    pixelRatio?: number;
  },
) {
  const textColor = options?.textColor ?? "#000000";

  // Force text color before capturing the image since toPng has no text-color option
  const previousColor = element.style.color;
  element.style.color = textColor;

  try {
    const dataUrl = await toPng(element, {
      backgroundColor: options?.backgroundColor ?? "#ffffff",
      pixelRatio: options?.pixelRatio ?? 2,
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } finally {
    element.style.color = previousColor;
  }
}
export const animateOnce = true;
