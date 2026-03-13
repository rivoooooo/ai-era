# i18n 翻译执行文档

> 项目已集成 next-intl，本文档指导 AI 助手如何正确添加、维护和使用翻译内容。
> 不需要修改任何 i18n 配置，只需按照规范操作翻译文件和组件。

---

## 项目 i18n 现状

```
框架:     next-intl
语言:     en（英文，主语言）/ zh（中文）
路由:     /{locale}/...，locale 由 URL 前缀决定
消息文件: src/messages/
```

---

## 一、文件结构规范

### 消息文件位置

```
src/messages/
├── en.json    ← 英文（主语言，所有 key 必须在这里先定义）
└── zh.json    ← 中文（与 en.json 结构完全一致）
```

### JSON 结构规范

按页面 / 模块分层，不允许把所有 key 都堆在顶层：

```json
// en.json 结构示例
{
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "retry": "Retry"
  },
  "header": {
    "nav": {
      "home": "Home",
      "challenges": "Challenges",
      "docs": "Docs",
      "about": "About"
    },
    "themeToggle": {
      "toDark": "Switch to dark mode",
      "toLight": "Switch to light mode"
    }
  },
  "hero": {
    "h1": "AI-Era — Gamified Web Developer Training: Frontend Challenges & AI Coding",
    "seoText": "AI-Era is a gamified platform for training real web developer skills in the age of AI.",
    "cta": {
      "start": "Start Challenges",
      "explore": "Explore Modules"
    },
    "terminal": {
      "booting": "booting developer training system...",
      "checkFrontend": "frontend challenge engine",
      "checkAI": "ai-assisted coding",
      "checkDebug": "debugging arena",
      "checkSkill": "skill progression",
      "online": "system online"
    }
  },
  "intro": {
    "sectionTitle": "Platform Features",
    "card1": {
      "title": "Real Frontend Challenges",
      "desc": "Practice building real UI components and fixing real bugs. No toy examples."
    },
    "card2": {
      "title": "AI-Assisted Development",
      "desc": "Learn how to collaborate with AI tools instead of fighting them. The future workflow."
    },
    "card3": {
      "title": "Debugging Skills",
      "desc": "Train your ability to read and repair broken production code. Ship with confidence."
    }
  },
  "terminal": {
    "sectionTitle": "Interactive Terminal",
    "placeholder": "type a command or click below",
    "connected": "AI-Era connected.",
    "commands": {
      "help": "help",
      "start": "start",
      "daily": "daily",
      "run": "run",
      "modules": "modules",
      "sandbox": "sandbox",
      "rank": "rank",
      "clear": "clear"
    },
    "output": {
      "helpTitle": "available commands:",
      "startLoading": "loading challenge list...",
      "startRedirect": "redirecting to /challenges",
      "dailyTitle": "--- DAILY MISSION ---",
      "dailyRun": "type \"run\" to execute",
      "modulesTitle": "available modules:",
      "sandboxOpening": "opening playground...",
      "sandboxRedirect": "redirecting to /playground",
      "rankTitle": "top developers:",
      "notFound": "command not found:",
      "notFoundHint": "type \"help\" for available commands",
      "noMission": "no active mission",
      "noMissionHint": "type \"daily\" first"
    }
  },
  "modules": {
    "sectionTitle": "ls -la /modules/",
    "total": "{count} directories, {total} challenges total",
    "items": {
      "ui": {
        "name": "ui_engineering",
        "keywords": "react · layout · animation"
      },
      "js": {
        "name": "javascript_core",
        "keywords": "async · closures · ES2024"
      },
      "ai": {
        "name": "ai_integration",
        "keywords": "prompts · api · llm"
      },
      "debug": {
        "name": "debugging",
        "keywords": "traces · console · fixes"
      },
      "perf": {
        "name": "performance",
        "keywords": "rendering · bundle · profiling"
      },
      "system": {
        "name": "system_design",
        "keywords": "architecture · patterns · scale"
      }
    }
  },
  "daily": {
    "sectionTitle": "DAILY MISSION",
    "broadcast": "MISSION BROADCAST",
    "active": "ACTIVE",
    "expires": "expires",
    "challengeId": "challenge_id:",
    "status": "status:",
    "difficulty": "difficulty",
    "time": "time",
    "xp": "xp",
    "skills": "skills:",
    "execute": "EXECUTE",
    "difficultyLevels": {
      "easy": "EASY",
      "intermediate": "INTERMEDIATE",
      "hard": "HARD"
    }
  },
  "activity": {
    "sectionTitle": "tail -f /var/log/activity.log",
    "live": "LIVE",
    "liveStats": "LIVE STATS",
    "topToday": "TOP TODAY",
    "stats": {
      "online": "online:",
      "solving": "solving:",
      "today": "today:",
      "streak": "streak:"
    },
    "streakUnit": "days",
    "actions": {
      "solved": "solved challenge #{n}",
      "started": "started challenge #{n}",
      "reachedLevel": "reached level {l}",
      "completedModule": "completed {m} module",
      "earnedBadge": "earned {b} badge",
      "submitted": "submitted pull request",
      "fixedBug": "fixed a production bug",
      "deployed": "deployed to staging",
      "passed": "passed all test cases",
      "unlocked": "unlocked new module",
      "streak": "completed daily streak",
      "joined": "joined the platform"
    }
  },
  "footer": {
    "systemStatus": "system.status",
    "version": "version:",
    "modules": "modules:",
    "challenges": "challenges:",
    "uptime": "uptime:",
    "uptimeValue": "42 days",
    "status": "status:",
    "statusValue": "all systems operational",
    "quickCommands": "QUICK COMMANDS",
    "typeToInteract": "type to interact",
    "links": {
      "privacy": "Privacy",
      "terms": "Terms",
      "github": "GitHub",
      "twitter": "Twitter"
    },
    "copyright": "© {year} AI-Era. All rights reserved."
  }
}
```

对应的 `zh.json` 结构完全相同，只替换值：

```json
// zh.json 示例（结构与 en.json 完全一致）
{
  "common": {
    "loading": "加载中...",
    "error": "出现了一些错误",
    "retry": "重试"
  },
  "header": {
    "nav": {
      "home": "首页",
      "challenges": "挑战",
      "docs": "文档",
      "about": "关于"
    },
    "themeToggle": {
      "toDark": "切换到深色模式",
      "toLight": "切换到浅色模式"
    }
  },
  "hero": {
    "h1": "AI-Era — 游戏化的前端开发者训练平台：前端挑战与 AI 编码",
    "seoText": "AI-Era 是一个游戏化的平台，在 AI 时代训练真实的 Web 开发者技能。",
    "cta": {
      "start": "开始挑战",
      "explore": "探索模块"
    },
    "terminal": {
      "booting": "正在启动开发者训练系统...",
      "checkFrontend": "前端挑战引擎",
      "checkAI": "AI 辅助编码模块",
      "checkDebug": "调试竞技场",
      "checkSkill": "技能进阶追踪器",
      "online": "系统已上线"
    }
  }
}
```

> ⚠️ `zh.json` 的 **key 结构必须和 `en.json` 完全一致**，不能多也不能少。

---

## 二、在组件中使用翻译

### 服务端组件（Server Component）

```tsx
import { getTranslations } from 'next-intl/server'

export default async function Header() {
  const t = await getTranslations('header')

  return (
    <nav>
      <a href="/">{t('nav.home')}</a>
      <a href="/challenges">{t('nav.challenges')}</a>
    </nav>
  )
}
```

### 客户端组件（Client Component）

```tsx
'use client'
import { useTranslations } from 'next-intl'

export function HeroTerminal() {
  const t = useTranslations('hero.terminal')

  const lines = [
    `> AI-Era_`,
    '',
    t('booting'),
    '',
    `[✓] ${t('checkFrontend')}`,
    `[✓] ${t('checkAI')}`,
    `[✓] ${t('checkDebug')}`,
    `[✓] ${t('checkSkill')}`,
    '',
    t('online'),
  ]

  return <TypeWriter lines={lines} />
}
```

### 带参数的翻译

```tsx
// en.json: "total": "{count} directories, {total} challenges total"
// zh.json: "total": "{count} 个目录，共 {total} 个挑战"

t('modules.total', { count: 6, total: 180 })
```

### 获取当前语言

```tsx
import { useLocale } from 'next-intl'

export function LanguageSwitcher() {
  const locale = useLocale() // 'en' | 'zh'
}
```

---

## 三、终端命令输出的翻译策略

终端命令的输出内容（`commandParser.ts`）需要特殊处理，因为它是纯函数，不能直接使用 hooks。

### 方案：把翻译文本作为参数传入

```typescript
// lib/commandParser.ts — 纯函数，接收翻译后的文本
export type CommandMessages = {
  helpTitle: string
  startLoading: string
  startRedirect: string
  dailyTitle: string
  // ... 其他输出文本
}

export function parseCommand(
  cmd: string,
  ctx: { dailyShown: boolean },
  messages: CommandMessages   // ← 翻译文本从外部传入
): CommandResult {
  // ...
}
```

```tsx
// InteractiveTerminal.tsx — 在组件中获取翻译，传给 parser
'use client'
import { useTranslations } from 'next-intl'
import { parseCommand } from '@/lib/commandParser'

export function InteractiveTerminal() {
  const t = useTranslations('terminal.output')

  const messages = {
    helpTitle:     t('helpTitle'),
    startLoading:  t('startLoading'),
    startRedirect: t('startRedirect'),
    // ... 其他字段
  }

  function handleCommand(cmd: string) {
    const result = parseCommand(cmd, { dailyShown }, messages)
    // ...
  }
}
```

---

## 四、语言切换组件

### 实现

```tsx
// components/ui/LocaleSwitcher.tsx
'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: 'en' | 'zh') {
    // 替换 URL 中的 locale 前缀
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <button onClick={() => switchLocale(locale === 'en' ? 'zh' : 'en')}>
      {locale === 'en' ? '中文' : 'EN'}
    </button>
  )
}
```

### 在 Header 中引用

```tsx
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher'

// Header 右侧：导航链接 + LocaleSwitcher + ThemeToggle
```

---

## 五、新增翻译 key 的操作流程

每次新增翻译内容，必须按以下顺序操作：

```
步骤 1: 在 en.json 中添加新 key 和英文值
步骤 2: 在 zh.json 中添加相同 key 和中文值
步骤 3: 在组件中用 t('your.new.key') 调用
步骤 4: 检查：zh.json 的 key 路径与 en.json 完全一致
```

### 检查两个文件是否同步

如果不确定两个文件是否同步，运行以下检查脚本（放在项目根目录）：

```typescript
// scripts/check-i18n.ts
import en from './src/messages/en.json'
import zh from './src/messages/zh.json'

function getKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null
      ? getKeys(v, `${prefix}${k}.`)
      : [`${prefix}${k}`]
  )
}

const enKeys = new Set(getKeys(en))
const zhKeys = new Set(getKeys(zh))

const missingInZh = [...enKeys].filter(k => !zhKeys.has(k))
const missingInEn = [...zhKeys].filter(k => !enKeys.has(k))

if (missingInZh.length) console.log('Missing in zh.json:', missingInZh)
if (missingInEn.length) console.log('Missing in en.json:', missingInEn)
if (!missingInZh.length && !missingInEn.length) console.log('✓ All keys in sync')
```

运行：`bun run scripts/check-i18n.ts`

---

## 六、首页所有需要翻译的文本清单

以下是首页各模块需要翻译的完整文本，对应上方 JSON 结构中的 key。

### Header
```
header.nav.home
header.nav.challenges
header.nav.docs
header.nav.about
header.themeToggle.toDark
header.themeToggle.toLight
```

### Hero
```
hero.h1
hero.seoText
hero.cta.start
hero.cta.explore
hero.terminal.booting
hero.terminal.checkFrontend
hero.terminal.checkAI
hero.terminal.checkDebug
hero.terminal.checkSkill
hero.terminal.online
```

### Interactive Terminal
```
terminal.sectionTitle
terminal.placeholder
terminal.connected
terminal.output.helpTitle
terminal.output.startLoading
terminal.output.startRedirect
terminal.output.dailyTitle
terminal.output.dailyRun
terminal.output.modulesTitle
terminal.output.sandboxOpening
terminal.output.sandboxRedirect
terminal.output.rankTitle
terminal.output.notFound
terminal.output.notFoundHint
terminal.output.noMission
terminal.output.noMissionHint
```

### Intro Section
```
intro.sectionTitle
intro.card1.title
intro.card1.desc
intro.card2.title
intro.card2.desc
intro.card3.title
intro.card3.desc
```

### Modules
```
modules.sectionTitle
modules.total
modules.items.ui.name
modules.items.ui.keywords
（其余 5 个模块同上）
```

### Daily Challenge
```
daily.sectionTitle
daily.broadcast
daily.active
daily.expires
daily.challengeId
daily.status
daily.difficulty
daily.time
daily.xp
daily.skills
daily.execute
daily.difficultyLevels.easy
daily.difficultyLevels.intermediate
daily.difficultyLevels.hard
```

### Activity Feed
```
activity.sectionTitle
activity.live
activity.liveStats
activity.topToday
activity.stats.online
activity.stats.solving
activity.stats.today
activity.stats.streak
activity.streakUnit
activity.actions.*（12 条动作文本）
```

### Footer
```
footer.systemStatus
footer.version
footer.modules
footer.challenges
footer.uptime
footer.uptimeValue
footer.status
footer.statusValue
footer.quickCommands
footer.typeToInteract
footer.links.privacy
footer.links.terms
footer.links.github
footer.links.twitter
footer.copyright
```

---

## 七、注意事项

```
✅  en.json 永远是 source of truth，先改英文再改中文
✅  所有文字内容通过 t() 调用，不允许在组件中硬编码中英文字符串
✅  终端风格的 ASCII 符号（> / [ ] / ─ / █ 等）不需要翻译，直接写在组件里
✅  路由路径（/challenges, /challenge/104 等）不需要翻译
✅  数据文件（daily.json, modules.json）中的内容如需多语言，
    改为 daily.en.json + daily.zh.json，组件根据 locale 动态 import

❌  不允许 key 只存在于一个语言文件中
❌  不允许在 zh.json 中使用英文值作为占位（除非该内容确实不需要翻译）
❌  不允许把动态拼接字符串当翻译（应使用 t('key', { param }) 插值）
```

---

## 八、验收标准

```
□ en.json 和 zh.json 的 key 结构完全一致（运行 check-i18n.ts 无报错）
□ 切换语言后首页所有可见文字正确切换
□ 终端打字动效内容随语言切换正确变化
□ 命令输出文字（help / daily / modules 等）随语言切换正确变化
□ 带参数的翻译（total, copyright, actions）插值正确
□ 组件中无任何硬编码中文或英文用户可见字符串
□ LocaleSwitcher 组件正常切换，URL locale 前缀随之变化
□ 刷新页面后语言保持（由 URL 决定，不依赖 localStorage）
```
