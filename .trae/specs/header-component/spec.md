# Header 组件规范

## 背景

当前项目的 Header 组件是一个占位符，需要实现完整的导航栏功能。

## 目标

实现一个符合 Terminal CLI 设计系统的 Header 组件，包含 Logo、导航链接和主题切换功能。

## 变更内容

### 1. Header 布局

```
┌─────────────────────────────────────────────────────────┐
│  AI-Era_█                   HOME  CHALLENGES  DOCS  ABOUT  ☀ │
└─────────────────────────────────────────────────────────┘
```

- 高度: 60px
- 定位: sticky top-0
- 层级: z-index 足够高，不被其他模块遮挡
- 背景: 半透明 + backdrop-filter: blur(12px)
- 下边框: 1px solid，颜色跟随设计系统 border token

### 2. Logo

- 文字：`AI-Era`
- 紧跟一个持续闪烁的 `_` 光标
- 闪烁使用设计系统的 `animate-blink` 动效类

### 3. 导航链接

| 显示文字 | 跳转路由 |
|----------|---------|
| Home | `/` |
| Challenges | `/challenges` |
| Docs | `/docs` |
| About | `/about` |

交互状态：
- 默认：次要文字颜色（`muted-foreground`）
- Hover：主色（`primary`），文字前后加方括号，例如 `[ Challenges ]`
- 当前页高亮：背景填充主色，文字用主色前景色

### 4. 主题切换按钮

- 当前为深色模式时显示 `☀`，点击切换为浅色
- 当前为浅色模式时显示 `☾`，点击切换为深色

切换逻辑：
1. 切换 `document.documentElement` 的 `dark` class
2. 写入 `localStorage.setItem('theme', 'dark' | 'light')`

初始化逻辑（在 `layout.tsx` 的防闪烁脚本中已处理，Header 组件只需读取当前状态）：
- 读取 `localStorage.getItem('theme')`
- 若无记录，跟随 `window.matchMedia('(prefers-color-scheme: dark)')`

## 影响范围

### 受影响的文件

- `components/layout/Header.tsx` - 替换为完整实现

## 新增需求

### 需求: Header 导航栏

系统应提供固定在顶部的导航栏

#### 场景: 页面滚动
- **当** 用户滚动页面时
- **然后** Header 始终固定在顶部可见

#### 场景: Logo 动画
- **当** 用户访问页面
- **然后** Logo "AI-Era" 后的 "_" 持续闪烁

#### 场景: 导航链接
- **当** 用户点击导航链接
- **然后** 正确跳转到对应路由

#### 场景: 链接 Hover 效果
- **当** 鼠标悬停在导航链接上
- **然后** 链接文字前后显示方括号效果

#### 场景: 当前页高亮
- **当** 用户处于某个页面
- **然后** 对应导航链接显示高亮状态

### 需求: 主题切换

系统应提供深色/浅色主题切换功能

#### 场景: 切换主题
- **当** 用户点击主题切换按钮
- **然后** 页面主题在深色和浅色之间切换
- **然后** 主题状态保存到 localStorage

#### 场景: 刷新页面
- **当** 用户刷新页面
- **然后** 主题状态从 localStorage 恢复

## 实施计划

1. 读取现有 Header.tsx 和 layout.tsx 了解当前结构
2. 实现 Header 组件完整功能
3. 验证所有验收标准
