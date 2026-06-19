import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function downloadSvgAsPng(
  svg: SVGElement,
  filename: string,
  options?: { scale?: number; padding?: number; background?: string },
) {
  const { scale = 4, padding = 16, background = "#ffffff" } = options ?? {};

  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = () => {
    const qrWidth = img.width * scale;
    const qrHeight = img.height * scale;
    const pad = padding * scale;

    canvas.width = qrWidth + pad * 2;
    canvas.height = qrHeight + pad * 2;

    if (ctx) {
      // White or chosen color background, including the quiet-zone border
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, pad, pad, qrWidth, qrHeight);
    }

    URL.revokeObjectURL(url);

    const pngFile = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = filename;
    link.href = pngFile;
    link.click();
  };

  img.src = url;
}

export const animateOnce = true;
