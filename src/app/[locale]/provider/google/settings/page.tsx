import Link from "next/link";
import { getTranslations } from 'next-intl/server';

export default async function GoogleSettingsPage() {
  const t = await getTranslations('providerPage');
  const tForm = await getTranslations('form');
  const tCommon = await getTranslations('common');

  return (
    <main className="min-h-screen ">
      <div className="scanlines" />

      <div className="max-w-4xl mx-auto">
        <div className="card-terminal mb-6">
          <div className="card-terminal-header">
            +-- {t('google.settings.title')} --+
          </div>
          <div className="p-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm hover:text-glow transition-all mb-4"
            >
              &lt; {tCommon('back')} TO TERMINAL
            </Link>

            <h1 className="text-xl md:text-2xl font-bold text-glow mb-2">
              &gt; {t('google.settings.title')}_
              <span className="animate-blink">█</span>
            </h1>
            <p className="text-sm opacity-60">
              $ {t('google.settings.description')}
            </p>
          </div>
        </div>

        <div className="card-terminal mb-6">
          <div className="card-terminal-header">
            +-- API KEY CONFIGURATION --+
          </div>
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-xs mb-2 opacity-60">
                user@ai-era-web-dev-skills:~$ GOOGLE_API_KEY
              </label>
              <input
                type="password"
                placeholder={tForm('enterApiKey')}
                className="w-full bg-transparent border border-[#1f521f] p-3 text-sm focus:border-[#33ff00] focus:outline-none"
              />
            </div>
            <button className="btn-terminal">
              [ {tForm('save').toUpperCase()} CONFIG ]
            </button>
          </div>
        </div>

        <div className="card-terminal mb-6">
          <div className="card-terminal-header">
            +-- CURRENT STATUS --+
          </div>
          <div className="p-4 text-sm font-mono">
            <div className="flex justify-between mb-1">
              <span>API KEY:</span>
              <span className="opacity-60">[NOT CONFIGURED]</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>STATUS:</span>
              <span className="opacity-60">[WAITING FOR INPUT]</span>
            </div>
          </div>
        </div>

        <div className="card-terminal">
          <div className="card-terminal-header">
            +-- AVAILABLE MODELS --+
          </div>
          <div className="p-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="p-2 border border-[#1f521f]">
                <span className="text-glow">&gt; gemini-2.5-flash</span>
                <span className="block text-xs opacity-60">$ Fast Response</span>
              </div>
              <div className="p-2 border border-[#1f521f]">
                <span className="text-glow">&gt; gemini-3-pro</span>
                <span className="block text-xs opacity-60">$ Advanced Model</span>
              </div>
              <div className="p-2 border border-[#1f521f]">
                <span className="text-glow">&gt; gemini-2.0-flash</span>
                <span className="block text-xs opacity-60">$ Balanced Option</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}