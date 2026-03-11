import Link from "next/link";

interface Model {
  name: string;
  description: string;
  href: string;
}

interface Provider {
  name: string;
  models: Model[];
  settingsHref: string;
}

function splitIntoColumns<T>(arr: T[], numCols = 3): Array<T[]> {
  const cols: Array<T[]> = Array.from({ length: numCols }, () => []);
  let colIndex = 0;
  arr.forEach((item) => {
    cols[colIndex].push(item);
    if (colIndex < numCols - 1) {
      colIndex++;
    } else {
      colIndex = 0;
    }
  });
  return cols;
}

const providers: Provider[] = [
  {
    name: "Google",
    models: [
      { name: "gemini-2.5-flash", description: "快速响应", href: "/provider/google/gemini-2.5-flash" },
      { name: "gemini-3-pro", description: "高级模型", href: "/provider/google/gemini-3-pro" },
      { name: "gemini-2.0-flash", description: "均衡选择", href: "/provider/google/gemini-2.0-flash" },
    ],
    settingsHref: "/provider/google/settings",
  },
  {
    name: "Z AI",
    models: [
      { name: "z-ai-max", description: "旗舰模型", href: "/provider/z/z-ai-max" },
      { name: "z-ai-pro", description: "专业模型", href: "/provider/z/z-ai-pro" },
    ],
    settingsHref: "/provider/z/settings",
  },
  {
    name: "Doubao",
    models: [
      { name: "doubao-pro", description: "专业模型", href: "/provider/doubao/doubao-pro" },
      { name: "doubao-lite", description: "轻量模型", href: "/provider/doubao/doubao-lite" },
    ],
    settingsHref: "/provider/doubao/settings",
  },
  {
    name: "OpenAI",
    models: [
      { name: "gpt-5.3", description: "最新模型", href: "/provider/openai/gpt-5.3" },
    ],
    settingsHref: "/provider/openai/settings",
  },
  {
    name: "Dreamina",
    models: [
      { name: "image-4.5", description: "图像模型", href: "/provider/dreamina/image-4.5" },
      { name: "image-5.0-lite", description: "轻量图像", href: "/provider/dreamina/image-5.0-lite" },
    ],
    settingsHref: "/provider/dreamina/settings",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="scanlines" />
      
      <nav className="border-b border-[#1f521f] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="text-sm font-bold tracking-wider text-glow">
              &gt; API TERMINAL_
            </Link>
            <div className="flex items-center gap-6 text-xs">
              <Link href="/" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [HOME]
              </Link>
              <Link href="/provider/google" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [GOOGLE]
              </Link>
              <Link href="/provider/z" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [Z AI]
              </Link>
              <Link href="/provider/doubao" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [DOUBÃO]
              </Link>
              <Link href="/provider/openai" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [OPENAI]
              </Link>
              <Link href="/provider/dreamina" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [DREAMINA]
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-glow mb-4 md:mb-6 tracking-tight">
            &gt; AI ERA_
            <span className="animate-blink text-2xl md:text-3xl">█</span>
          </h1>
          <p className="text-sm md:text-base opacity-60 max-w-2xl mx-auto mb-6">
            {`$ curl -X POST /api/test --data '{"provider": "google", "model": "gemini-2.0-flash"'}_`}
          </p>
          <p className="text-xs md:text-sm opacity-40 max-w-xl mx-auto">
            统一的 AI API 测试平台 / Unified AI API Testing Platform
          </p>
        </div>

        {(() => {
          const columns = splitIntoColumns(providers, 3);
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {columns.map((col, colIndex) => (
                <div key={colIndex} className="grid gap-y-4">
                  {col.map((provider) => (
                    <div key={provider.name} className="card-terminal">
                      <div className="card-terminal-header flex justify-between items-center">
                        <span>+-- {provider.name.toUpperCase()} --+</span>
                        <Link 
                          href={provider.settingsHref} 
                          className="text-[10px] hover:text-glow transition-all opacity-60 hover:opacity-100"
                        >
                          [SETTINGS]
                        </Link>
                      </div>
                      <div className="flex flex-col">
                        {provider.models.map((model) => (
                          <Link
                            key={model.name}
                            href={model.href}
                            className="w-full py-2 px-4 hover:bg-[#1f521f] hover:text-[#33ff00] focus:bg-[#1f521f] focus:text-[#33ff00] transition-all duration-150 group text-left block outline-none"
                          >
                            <span className="text-sm font-bold">
                              &gt; {model.name}
                            </span>
                            <span className="text-xs opacity-60 ml-2">
                              $ {model.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="text-xs opacity-40 mt-2">
                        [{provider.models.length} MODULES LOADED]
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })()}

        <div className="card-terminal mt-8">
          <div className="card-terminal-header">
            +-- SYSTEM STATUS --+
          </div>
          <div className="p-4 text-sm font-mono">
            <div className="flex justify-between mb-1">
              <span>PROVIDERS:</span>
              <span>[OK] {providers.length}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>MODELS:</span>
              <span>[OK] {providers.reduce((acc, p) => acc + p.models.length, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>STATUS:</span>
              <span>[READY]</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs opacity-40">
          &gt; root@api-test:~# _
          <span className="animate-blink">█</span>
        </div>
      </div>
    </main>
  );
}
