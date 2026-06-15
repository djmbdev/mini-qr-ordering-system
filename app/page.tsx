"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeMenu } from "@/components/ui/theme-button";

export default function HomePage() {
  return (
    <main
      style={{
        background: `linear-gradient(to right, transparent 10%, color-mix(in srgb, var(--background) 60%, transparent) 70%), url('/images/hero-bg.png') no-repeat left center / cover fixed`,
      }}
      className="min-h-dvh grid place-items-center px-4 py-6"
    >
      <section className="grid max-w-6xl w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div />

        <div className="flex h-full flex-col justify-center gap-8 rounded-[2rem] border border-border bg-card/60 p-10 shadow-xl shadow-slate-900/5">
          <div className="space-y-2">
            <p className="text-md font-bold tracking-[0.35em] text-primary">
              DJMBurgers
            </p>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Scan, order, and enjoy.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Fast table-side ordering with a QR menu that opens instantly.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-border bg-background/95 p-6">
            <div className="rounded-3xl bg-primary/10 p-4 text-center">
              <p className="font-semibold text-primary">Open the menu</p>
              <p className="text-sm text-muted-foreground">
                Scan the QR code below from your device.
              </p>
            </div>

            <div
              className="rounded-[2rem] border border-border bg-white p-6 shadow-sm dark:bg-slate-950 flex items-center justify-center"
              style={{ width: 200, height: 200 }}
            >
              <span className="text-4xl font-bold text-foreground">QR</span>
            </div>

            <Button asChild>
              <a href="/menu" className="inline-flex items-center gap-2">
                Go to menu
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <ThemeMenu
        className="fixed bottom-6 right-6 z-50 focus-visible:ring-0"
        variant="outline"
      />
    </main>
  );
}
