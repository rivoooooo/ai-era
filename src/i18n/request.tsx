import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  
  if (!locale || !['zh', 'en'].includes(locale)) {
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