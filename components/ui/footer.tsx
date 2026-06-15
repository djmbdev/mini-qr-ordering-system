import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/90 px-4 py-8 text-sm text-muted-foreground sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div>
          <p className="font-semibold text-orange-500">DJMBurgers</p>
          <p>Fast pickup and QR-driven ordering for modern guests.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground md:justify-end">
          <span>Email: djmburgers@gmail.com</span>
          <span>Phone: 0991 122 3344</span>
          <span>Open daily 10am–10pm</span>
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-6xl flex justify-center md:hidden">
        <a href="#" className="inline-block">
          <Button variant="outline" size="icon-sm">
            <ArrowUp className="size-4" />
          </Button>
        </a>
      </div>
    </footer>
  );
}
