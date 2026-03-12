import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  
  if (!locale || !['zh', 'en', 'ja'].includes(locale)) {
    return {
      locale: 'zh',
      messages: (await import(`../messages/zh.json`)).default
    };
  }
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
