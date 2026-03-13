"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/mode-toggle";

interface NavItem {
  href: string;
  label: string;
}

export function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/challenge`, label: t("challenges") },
    { href: `/${locale}/docs`, label: "Docs" },
    { href: `/${locale}/about`, label: t("about") },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === "/" || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full h-[60px]",
        "border-b border-border",
        "bg-background/80 backdrop-blur-[12px]"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="text-sm font-bold tracking-wider text-glow hover:opacity-80 transition-opacity"
          >
            AI-Era<span className="animate-blink">_</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group px-4 py-2 text-xs font-medium transition-all duration-200",
                    "uppercase tracking-wider",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <span className="relative flex items-center">
                    {active && <span className="mr-1">{">"}</span>}
                    <span className={cn(
                      "opacity-0 transition-opacity duration-200",
                      !active && "group-hover:opacity-100"
                    )}>
                      [
                    </span>
                    <span className="mx-0.5">{item.label}</span>
                    <span className={cn(
                      "opacity-0 transition-opacity duration-200",
                      !active && "group-hover:opacity-100"
                    )}>
                      ]
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Language Switcher, Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <div className="hidden md:block">
              <ModeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden flex items-center justify-center w-8 h-8 text-sm hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden absolute top-[60px] left-0 right-0 border-b border-border bg-background/95 backdrop-blur-[12px]">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center px-3 py-2 text-xs font-medium transition-all",
                      "uppercase tracking-wider",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                    )}
                  >
                    <span className="relative flex items-center">
                      {active && <span className="mr-1">{">"}</span>}
                      <span className={cn(
                        "opacity-0 transition-opacity duration-200",
                        !active && "group-hover:opacity-100"
                      )}>
                        [
                      </span>
                      <span className="mx-0.5">{item.label}</span>
                      <span className={cn(
                        "opacity-0 transition-opacity duration-200",
                        !active && "group-hover:opacity-100"
                      )}>
                        ]
                      </span>
                    </span>
                  </Link>
                );
              })}
              <div className="flex items-center gap-4 pt-2 border-t border-border mt-2">
                <div className="flex-1">
                  <LanguageSwitcher />
                </div>
                <ModeToggle />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
