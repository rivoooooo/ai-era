# Hero Section 实现规范

## 背景

当前首页是占位内容，需要实现完整的 Hero Section，包含终端打字动效、SEO 文本和随机 ASCII Art 展示。

## 目标

实现一个符合 Terminal CLI 设计系统的 Hero Section，包含：
- 左侧终端打字输出 + SEO 文本 + CTA 按钮
- 右侧随机 ASCII Art 展示

## 变更内容

### 布局

桌面端左右两栏：
```
┌──────────────────────────┬─────────────────┐
│  终端打字输出 + SEO文本   │   ASCII Art     │
│       (55%)               │     (45%)       │
└──────────────────────────┴─────────────────┘
```

移动端：上下堆叠，终端输出在上，ASCII art 在下。

### 打字动效内容

页面加载后**自动播放**，按顺序逐行输出以下内容：
- `> AI-Era_`
- `booting developer training system...`
- `[✓] frontend challenge engine`
- `[✓] ai-assisted coding`
- `[✓] debugging arena`
- `[✓] skill progression`
- `system online`

**参数**：
- 字符间隔：`30ms`
- 每行之间停顿：`350ms`
- 空行视为停顿 `350ms` 后继续
- 打字完成后，末行追加一个持续闪烁的光标 `█`

### 动效实现要求

- 创建 `hooks/useTypewriter.ts`，接收行数组，返回当前已显示的内容
- 组件卸载时必须清除所有 `setTimeout`（useEffect cleanup）
- 检测 `prefers-reduced-motion`：若用户开启了减少动效，直接显示全部文字，不播放逐字动效

### SEO 文本

打字输出区域下方，`margin-top: 24px`。
内容：`AI-Era is a gamified platform for training real web developer skills in the age of AI.`

### H1 标签

使用 `sr-only` 样式做视觉隐藏：
```html
<h1 className="sr-only">
  AI-Era — Gamified Web Developer Training: Frontend Challenges & AI Coding
</h1>
```

### CTA 按钮

SEO 文本下方，`margin-top: 32px`，两个按钮横排，`gap: 16px`。

| 按钮文字 | 样式 | 跳转路由 |
|----------|------|---------|
| Start Challenges | 主按钮（实心背景） | `/challenges` |
| Explore Modules | 描边按钮（透明背景） | `/challenges |

### ASCII Art

- 使用 `<pre>` 标签
- 颜色跟随主色 `primary`
- 字号 `12px`，`line-height: 1.4`
- 随机选取逻辑：在组件挂载时执行一次

## 影响范围

### 受影响文件
- `src/app/[locale]/(main)/page.tsx` - 替换为 Hero Section 实现

### 新增文件
- `src/lib/hooks/useTypewriter.ts` - 打字机 Hook
- `src/data/ascii.ts` - ASCII Art 数据

## 新增需求

### 需求: 打字机动效

系统应提供逐字符打字输出动效

#### 场景: 页面加载
- **当** 页面加载完成
- **然后** 自动开始播放打字动效

#### 场景: 打字完成
- **当** 所有字符输出完毕
- **然后** 显示持续闪烁的光标

#### 场景: 减少动效偏好
- **当** 用户开启了 `prefers-reduced-motion`
- **然后** 直接显示全部文字，不播放逐字动效

#### 场景: 组件卸载
- **当** 组件卸载时
- **然后** 清除所有定时器，防止内存泄漏

### 需求: 随机 ASCII Art

系统应随机展示不同的 ASCII Art 图案

#### 场景: 页面刷新
- **当** 用户刷新页面
- **然后** 随机更换 ASCII Art 图案

## 实施计划

1. 创建 ASCII 数据文件
2. 创建 useTypewriter Hook
3. 实现 Hero Section 组件
4. 验证所有验收标准
