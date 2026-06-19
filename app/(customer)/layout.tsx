import { Hamburger } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { ThemeMenu } from "@/components/ui/theme-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React from "react";
import { CartProvider } from "@/providers/cart-provider";
import { Footer } from "@/components/ui/footer";

const navItems = [
  {
    name: "DJMBurgers",
    link: "#",
    leftIcon: <Hamburger className="size-5" />,
    rightIcon: <Hamburger className="size-5" />,
    linkClassName:
      "bg-primary text-primary-foreground shadow-sm px-4 py-2 text-lg font-semibold cursor-default",
  },
];

function MenuCategoryDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="px-3 focus-visible:ring-0">
          <span>Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href="#burgers">Burgers</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="#drinks">Drinks</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar
        navItems={navItems}
        leftContent={<MenuCategoryDropdown />}
        actions={
          <ThemeMenu
            className="border-none focus-visible:ring-0"
            showIcon={false}
          />
        }
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}
