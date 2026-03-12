export const languageSwitcherTranslations = {
  zh: {
    currentLanguage: "中文",
    switchTo: {
      zh: "中文",
      en: "English",
      ja: "日本語"
    }
  },
  en: {
    currentLanguage: "English",
    switchTo: {
      zh: "中文",
      en: "English",
      ja: "日本語"
    }
  },
  ja: {
    currentLanguage: "日本語",
    switchTo: {
      zh: "中文",
      en: "English",
      ja: "日本語"
    }
  }
} as const;

export type Locale = keyof typeof languageSwitcherTranslations;
