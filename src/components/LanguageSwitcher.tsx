"use client";

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { ClientOnly } from './ClientOnly';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const t = useTranslations('language');
  
  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(zh|en|ja)/, '');
    window.location.assign(`/${newLocale}${pathWithoutLocale || '/'}`);
  };

  const languages = [
    { code: 'zh', name: t('zh') },
    { code: 'en', name: t('en') },
    { code: 'ja', name: t('ja') }
  ];

  return (
    <ClientOnly fallback={<Button variant="ghost" size="icon" className="relative"><Globe className="absolute inset-0 m-auto size-4" /><span className="sr-only">{t('switch')}</span></Button>}>
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" size="icon" className="relative">
            <Globe className="absolute inset-0 m-auto size-4" />
            <span className="sr-only">{t('switch')}</span>
          </Button>
        } />
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ClientOnly>
  );
}
