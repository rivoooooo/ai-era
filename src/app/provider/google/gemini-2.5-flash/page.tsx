export default function Gemini25FlashPage() {
  return (
    <>
      <div className="card-terminal">
        <div className="card-terminal-header">
          +-- INPUT --+
        </div>
        <div className="p-4">
          <label className="block text-xs mb-2 opacity-60">
            user@api-test:~$
          </label>
          <textarea
            placeholder="Enter your prompt..."
            className="w-full bg-transparent border border-[#1f521f] p-3 text-sm focus:border-[#33ff00] focus:outline-none resize-none"
            rows={4}
          />
          <button className="btn-terminal mt-4">
            [ SEND ]
          </button>
        </div>
      </div>

      <div className="card-terminal">
        <div className="card-terminal-header">
          +-- OUTPUT --+
        </div>
        <div className="p-4">
          <pre className="whitespace-pre-wrap text-sm font-mono text-glow opacity-60">
            [WAITING FOR INPUT...]
          </pre>
        </div>
      </div>
    </>
  );
}
