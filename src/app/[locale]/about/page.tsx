import { getTranslations } from 'next-intl/server';
import { SyncedTypewriter } from '@/components/SyncedTypewriter';

const ASCII_LOGO = `
  :%@@:.#@@@@@@@@@@= 
  .*@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  -@@@@@:.#@@@@@@@@@@= 
  .*@@@* .#@@@@@@@@@%: 
    .... .#@@@@@@@@@+: 
  :%@@@@:.#@@@@@@@@=  
  -@@@@@:.#@@@@@@*: 
  -@@@@@:.#@@@#-`;

export default async function AboutPage() {
  const t = await getTranslations('about');

  const infoItems = [
    { label: t('project'), value: t('name') },
    { label: t('version'), value: t('versionNumber') },
    { label: t('description'), value: t('descriptionContent') },
  ];

  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-7xl">
        <SyncedTypewriter 
          logoLines={ASCII_LOGO.split('\n')}
          infoItems={infoItems}
          logoDelay={50}
          textDelay={100}
        />
      </div>
    </div>
  );
}
