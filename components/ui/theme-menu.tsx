"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ThemeOption = "light" | "dark" | "system";
type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link";

export function ThemeMenu({
  className,
  label = "Theme",
  variant = "ghost",
  showIcon = true,
}: {
  className?: string;
  label?: string;
  variant?: ButtonVariant;
  showIcon?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  if (!mounted) {
    return null;
  }

  const current = (
    theme === "system" ? "system" : (theme ?? "light")
  ) as ThemeOption;

  const handleThemeChange = (value: ThemeOption) => () => setTheme(value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={cn(
            className,
            "active:translate-y-0 inline-flex items-center gap-2",
          )}
          aria-label="Select theme"
        >
          {showIcon && <Settings className="size-4" />}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          checked={current === "light"}
          onSelect={handleThemeChange("light")}
        >
          Light
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={current === "dark"}
          onSelect={handleThemeChange("dark")}
        >
          Dark
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={current === "system"}
          onSelect={handleThemeChange("system")}
        >
          System
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
