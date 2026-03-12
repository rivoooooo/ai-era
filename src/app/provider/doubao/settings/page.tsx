import Link from "next/link";

export default function DoubaoSettingsPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="scanlines" />

      <div className="max-w-4xl mx-auto">
        <div className="card-terminal mb-6">
          <div className="card-terminal-header">
            +-- DOUBÃO SETTINGS --+
          </div>
          <div className="p-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm hover:text-glow transition-all mb-4"
            >
              &lt; BACK TO TERMINAL
            </Link>

            <h1 className="text-xl md:text-2xl font-bold text-glow mb-2">
              &gt; DOUBÃO CONFIG_
              <span className="animate-blink">█</span>
            </h1>
            <p className="text-sm opacity-60">
              $ Configure Doubao API Settings
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
                user@ai-era-web-dev-skills:~$ DOUBÃO_API_KEY
              </label>
              <input
                type="password"
                placeholder="Enter your Doubao API Key..."
                className="w-full bg-transparent border border-[#1f521f] p-3 text-sm focus:border-[#33ff00] focus:outline-none"
              />
            </div>
            <button className="btn-terminal">
              [ SAVE CONFIG ]
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
                <span className="text-glow">&gt; doubao-pro</span>
                <span className="block text-xs opacity-60">$ Pro Model</span>
              </div>
              <div className="p-2 border border-[#1f521f]">
                <span className="text-glow">&gt; doubao-lite</span>
                <span className="block text-xs opacity-60">$ Lite Model</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
