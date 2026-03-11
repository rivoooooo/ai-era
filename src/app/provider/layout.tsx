"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { providerConfig } from "./config";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface ProviderLayoutProps {
  children: ReactNode;
}

export default function ProviderLayout({ children }: ProviderLayoutProps) {
  const pathname = usePathname();

  const { isProviderPage, title, description } = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "provider" && segments[1]) {
      const provider = segments[1];
      const slug = segments[2] || "";
      const config = providerConfig[provider];

      if (config) {
        const pageConfig = config.pages[slug] || null;
        return {
          isProviderPage: true,
          title: pageConfig?.title || config.title,
          description: pageConfig?.description || `Configure ${config.title} API`,
        };
      }
    }
    return {
      isProviderPage: false,
      title: "",
      description: "",
    };
  }, [pathname]);

  const handleGoBack = () => {
    window.history.back();
  };

  if (!isProviderPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="scanlines" />
      <nav className="sticky top-0 p-2 left-0 right-0 z-50 bg-[#0a0a0a] border-b border-[#1f521f]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              type="button"
              className="flex items-center gap-2 text-sm text-[#33ff00] hover:text-glow transition-all px-2 py-1 border border-transparent hover:border-[#33ff00] cursor-pointer"
            >
              &lt; BACK
            </button>

            <h1 className="text-sm md:text-base font-bold text-glow truncate max-w-[200px] md:max-w-none">
              {title}
            </h1>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-[#33ff00] hover:text-glow transition-all px-2 py-1 border border-transparent hover:border-[#33ff00]"
              >
                HOME
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-4">
        <div className="max-w-4xl mx-auto ">
          <div className="card-terminal mb-6">
            <div className="card-terminal-header">
              +-- {title.toUpperCase()} --+
            </div>
            <div className="">
              <p className="text-sm opacity-60">$ {description}</p>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
