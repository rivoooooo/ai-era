import Link from "next/link";

export default function GooglePage() {
  return (
    <>
      <div className="card-terminal mb-6">
        <div className="card-terminal-header">
          +-- AVAILABLE MODELS --+
        </div>
        <div className="p-4 text-sm">
          <Link
            href="/provider/google/gemini-2.5-flash"
            className="block p-3 border border-[#1f521f] hover:border-[#33ff00] transition-colors mb-2 cursor-pointer"
          >
            <span className="text-glow">&gt; gemini-2.5-flash</span>
            <span className="block text-xs opacity-60">$ Fast Response</span>
          </Link>
        </div>
      </div>

      <div className="card-terminal">
        <div className="card-terminal-header">
          +-- SETTINGS --+
        </div>
        <div className="p-4 text-sm">
          <Link
            href="/provider/google/settings"
            className="block p-3 border border-[#1f521f] hover:border-[#33ff00] transition-colors cursor-pointer"
          >
            <span className="text-glow">&gt; API Configuration</span>
            <span className="block text-xs opacity-60">$ Configure Google AI API</span>
          </Link>
        </div>
      </div>
    </>
  );
}
