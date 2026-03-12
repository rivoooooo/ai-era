"use client";

import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { ClientOnly } from './ClientOnly';
import { languageSwitcherTranslations } from '@/i18n/languageSwitcher';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  
  const currentLocale = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/ja') ? 'ja' : 'zh';
  const t = languageSwitcherTranslations[currentLocale];
  
  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(zh|en|ja)/, '');
    window.location.href = `/${newLocale}${pathWithoutLocale || '/'}`;
  };

  const languages = [
    { code: 'zh', name: languageSwitcherTranslations.zh.switchTo.zh },
    { code: 'en', name: languageSwitcherTranslations.zh.switchTo.en },
    { code: 'ja', name: languageSwitcherTranslations.zh.switchTo.ja }
  ];

  return (
    <ClientOnly fallback={<span className={`flex items-center gap-1 text-xs opacity-70 ${className}`}><Globe size={14} /></span>}>
      <DropdownMenu>
        <DropdownMenuTrigger className={`flex items-center gap-1 text-xs hover:text-glow transition-all opacity-70 hover:opacity-100 cursor-pointer outline-none ${className}`}>
          <Globe size={14} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#0a0a0a] border border-[#1f521f] text-[#33ff00] min-w-[100px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="text-xs hover:bg-[#1f521f] cursor-pointer focus:bg-[#1f521f] focus:text-[#33ff00]"
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ClientOnly>
  );
}