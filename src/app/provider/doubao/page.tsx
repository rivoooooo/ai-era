import Link from "next/link";

export default function DoubaoPage() {
  return (
    <>
      <div className="card-terminal mb-6">
        <div className="card-terminal-header">
          +-- AVAILABLE MODELS --+
        </div>
        <div className="p-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Link
              href="#"
              className="block p-3 border border-[#1f521f] hover:border-[#33ff00] transition-colors cursor-pointer"
            >
              <span className="text-glow">&gt; doubao-pro</span>
              <span className="block text-xs opacity-60">$ 专业模型</span>
            </Link>
            <Link
              href="#"
              className="block p-3 border border-[#1f521f] hover:border-[#33ff00] transition-colors cursor-pointer"
            >
              <span className="text-glow">&gt; doubao-lite</span>
              <span className="block text-xs opacity-60">$ 轻量模型</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="card-terminal">
        <div className="card-terminal-header">
          +-- SETTINGS --+
        </div>
        <div className="p-4 text-sm">
          <Link
            href="/provider/doubao/settings"
            className="block p-3 border border-[#1f521f] hover:border-[#33ff00] transition-colors cursor-pointer"
          >
            <span className="text-glow">&gt; API Configuration</span>
            <span className="block text-xs opacity-60">$ 配置 Doubao API</span>
          </Link>
        </div>
      </div>
    </>
  );
}
