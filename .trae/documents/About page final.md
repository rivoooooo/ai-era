# About 页面 — 最终设计文档

> 参考来源: Sandro Kozmanishvili 个人页设计语言
> 设计系统: AI-Era Terminal CLI（JetBrains Mono / 零圆角 / CSS 变量）
> 融合策略: 取参考页的空间结构和交互密度，全部用终端语言重新表达

---

## 设计概念

```
参考页的精髓:
  - 上大下小的空间切割（70/30）
  - Canvas 动效作为视觉主体
  - 四角 corner 元素建立空间感
  - 鼠标跟随的实时遥测数据
  - 文字扰码 hover 效果

AI-Era 的翻译:
  - Canvas ASCII 场景 → 终端字符雨 / 系统扫描动效
  - 四角字母导航 → 四角终端状态指示器
  - 遥测数据 → 系统监控面板风格
  - 下方信息栏 → 多列终端信息输出
  - 文字扰码 → 保留，完美契合终端风格
```

---

## 一、整体布局

```
┌─────────────────────────────────────────────────────────────────┐
│  [TL: AI-ERA_]              [TR: v0.1.0]     固定四角元素        │
│                                                                 │
│                                                                 │
│              Canvas 动效区（70vh）                               │
│                                                                 │
│                                                                 │
│  [BL: TBILISI → GLOBAL]     [BR: 遥测数据]                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  信息栏（30vh）                                                  │
│  三列：使命文字 | 链接列表 | 系统状态                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```
body:
  height: 100vh
  overflow: hidden（整页不滚动，像一个终端应用）
  display: flex
  flex-direction: column
```

---

## 二、四角固定元素

### 左上角（TL）

```
AI-ERA_

字体: JetBrains Mono，font-size: 20px，font-weight: 700
颜色: var(--primary)
_ 带 animate-blink 动效
position: fixed，top: 24px，left: 24px
```

### 右上角（TR）

```
v0.1.0
[ACTIVE]

字体: JetBrains Mono，font-size: 11px
v0.1.0: var(--muted-foreground)
[ACTIVE]: var(--success)，dashed border
position: fixed，top: 24px，right: 24px
text-align: right
```

### 左下角（BL）

```
// est. 2024
// open source

字体: JetBrains Mono，font-size: 11px，italic
颜色: var(--muted-foreground)
position: fixed，bottom: calc(30vh + 24px)，left: 24px
```

### 右下角（BR）— 实时遥测

```
RENDER: 0.0ms
X: 0000  Y: 0000
UPTIME: 00:00:00

字体: JetBrains Mono，font-size: 11px
颜色: var(--muted-foreground)
text-align: right
position: fixed，bottom: calc(30vh + 24px)，right: 24px
数字用 <span> 包裹，每帧更新
```

---

## 三、Canvas 动效区

### 容器

```css
#canvas-zone {
  height: 70vh;
  width: 100%;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
  position: relative;
  background: var(--background);
}
```

### Canvas 内容：终端字符场

不用参考页的山脉地形，改为**系统扫描 / 字符矩阵**风格，更符合 Terminal CLI：

```
渲染逻辑:

1. 基础层: 随机字符矩阵（稀疏，opacity 低）
   - 字符集: "01" + 终端符号 "> $ # [ ] / \ | ─ ═ ░ ▒ ▓ █"
   - 密度: 约 20%，随 noise 函数分布

2. 扫描线效果:
   - 一条水平扫描线从上到下循环
   - 扫描线经过时，该行字符短暂变亮（opacity 1）
   - 颜色: var(--primary)（磷光绿）

3. 鼠标扰动（保留参考页的镜头效果）:
   - 鼠标周围 200px 范围内字符被"扰动"
   - 扰动效果: 字符变为 "01" 二进制，颜色变为 primary
   - 距离越近，密度越高

4. 主标题文字叠加:
   - position: absolute，左下角
   - 文字用扰码效果（TextScramble）
```

### Canvas 实现代码结构

```typescript
class TerminalCanvas {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  time: number = 0
  scanY: number = 0

  // 终端字符集
  readonly chars = '01>$#[]|─░▒▓ .,:;'

  render() {
    const start = performance.now()
    // 1. 清空
    // 2. 绘制字符矩阵（noise 分布）
    // 3. 绘制扫描线高亮
    // 4. 绘制鼠标扰动区域
    // 5. 更新遥测数据
    // 更新扫描线位置: this.scanY = (this.scanY + 1) % rowCount
    requestAnimationFrame(() => this.render())
  }
}
```

### 字符颜色规则

```
默认字符:   var(--border)，opacity: 0.4
扫描线行:   var(--primary)，opacity: 0.9
鼠标扰动:   var(--primary)，opacity 随距离线性变化（近=高）
背景:       var(--background)（不清除为黑，跟随主题）
```

### 主标题（canvas 区域左下）

```
position: absolute
bottom: 32px
left: 32px

内容:
  We are building the training ground
  developers actually need.

  // Exploring the delta between learning and doing.

样式:
  主文字: font-size: clamp(28px, 4vw, 48px)，font-weight: 700
         color: var(--foreground)，line-height: 1.2
         hover 触发 TextScramble 扰码效果

  注释行: font-size: 12px，color: var(--muted-foreground)，italic
         font-family: JetBrains Mono

  两行之间: margin-top: 12px
```

---

## 四、信息栏（下方 30vh）

### 容器

```css
#panel-zone {
  height: 30vh;
  padding: 24px 32px;
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr;
  gap: 48px;
  border-top: 1px solid var(--border);
  background: var(--background);
  align-content: start;
}
```

### 第一列：使命文字

```
┌──────────────────────────────────────────────────┐
│  YourName                        [timestamp]     │
│  ──────────────────────────────────────────      │
│                                                  │
│  Multidisciplinary developer building the        │
│  platform I wish existed when I started.         │
│  Focusing on real challenges, AI workflows,      │
│  and developer education that actually works.    │
│                                                  │
│  // Currently: building AI-Era                   │
└──────────────────────────────────────────────────┘
```

**样式：**

```
名字行:
  display: flex，justify-content: space-between
  名字: foreground，font-size: 12px，font-weight: 700
  时间戳: muted-foreground，font-size: 11px，font-family: mono
          实时更新（setInterval 1s）

分隔线: 1px solid var(--border)，margin: 8px 0

正文:
  font-size: 13px，color: var(--foreground)，line-height: 1.8
  hover 时字体切换为 monospace + opacity: 0.7
  （参考原页面的 scramble-body 效果）

注释行:
  color: muted-foreground，font-size: 11px，italic，margin-top: 12px
```

### 第二列：链接列表

```
┌──────────────────────────┐
│  > Email                 │
│  > GitHub                │
│  > Twitter               │
│  > Discord               │
│                          │
│  ──────────────────────  │
│  Built with:             │
│  Next.js · Drizzle       │
│  Better Auth · bun       │
└──────────────────────────┘
```

**链接样式（升级参考页的下划线动效）：**

```css
.link-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--foreground);
  text-decoration: none;
  padding: 4px 0;
  position: relative;
  width: fit-content;
}

/* ">" 前缀，hover 时出现 */
.link-item::before {
  content: '>';
  color: var(--primary);
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 150ms, transform 150ms;
}

.link-item:hover::before {
  opacity: 1;
  transform: translateX(0);
}

/* 下划线从右向左消失，从左向右出现 */
.link-item::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 1px;
  background: var(--primary);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 400ms cubic-bezier(0.19, 1, 0.22, 1);
}

.link-item:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

**Built with 区块：**

```
分隔线: 1px dashed var(--border)，margin-top: 16px，padding-top: 12px
"Built with:": muted-foreground，font-size: 10px，uppercase，letter-spacing: 0.1em
技术列表: muted-foreground，font-size: 11px，line-height: 1.8
```

### 第三列：系统状态

```
┌──────────────────────────────┐
│  © 2024                      │
│                              │
│  SYSTEM STATUS               │
│  ──────────────────────────  │
│  version:     v0.1.0         │
│  modules:     6              │
│  challenges:  180            │
│  status:      [OK]           │
│                              │
│  RENDER: 0.0ms               │
│  X: 0000  Y: 0000            │
└──────────────────────────────┘
```

**样式：**

```
justify-content: space-between，text-align: right

© 2024: muted-foreground，font-size: 11px

SYSTEM STATUS 标题: muted-foreground，font-size: 10px，uppercase，letter-spacing: 0.1em
键值对: font-size: 11px，muted-foreground
[OK]: success 颜色

遥测数据:
  font-family: JetBrains Mono
  font-size: 10px
  color: muted-foreground
  margin-top: auto
  实时更新（mousemove + render loop）
```

---

## 五、自定义光标

参考原页面，实现终端风格的双层光标：

```tsx
// components/ui/TerminalCursor.tsx
'use client'
import { useEffect, useRef } from 'react'

export function TerminalCursor() {
  const dotRef     = useRef<HTMLDivElement>(null)
  const outlineRef = useRef<HTMLDivElement>(null)
  const pos        = useRef({ x: 0, y: 0 })
  const smooth     = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top  = `${e.clientY}px`
      }
    }

    const loop = () => {
      smooth.current.x += (pos.current.x - smooth.current.x) * 0.12
      smooth.current.y += (pos.current.y - smooth.current.y) * 0.12
      if (outlineRef.current) {
        outlineRef.current.style.left = `${smooth.current.x}px`
        outlineRef.current.style.top  = `${smooth.current.y}px`
      }
      requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    loop()
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      {/* 内点：小方块，终端光标风格 */}
      <div ref={dotRef} style={{
        position:      'fixed',
        width:         '6px',
        height:        '6px',
        background:    'var(--primary)',
        pointerEvents: 'none',
        zIndex:        9999,
        transform:     'translate(-50%, -50%)',
        mixBlendMode:  'difference',
      }} />
      {/* 外框：方形轮廓，跟随延迟 */}
      <div ref={outlineRef} style={{
        position:      'fixed',
        width:         '32px',
        height:        '32px',
        border:        '1px solid var(--primary)',
        pointerEvents: 'none',
        zIndex:        9998,
        transform:     'translate(-50%, -50%)',
        opacity:       0.6,
        // 注意：零圆角，不用 border-radius
      }} />
    </>
  )
}
```

**在 About 页面的 layout 或 page.tsx 中挂载：**

```tsx
// 只在 /about 路由启用自定义光标
// layout.tsx 中判断路径，或直接在 page.tsx 顶层渲染
<TerminalCursor />
```

同时在 About 页面容器上加 `cursor: none`，隐藏系统默认光标。

---

## 六、TextScramble 效果

保留参考页的文字扰码，用 TypeScript 重写为 React Hook：

```typescript
// hooks/useTextScramble.ts
import { useCallback, useRef } from 'react'

const CHARS = '!<>-_\\/[]{}—=+*^?#01'

export function useTextScramble() {
  const frameRef = useRef<number>()

  const scramble = useCallback((
    el: HTMLElement,
    originalText: string
  ) => {
    const length = originalText.length
    let frame = 0
    const queue = originalText.split('').map((char, i) => ({
      to:    char,
      start: Math.floor(Math.random() * 20),
      end:   Math.floor(Math.random() * 20) + 20,
      char:  '',
    }))

    const update = () => {
      let output = ''
      let complete = 0

      queue.forEach((item) => {
        if (frame >= item.end) {
          complete++
          output += item.to
        } else if (frame >= item.start) {
          if (!item.char || Math.random() < 0.28) {
            item.char = CHARS[Math.floor(Math.random() * CHARS.length)]
          }
          output += `<span style="opacity:0.4;font-family:monospace">${item.char}</span>`
        } else {
          output += item.to
        }
      })

      el.innerHTML = output
      if (complete < length) {
        frameRef.current = requestAnimationFrame(update)
        frame++
      }
    }

    cancelAnimationFrame(frameRef.current!)
    update()
  }, [])

  return scramble
}
```

**应用到主标题：**

```tsx
// Canvas 区域的主标题
const headlineRef = useRef<HTMLDivElement>(null)
const scramble = useTextScramble()
const originalText = "We are building the training ground\ndevelopers actually need."

<div
  ref={headlineRef}
  onMouseEnter={() => scramble(headlineRef.current!, originalText)}
  style={{ cursor: 'none' }}
>
  {originalText}
</div>
```

---

## 七、页面级 CSS

```css
/* About 页面专属，加在 globals.css 或 about/page.module.css */

/* 隐藏系统光标（仅 about 页） */
.about-page * {
  cursor: none !important;
}

/* 信息栏文字 hover 切换字体（参考原页 scramble-body） */
.bio-text {
  transition: font-family 200ms, opacity 200ms;
}
.bio-text:hover {
  font-family: 'JetBrains Mono', monospace;
  opacity: 0.7;
}

/* 扫描线动效（CSS 层） */
@keyframes scanline {
  from { transform: translateY(-100%); }
  to   { transform: translateY(100vh); }
}

.scanline-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 2px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--primary),
    transparent
  );
  opacity: 0.15;
  animation: scanline 4s linear infinite;
  pointer-events: none;
}
```

---

## 八、组件结构

```
app/[locale]/about/
├── page.tsx                      （'use client'，整页客户端）
├── components/
│   ├── TerminalCanvas.tsx         （Canvas 动效 + 主标题）
│   ├── PanelZone.tsx              （下方三列信息栏）
│   │   ├── BioColumn.tsx          （第一列：使命文字）
│   │   ├── LinksColumn.tsx        （第二列：链接列表）
│   │   └── StatusColumn.tsx       （第三列：系统状态）
│   └── CornerElements.tsx         （四角固定元素）
└── hooks/
    ├── useTextScramble.ts
    ├── useTelemetry.ts            （鼠标坐标 + 渲染时间）
    └── useTerminalCursor.ts
```

**`page.tsx` 是 `'use client'`，因为：**
- Canvas 需要 DOM
- 自定义光标需要 mousemove 事件
- 实时遥测需要 requestAnimationFrame

---

## 九、响应式

```
移动端（< 768px）:
  - 三列信息栏变单列
  - Canvas 区高度降为 55vh，信息栏 45vh
  - 四角元素字号缩小（font-size: 14px）
  - 自定义光标禁用（移动端无 hover）
  - overflow: hidden 在移动端取消（允许信息栏滚动）
```

---

## 十、验收标准

### Canvas 动效
```
□ 字符矩阵在 Canvas 上正确渲染
□ 扫描线从上到下循环，经过时字符变亮
□ 鼠标移入 Canvas 区域，周围字符变为 "01" 并变绿
□ 遥测数据（BR角）实时更新渲染时间和鼠标坐标
□ 主题切换后 Canvas 背景色跟随变化
```

### 光标
```
□ 系统默认光标隐藏
□ 内点（小方块）跟随鼠标精确移动
□ 外框（大方形）有 0.12 插值平滑跟随
□ 移动端不出现自定义光标
```

### 文字效果
```
□ 主标题 hover 触发扰码效果
□ 扰码字符为终端字符集（01[]{}）
□ 第一列 bio 文字 hover 切换为 monospace + opacity 降低
□ 链接 hover 时 ">" 前缀从左侧滑入
□ 链接下划线从右消失 / 从左出现
```

### 信息栏
```
□ 三列布局正确，间距均衡
□ 时间戳实时更新（HH:MM:SS + 时区）
□ 系统状态 [OK] 为 success 颜色
□ 技术栈列表正确显示
□ 版权年份正确
```

### 整体
```
□ 页面不出现滚动条（overflow: hidden）
□ 70/30 分割线（border-bottom）可见
□ 四角元素定位正确
□ 两套主题均正确
□ prefers-reduced-motion：Canvas 动效停止，光标用默认
```