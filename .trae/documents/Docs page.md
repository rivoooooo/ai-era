# Docs 页面设计文档 v2（15-50 篇规模）

> 规模：15-50 篇，需要分类导航 + 搜索
> 读者：新用户（引导式）+ 老用户（快速查阅）
> 键盘优先，鼠标可用，终端风格

---

## 设计概念

```
15-50 篇文档的核心挑战:
  - 内容太多，不能只靠命令行导航
  - 分类必要，但不能变成无聊的文档站
  - 新用户需要引导路径，老用户需要快速定位

解法：三层并行导航
  层 1: 左侧目录树（主导航，鼠标 + 键盘）
  层 2: 顶部命令搜索栏（/ 键激活，快速跳转）
  层 3: 文档内右侧目录（H2/H3 锚点，当前文档内导航）

记忆点:
  左侧导航用 tree 命令风格，不是普通的侧边栏
  搜索用命令行 fuzzy find 风格，不是 input + dropdown
  文档正文 Markdown 全套终端风格渲染
```

---

## 路由结构

```
/docs                     → 重定向到 /docs/getting-started
/docs/[slug]              → 文档详情页（主界面）
```

所有页面使用同一个布局，左侧导航 + 右侧内容，无单独首页。
进入 `/docs` 直接展示第一篇文档（getting-started），不做空白首页。

---

## 分类规划（供参考，可根据实际内容调整）

```
GUIDES/               平台使用指南（新用户路径）
  getting-started     快速开始
  account-setup       账号注册与设置
  how-challenges-work 挑战系统介绍
  skill-map-guide     技能地图使用
  daily-missions      每日任务说明
  xp-and-progress     XP 与进度系统
  ai-workflow-tips    AI 协作技巧

CHALLENGES/           挑战相关
  challenge-types     挑战类型说明
  playground-guide    训练场使用
  submitting-code     代码提交
  debugging-tips      调试技巧
  using-hints         使用提示系统

REFERENCE/            技术参考
  keyboard-shortcuts  键盘快捷键
  challenge-format    挑战数据格式
  api-overview        API 概览
  faq                 常见问题
```

---

## 整体布局

```
┌──────────────────────────────────────────────────────────────────┐
│  Header（已有，不动）                                             │
├──────────────────┬──────────────────────────┬────────────────────┤
│                  │                          │                    │
│  左侧目录树      │  文档正文                 │  右侧目录          │
│  260px fixed     │  max-w-2xl centered      │  200px fixed       │
│                  │                          │                    │
│  sticky top      │  Markdown 渲染           │  H2/H3 锚点        │
│                  │                          │  sticky top        │
│                  │                          │                    │
└──────────────────┴──────────────────────────┴────────────────────┘
│  Footer（已有，不动）                                             │
└──────────────────────────────────────────────────────────────────┘
```

三列宽度：`260px + flex-1 + 200px`，总容器 `max-w-7xl mx-auto`。

移动端：左侧收入抽屉（hamburger），右侧目录隐藏，只保留正文。

---

## 一、顶部搜索栏（Command Search）

### 触发方式

```
全局按 / 键  →  搜索覆盖层出现
全局按 Cmd+K →  搜索覆盖层出现（与 Header 的 Cmd+K 联动）
点击 Header 中的 "Cmd + K >_" 按钮 →  同上
```

### 外观

全屏覆盖层，居中面板：

```
┌─── FIND.SH ──────────────────────────────────────────────────────┐
│                                                                  │
│  > find ./docs/ -name "_"                                        │
│             ↑ 实时更新，光标在此                                  │
│  ──────────────────────────────────────────────────────────      │
│                                                                  │
│  GUIDES                                                          │
│  ──────────────────────                                          │
│  ● getting-started          快速开始                              │
│    how-challenges-work      挑战系统介绍                          │
│    skill-map-guide          技能地图使用                          │
│                                                                  │
│  CHALLENGES                                                      │
│  ──────────────────────                                          │
│    playground-guide         训练场使用                            │
│    debugging-tips           调试技巧                              │
│                                                                  │
│  ──────────────────────────────────────────────────────────      │
│  ↑↓ navigate   Enter open   Esc close                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 搜索行为

```
输入时: 实时 fuzzy 匹配文档 title + summary + slug
        不匹配的条目隐藏（不是变暗，直接隐藏）
        分类名若该分类全部隐藏则也隐藏

无输入时: 显示所有文档（按分类分组）
          高亮最近访问的文档（localStorage 记录）

匹配高亮: 匹配字符用 <mark> 包裹
          background: var(--secondary)，color: var(--secondary-foreground)
```

### 键盘交互

```
↑ ↓       在结果间移动（跨分类连续移动）
Enter     打开选中文档，关闭搜索层
Esc       关闭搜索层
Cmd+K     再次按关闭
Tab       选中第一个结果
```

### 选中项样式

```
background: color-mix(in srgb, var(--primary) 10%, transparent)
border-left: 2px solid var(--primary)
"●" 前缀出现，primary 颜色
```

### 覆盖层样式

```
position: fixed，inset: 0
background: var(--background)/85，backdrop-filter: blur(8px)
z-index: 500

面板:
  max-width: 600px，width: 90%
  max-height: 70vh
  overflow-y: auto（结果列表部分）
  background: var(--card)
  border: 1px solid var(--border)
  font-family: JetBrains Mono

进入动效: opacity 0→1，translateY -12px→0，200ms ease-out
```

---

## 二、左侧目录树

### 外观

```
┌─── DOCS ──────────────────────────────┐
│                                       │
│  > tree ./docs/                       │
│                                       │
│  ./docs/                              │
│  ├── GUIDES/                          │
│  │   ├── getting-started        ←当前 │
│  │   ├── account-setup                │
│  │   ├── how-challenges-work          │
│  │   └── skill-map-guide              │
│  │                                    │
│  ├── CHALLENGES/                      │
│  │   ├── challenge-types              │
│  │   ├── playground-guide             │
│  │   └── debugging-tips              │
│  │                                    │
│  └── REFERENCE/                       │
│      ├── keyboard-shortcuts           │
│      ├── api-overview                 │
│      └── faq                         │
│                                       │
│  ─────────────────────────────────    │
│  Press / to search                    │
└───────────────────────────────────────┘
```

### 目录树样式

```
容器:
  width: 260px
  height: calc(100vh - header高度)
  position: sticky，top: header高度
  overflow-y: auto
  border-right: 1px solid var(--border)
  padding: 20px 0

标题栏 "+─── DOCS ───+":
  bg-primary，text-primary-foreground
  padding: 6px 16px，font-size: 10px，font-weight: 700

"> tree ./docs/" 命令行:
  padding: 12px 16px
  color: var(--primary)，font-size: 12px，font-weight: 700

"./docs/" 根路径:
  padding: 0 16px
  color: var(--muted-foreground)，font-size: 11px
```

**分类行（可折叠）：**

```
├── GUIDES/
│
格式: [连接线] [分类名/]
点击: 折叠/展开该分类

连接线 ├── / └──: color: var(--border)，font-size: 12px
分类名: color: var(--primary)，font-weight: 700，font-size: 12px，uppercase
展开状态: 正常显示子项
折叠状态: 子项隐藏，分类名后追加 " [n]"（隐藏文档数）

hover: background: var(--muted)/30，cursor: pointer
折叠图标: ▼ 展开 / ▶ 折叠（在分类名前，secondary 颜色，8px）
```

**文档行：**

```
│   ├── getting-started
│   └── skill-map-guide

格式: [竖线] [空格] [连接线] [文档名]

竖线 │: color: var(--border)
连接线 ├── / └──: color: var(--border)
文档名: color: var(--muted-foreground)，font-size: 12px

当前文档（active）:
  color: var(--foreground)，font-weight: 700
  background: color-mix(in srgb, var(--primary) 8%, transparent)
  border-left: 2px solid var(--primary)（在 padding-left 的位置）

hover（非 active）:
  color: var(--foreground)
  background: var(--muted)/20
  cursor: pointer
  transition: 80ms

focus（键盘）:
  outline: 1px solid var(--primary)
  outline-offset: -1px
```

**底部提示：**

```
border-top: 1px dashed var(--border)
padding: 12px 16px
color: var(--muted-foreground)，font-size: 10px，italic
"Press / to search"
```

### 键盘导航左侧树

```
↑ ↓         在文档间移动（跳过分类标题，只在文档行间移动）
→           展开当前分类（若在分类行上）
←           折叠当前分类
Enter       打开当前选中文档
/           聚焦搜索（离开左侧树，打开搜索覆盖层）
```

---

## 三、文档正文区

### 文档 Frontmatter 展示

正文最顶部，信息条：

```
┌──────────────────────────────────────────────────────────────────┐
│  category: guides  │  read: 5 min  │  updated: 2024-03-01        │
└──────────────────────────────────────────────────────────────────┘
```

```
border: 1px solid var(--border)
border-left: 3px solid var(--primary)
bg: var(--card)
padding: 10px 16px
display: flex，gap: 24px
font-size: 11px
font-family: JetBrains Mono

键名: muted-foreground
键值: foreground，font-weight: 700
"│" 分隔: border 颜色
```

### Markdown 渲染样式

```css
/* 文档内容容器 */
.doc-content {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.85;
  color: var(--foreground);
  max-width: 680px;
}

/* 标题：带 # 前缀 */
.doc-content h1 {
  font-size: 22px; font-weight: 700;
  margin: 40px 0 16px;
  color: var(--foreground);
}
.doc-content h1::before { content: '# '; color: var(--primary); }

.doc-content h2 {
  font-size: 16px; font-weight: 700;
  margin: 32px 0 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
}
.doc-content h2::before { content: '## '; color: var(--primary); }

.doc-content h3 {
  font-size: 14px; font-weight: 700;
  margin: 24px 0 8px;
}
.doc-content h3::before { content: '### '; color: var(--primary); font-size: 12px; }

/* 段落 */
.doc-content p { margin: 12px 0; }

/* 代码块 */
.doc-content pre {
  background:   var(--card);
  border:       1px solid var(--border);
  border-left:  3px solid var(--primary);
  padding:      16px 20px;
  overflow-x:   auto;
  font-size:    13px;
  line-height:  1.7;
  margin:       20px 0;
}
.doc-content pre::before {
  content:     attr(data-lang);  /* 语言标签 */
  display:     block;
  font-size:   10px;
  color:       var(--muted-foreground);
  margin-bottom: 8px;
  text-transform: uppercase;
}

/* 行内代码 */
.doc-content code {
  background: var(--muted);
  color:      var(--primary);
  padding:    2px 6px;
  font-size:  12px;
}

/* 引用块 */
.doc-content blockquote {
  border-left:  3px solid var(--secondary);
  padding:      12px 16px;
  margin:       16px 0;
  background:   color-mix(in srgb, var(--secondary) 5%, transparent);
}
.doc-content blockquote p {
  color:       var(--muted-foreground);
  font-style:  italic;
  margin:      0;
}
.doc-content blockquote::before {
  content: '// NOTE';
  display: block;
  font-size: 10px;
  color: var(--secondary);
  font-weight: 700;
  margin-bottom: 6px;
}

/* 列表 */
.doc-content ul { padding-left: 0; list-style: none; }
.doc-content ul li {
  padding-left: 20px;
  position: relative;
  margin: 6px 0;
}
.doc-content ul li::before {
  content: '>';
  position: absolute;
  left: 0;
  color: var(--primary);
  font-weight: 700;
}

.doc-content ol { padding-left: 0; counter-reset: ol-counter; list-style: none; }
.doc-content ol li {
  padding-left: 28px;
  position: relative;
  margin: 6px 0;
  counter-increment: ol-counter;
}
.doc-content ol li::before {
  content: counter(ol-counter) '.';
  position: absolute;
  left: 0;
  color: var(--primary);
  font-weight: 700;
  font-size: 12px;
}

/* 分隔线 */
.doc-content hr {
  border: none;
  margin: 32px 0;
  color: var(--muted-foreground);
  font-size: 12px;
  text-align: left;
}
.doc-content hr::before {
  content: '────────────────────────────────────────';
  letter-spacing: 2px;
}

/* 表格 */
.doc-content table { width: 100%; border-collapse: collapse; margin: 20px 0; }
.doc-content th {
  text-align: left;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted-foreground);
  border-bottom: 1px solid var(--primary);
  padding: 8px 0;
}
.doc-content td {
  font-size: 13px;
  border-bottom: 1px solid var(--border);
  padding: 10px 0;
}
.doc-content tr:hover td { background: var(--muted)/20; }

/* 链接 */
.doc-content a {
  color: var(--secondary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 150ms;
}
.doc-content a:hover { border-bottom-color: var(--secondary); }

/* 警告/提示块（自定义） */
.doc-content .callout-warning {
  border-left: 3px solid var(--warning);
  background: color-mix(in srgb, var(--warning) 8%, transparent);
  padding: 12px 16px; margin: 16px 0;
}
.doc-content .callout-warning::before {
  content: '[WARN]';
  color: var(--warning); font-weight: 700; font-size: 10px;
  display: block; margin-bottom: 6px;
}
.doc-content .callout-tip {
  border-left: 3px solid var(--success);
  background: color-mix(in srgb, var(--success) 8%, transparent);
  padding: 12px 16px; margin: 16px 0;
}
.doc-content .callout-tip::before {
  content: '[TIP]';
  color: var(--success); font-weight: 700; font-size: 10px;
  display: block; margin-bottom: 6px;
}
```

### 文档底部导航

```
──────────────────────────────────────────────────────────────────

┌─────────────────────────────┐  ┌─────────────────────────────┐
│  ← PREV                     │  │                    NEXT →   │
│                              │  │                             │
│  getting-started             │  │  how-challenges-work        │
└─────────────────────────────┘  └─────────────────────────────┘

  Press [ for prev,  ] for next
```

```
两张卡片，flex justify-between，gap: 16px
border: 1px solid var(--border)，padding: 16px 20px，flex: 1
PREV 卡片: text-align: left
NEXT 卡片: text-align: right
hover: border-color → primary，translateX ±4px
"← PREV" / "NEXT →": muted-foreground，10px，uppercase，display: block
文档名: foreground，13px，font-weight: 700，margin-top: 4px

快捷键提示行:
  text-align: center，font-size: 11px，color: muted-foreground，margin-top: 12px
  "Press [ for prev,  ] for next"
```

---

## 四、右侧文档内目录（TOC）

### 外观

```
┌─── ON THIS PAGE ──────────────────┐
│                                   │
│  ## Introduction                  │
│  ## Prerequisites                 │
│    ### Step 1                     │
│    ### Step 2                     │
│  ## Next Steps                    │
│                                   │
│  ─────────────────────────────    │
│  [ gg top ]  [ G bottom ]        │
└───────────────────────────────────┘
```

```
容器:
  width: 200px
  position: sticky，top: header高度 + 20px
  max-height: calc(100vh - header高度 - 40px)
  overflow-y: auto
  padding: 0 0 0 16px
  border-left: 1px solid var(--border)

标题 "+─── ON THIS PAGE ───+": 同设计系统

TOC 条目:
  H2: font-size: 12px，color: muted-foreground，padding: 4px 8px
  H3: font-size: 11px，color: muted-foreground，padding: 4px 8px 4px 20px（缩进）

  当前可见区域对应的标题（IntersectionObserver 检测）:
    color: primary，font-weight: 700
    border-left: 2px solid primary（在左侧）

  hover: color: foreground，cursor: pointer

点击: 平滑滚动到对应锚点

底部快捷键:
  border-top: 1px dashed border
  padding-top: 10px，margin-top: 10px
  [ gg top ] [ G bottom ] 两个小按钮
  outline 样式，font-size: 10px
```

---

## 五、全局键盘快捷键

所有快捷键在 `/docs` 路由下生效：

| 按键 | 行为 |
|------|------|
| `/` 或 `Cmd+K` | 打开搜索覆盖层 |
| `Esc` | 关闭搜索 / 收起左侧树（移动端） |
| `[` | 上一篇文档 |
| `]` | 下一篇文档 |
| `g g` | 滚动到页面顶部 |
| `G` | 滚动到页面底部 |
| `?` | 打开快捷键帮助 |
| `↑` `↓` | 左侧树 / 搜索结果间移动（需先 focus 在对应区域） |
| `→` | 展开左侧树分类 |
| `←` | 折叠左侧树分类 |

**`g g` 实现：**

```typescript
// 双击 g 检测
let lastG = 0
window.addEventListener('keydown', (e) => {
  if (e.key === 'g' && !isInputFocused()) {
    const now = Date.now()
    if (now - lastG < 500) {  // 500ms 内连按两次
      window.scrollTo({ top: 0, behavior: 'smooth' })
      lastG = 0
    } else {
      lastG = now
    }
  }
  if (e.key === 'G' && !isInputFocused()) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }
})
```

---

## 六、快捷键帮助覆盖层（? 键）

```
┌─── KEYBOARD SHORTCUTS ───────────────────────────────────────────┐
│                                                                  │
│  SEARCH & NAVIGATION                                             │
│  ─────────────────────────────                                   │
│  /  Cmd+K    open search                                         │
│  ↑  ↓        navigate results / tree                            │
│  Enter        open selected                                       │
│  Esc          close / back                                        │
│                                                                  │
│  READING                                                         │
│  ─────────────────────────────                                   │
│  [             previous document                                 │
│  ]             next document                                     │
│  g g           scroll to top                                     │
│  G             scroll to bottom                                  │
│                                                                  │
│  TREE NAVIGATION                                                 │
│  ─────────────────────────────                                   │
│  ↑  ↓          move between docs                                │
│  →             expand category                                   │
│  ←             collapse category                                 │
│                                                                  │
│  press ? or Esc to close                                         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

样式与 About 页面的快捷键覆盖层完全一致（复用 `ShortcutsOverlay` 组件）。

---

## 七、文档数据结构

```typescript
// types/docs.ts

export type DocCategory = 'guides' | 'challenges' | 'reference'

export interface DocMeta {
  slug:      string
  title:     string
  summary:   string
  category:  DocCategory
  readTime:  number
  updatedAt: string
  order:     number      // 分类内排序
}

export interface Doc extends DocMeta {
  content:   string      // Markdown
  headings:  Heading[]   // 提取的 H2/H3，用于 TOC
  prev?:     DocMeta
  next?:     DocMeta
}

export interface Heading {
  id:    string          // anchor id
  text:  string
  level: 2 | 3
}
```

文档存储为 `.md` 文件，frontmatter 格式：

```yaml
---
title: Getting Started
summary: Everything you need to start your first challenge on AI-Era.
category: guides
readTime: 5
updatedAt: "2024-03-01"
order: 1
---
```

**目录结构：**

```
src/docs/
├── guides/
│   ├── getting-started.md
│   ├── account-setup.md
│   ├── how-challenges-work.md
│   └── ...
├── challenges/
│   ├── challenge-types.md
│   └── ...
└── reference/
    ├── keyboard-shortcuts.md
    └── ...
```

---

## 八、组件结构

```
app/[locale]/docs/
├── page.tsx                          → redirect to /docs/getting-started
└── [slug]/
    └── page.tsx                      → Server Component，读取 md 文件

components/docs/
├── DocsLayout.tsx                    → 三列布局容器
├── DocsSidebar.tsx                   → 左侧目录树
│   ├── CategoryGroup.tsx             → 分类行（可折叠）
│   └── DocLink.tsx                   → 文档行（含 active 状态）
├── DocContent.tsx                    → 正文渲染
│   ├── DocFrontmatter.tsx            → 顶部 meta 信息条
│   └── DocPagination.tsx             → 底部上下篇
├── DocToc.tsx                        → 右侧 TOC
├── DocsSearch.tsx                    → 搜索覆盖层
└── ShortcutsOverlay.tsx              → ? 快捷键帮助（复用 About 的）

hooks/
├── useDocsKeyboard.ts                → 统一管理所有键盘快捷键
├── useActiveTocItem.ts               → IntersectionObserver 追踪当前标题
└── useDocsSearch.ts                  → 搜索逻辑 + 结果过滤
```

---

## 九、移动端方案

```
< 768px:
  左侧树: 收起，顶部出现 "DOCS ▼" 按钮，点击展开全屏抽屉
  右侧 TOC: 隐藏
  底部: 固定一条导航条，显示当前文档 + 上下篇箭头

抽屉:
  position: fixed，inset: 0
  background: var(--background)
  z-index: 300
  从左侧滑入（translateX -100% → 0，200ms）
  内容与桌面端左侧树完全一致
  右上角 [ × ] 关闭
```

---

## 十、验收标准

### 搜索
```
□ / 键和 Cmd+K 都能打开搜索层
□ 实时 fuzzy 搜索，无结果时显示提示
□ 匹配字符高亮（mark 标签）
□ ↑↓ 移动，Enter 跳转，Esc 关闭
□ 无内容时显示全部文档列表
```

### 左侧目录树
```
□ tree 命令风格，连接线字符正确
□ 分类可折叠/展开，图标正确
□ 折叠后显示 [n] 隐藏数量
□ 当前文档高亮，border-left primary
□ ↑↓ 在文档间移动，→← 展开/折叠
□ / 键从树中进入搜索
```

### 文档正文
```
□ Frontmatter 信息条样式正确
□ 所有 Markdown 元素按设计系统渲染
□ h1/h2/h3 有 #/##/### 前缀
□ 列表 marker 为 >
□ 代码块 border-left: 3px primary
□ blockquote 有 [WARN]/[TIP] 标识
□ 底部上下篇卡片 [ ] 键可切换
□ "Press [ ] for next/prev" 提示可见
```

### TOC
```
□ 从正文提取 H2/H3
□ 滚动时当前标题高亮（IntersectionObserver）
□ 点击平滑滚动到锚点
□ gg/G 按钮可用
```

### 全局键盘
```
□ [ ] 切换上下篇
□ g g 滚动到顶
□ G 滚动到底
□ ? 打开快捷键帮助
□ 所有快捷键在 input focus 时不触发
```

### 移动端
```
□ 左侧树变为抽屉，按钮可开关
□ 右侧 TOC 隐藏
□ 底部固定导航条显示
□ 触摸滚动正常
```