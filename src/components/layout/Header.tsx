"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X, Terminal } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/mode-toggle";
import { AuthSection } from "@/components/auth/AuthSection";
import { useCommandPalette } from "@/components/ui/command";

interface NavItem {
  href: string;
  label: string;
}

export function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const { setOpen } = useCommandPalette();

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

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
        <div className="flex items-center h-full">
          {/* Logo - Left */}
          <div className="flex-1">
            <Link
              href={`/${locale}`}
              className="text-sm font-bold tracking-wider text-glow hover:opacity-80 transition-opacity"
            >
              AI-Era<span className="animate-blink">_</span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex flex-auto justify-center items-center gap-1">
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

          {/* Language Switcher, Theme Toggle, Auth Section & Mobile Menu Button - Right */}
          <div className="flex-1 flex items-center justify-end">
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm hover:text-primary transition-colors cursor-pointer"
                aria-label="Open command palette"
              >
                <span className="text-muted-foreground font-medium">{isMac ? "Cmd" : "Ctrl"}</span>
                <span className="text-muted-foreground/50 font-bold">+</span>
                <span className="text-muted-foreground font-medium">K</span>
                <Terminal className="w-5 h-5" />
              </button>
              <LanguageSwitcher />
              <ModeToggle />
              <AuthSection />
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
                <button
                  type="button"
                  onClick={() => {
                    setOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center w-8 h-8 text-sm hover:text-primary transition-colors"
                  aria-label="Open command palette"
                >
                  <Terminal className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <LanguageSwitcher />
                </div>
                <ModeToggle />
                <AuthSection />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
