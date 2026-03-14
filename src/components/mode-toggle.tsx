"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Monitor, Moon, Sun } from "lucide-react";
import { ClientOnly } from "@/components/ClientOnly";

function ModeToggleContent() {
  const { setTheme } = useTheme();
  const t = useTranslations("theme");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="relative">
            <Sun
              data-icon="inline-start"
              className="absolute inset-0 m-auto size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
              data-icon="inline-start"
              className="absolute inset-0 m-auto size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span className="sr-only">{t("toggle")}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun data-icon="inline-start" className="size-4" />
          {t("light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon data-icon="inline-start" className="size-4" />
          {t("dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor data-icon="inline-start" className="size-4" />
          {t("system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ModeToggle() {
  const t = useTranslations("theme");
  
  return (
    <ClientOnly fallback={
      <Button variant="ghost" size="icon" className="relative">
        <Sun className="absolute inset-0 m-auto size-4" />
        <span className="sr-only">{t("toggle")}</span>
      </Button>
    }>
      <ModeToggleContent />
    </ClientOnly>
  );
}
