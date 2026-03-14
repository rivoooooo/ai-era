# Challenges 地图页重构 - 技术规格文档

## 1. 项目概述

### 1.1 目标
将现有的挑战列表页面重构为交互式技能地图（Skill Map），使用 React Flow 实现可视化节点图，展示挑战之间的依赖关系和学习路径。

### 1.2 设计方向
**Terminal CLI 风格** - 延续项目现有的终端命令行界面美学：
- 等宽字体（JetBrains Mono）
- 高对比度配色（深色/浅色双主题）
- 无圆角设计
- 发光效果和扫描线纹理
- 像素级精确的边框和间距

### 1.3 技术栈
| 职责 | 库 | 版本 |
|------|-----|------|
| 地图画布 / 节点 / 连线 / 拖拽缩放 | `@xyflow/react` | latest |
| 节点飞出动效 / 成就横幅 | `motion` (Framer Motion v11) | latest |
| 自动图布局（计算节点坐标） | `dagre` | latest |
| 数据获取 | Next.js Server Component + Drizzle ORM | 已有 |
| 客户端状态 | React `useState` / `useReducer` | 内置 |

---

## 2. 架构设计

### 2.1 文件结构

```
src/app/[locale]/(main)/challenge/
├── page.tsx                          # Server Component，获取数据
├── ChallengesMapWrapper.tsx          # next/dynamic 包裹，禁用 SSR
├── ChallengesMap.tsx                 # 'use client'，React Flow 主画布
├── nodes/
│   └── ChallengeNode.tsx            # 自定义节点组件
├── components/
│   ├── ChallengeDetailCard.tsx      # 悬浮详情卡片（右上角）
│   ├── AchievementBanner.tsx        # 成就解锁横幅（顶部）
│   ├── ProgressPanel.tsx            # 进度面板（左下角，仅登录后）
│   ├── MapControls.tsx              # 地图控制器（右下角）
│   └── FilterToolbar.tsx            # 过滤工具栏（悬浮）
└── lib/
    ├── buildMapData.ts              # challenges → RF nodes + edges
    └── layoutWithDagre.ts           # dagre 自动布局
```

### 2.2 数据流

```
page.tsx (Server)
    ↓
[获取 categories, challenges, user, userProgress]
    ↓
ChallengesMapWrapper (Client, dynamic no SSR)
    ↓
ChallengesMap (React Flow Provider)
    ↓
[buildMapData] → nodes + edges
    ↓
ReactFlow 渲染画布
    ↓
用户交互 → 状态更新 → 局部重渲染
```

---

## 3. 组件规格

### 3.1 page.tsx - Server Component

**职责**: 服务端数据获取，渲染包裹层

**输入**:
- `params.locale` - 当前语言

**数据获取**:
```typescript
const [categories, challenges, user] = await Promise.all([
  getCategories(),
  getChallenges(),
  getCurrentUser(),
])

const userProgress = user ? await getUserProgress(user.id) : null
```

**输出**: 渲染 `ChallengesMapWrapper`

---

### 3.2 ChallengesMapWrapper.tsx

**职责**: 禁用 SSR 的动态导入包裹层

**实现**:
```typescript
const ChallengesMap = dynamic(() => import('./ChallengesMap'), {
  ssr: false,
  loading: () => <MapLoadingSkeleton />,
})
```

**加载骨架屏**:
- 终端风格文本: `> loading skill map...█`
- 光标闪烁动画

---

### 3.3 ChallengesMap.tsx

**职责**: React Flow 主画布，状态管理

**状态**:
| 状态 | 类型 | 说明 |
|------|------|------|
| `filter` | `{category, difficulty, search}` | 过滤条件 |
| `selectedChallenge` | `Challenge \| null` | 当前选中挑战 |
| `selectedNodeRect` | `DOMRect \| null` | 选中节点位置（飞出动效用） |
| `achievement` | `{name, xp} \| null` | 成就横幅数据 |

**React Flow 配置**:
```typescript
{
  panOnDrag: true,
  zoomOnScroll: true,
  zoomOnPinch: true,
  minZoom: 0.3,
  maxZoom: 2.0,
  fitView: true,
  nodesDraggable: false,
  nodesConnectable: false,
}
```

---

### 3.4 ChallengeNode.tsx

**职责**: 自定义节点渲染

**视觉规格**:
- 尺寸: 140px × 72px
- 边框: 根据状态变化
  - `available`: 1px solid var(--border)
  - `in_progress`: 1px dashed var(--primary)
  - `completed`: 2px solid var(--primary) + 发光效果
  - `selected`: 2px solid var(--primary) + outline

**内容布局**:
```
┌─────────────────────────┐
│ [EASY]           [✓]    │  ← 难度 + 状态图标
│                         │
│ Challenge Name Here     │  ← 挑战名（最多2行）
└─────────────────────────┘
```

**难度颜色**:
- easy: var(--success)
- medium: var(--warning)
- hard: var(--destructive)

---

### 3.5 ChallengeDetailCard.tsx

**职责**: 悬浮详情卡片，飞入动画

**动画规格**:
- 初始位置: 从点击节点中心飞出
- 目标位置: 右上角固定 (top: 80px, right: 16px)
- 动画类型: Spring (damping: 22, stiffness: 280)
- 退出动画: scale 0.85 + opacity 0

**内容结构**:
```
+─── CHALLENGE ───+ [×]
─────────────────────────
Challenge Name    [EASY]
─────────────────────────
$ description
Challenge description text here...
─────────────────────────
status: [completed]
─────────────────────────
[ START CHALLENGE → ] [ LOGIN ]
```

**交互**:
- ESC 键关闭
- 点击关闭按钮关闭
- 点击画布空白处关闭

---

### 3.6 AchievementBanner.tsx

**职责**: 成就解锁横幅

**动画**:
- 进入: 从顶部滑入 (y: -100% → 0)
- 退出: 向上滑出
- 自动关闭: 3秒后

**样式**:
- 位置: 顶部居中
- 背景: var(--primary)
- 文字: var(--primary-foreground)
- 字体: JetBrains Mono

---

### 3.7 ProgressPanel.tsx

**职责**: 用户进度面板（仅登录后显示）

**位置**: 左下角固定

**内容**:
```
+─── PROGRESS ───+ [▼]
████████████████░░  12/20  60%
─────────────────────────
easy    ████████░░ 5/10
medium  ████░░░░░░ 2/5
hard    █░░░░░░░░░ 1/5 [✓]
```

**特性**:
- 可折叠/展开
- 进度条使用字符 █ 和 ░ 表示
- 完成分类显示 [✓] 标记

---

### 3.8 MapControls.tsx

**职责**: 地图缩放控制

**位置**: 右下角固定

**按钮** (垂直排列):
| 图标 | 功能 | 提示 |
|------|------|------|
| + | zoomIn | Zoom in |
| ─ | zoomOut | Zoom out |
| ⌂ | reset viewport | Reset view |
| ⊞ | fitView | Fit all |

**交互**:
- hover: 背景变 primary，文字变 primary-foreground
- 点击: 执行对应操作

---

### 3.9 FilterToolbar.tsx

**职责**: 过滤工具栏

**位置**: 画布上方悬浮

**过滤选项**:
- 分类下拉: All + 所有分类
- 难度下拉: All + easy/medium/hard
- 搜索框: 实时搜索挑战名

**样式**:
- 半透明背景 + backdrop blur
- 终端风格边框

---

## 4. 工具函数规格

### 4.1 buildMapData.ts

**输入**:
```typescript
challenges: Challenge[]
categories: Category[]
userProgress: UserProgress[] | null
```

**输出**:
```typescript
{
  nodes: Node<ChallengeNodeData>[],
  edges: Edge[]
}
```

**节点数据结构**:
```typescript
type ChallengeNodeData = {
  challenge: Challenge
  category: Category
  status: 'available' | 'in_progress' | 'completed'
}
```

**连线逻辑**:
- 同分类内按 display_order 顺序连接
- 前置挑战完成 → 实线 + 高亮
- 前置未完成 → 虚线 + 低透明度

### 4.2 layoutWithDagre.ts

**配置**:
```typescript
{
  rankdir: 'LR',    // 从左到右
  nodesep: 48,      // 同列节点间距
  ranksep: 120,     // 列间距
  marginx: 80,
  marginy: 80,
}
```

**节点尺寸**: 140px × 72px

---

## 5. 样式规格

### 5.1 React Flow 样式覆盖

在 `globals.css` 追加:

```css
/* 隐藏默认归因 */
.react-flow__attribution { display: none !important; }

/* 画布背景 */
.react-flow__background { background-color: var(--background) !important; }

/* 节点选中状态去除 RF 默认蓝色轮廓 */
.react-flow__node:focus,
.react-flow__node:focus-visible { outline: none !important; }

/* 边（连线） */
.react-flow__edge-path { marker-end: none; }

/* 选择框 */
.react-flow__selection {
  background: color-mix(in srgb, var(--primary) 10%, transparent);
  border: 1px dashed var(--primary);
}
```

### 5.2 设计系统遵循

- **字体**: JetBrains Mono (所有组件)
- **圆角**: 0px (设计系统规定)
- **边框**: 1px solid var(--border)
- **主题**: 自动适配深色/浅色模式

---

## 6. 性能考虑

### 6.1 优化策略

1. **节点渲染优化**
   - 使用 `memo` 包裹 ChallengeNode
   - 节点数量控制在 50 以内（dagre 布局限制）

2. **动画性能**
   - 使用 CSS transform 和 opacity
   - 避免 layout thrashing

3. **数据获取**
   - Server Component 预取数据
   - 客户端不做额外数据请求

### 6.2 响应式处理

| 断点 | 适配 |
|------|------|
| Desktop (>1024px) | 完整布局 |
| Tablet (768-1024px) | 缩小节点尺寸 |
| Mobile (<768px) | 进度面板默认折叠，简化详情卡片 |

---

## 7. 依赖安装

```bash
bun add @xyflow/react motion dagre
bun add -d @types/dagre
```

---

## 8. 验收标准

### 8.1 功能验收

- [ ] 画布正确渲染，背景为点阵网格
- [ ] 节点按分类从左到右排列（dagre LR 布局）
- [ ] 同分类节点间有连线
- [ ] 已登录：完成的连线变为实线发光
- [ ] 画布可拖拽平移，滚轮/双指缩放
- [ ] 点击节点，详情卡片从节点位置飞出到右上角
- [ ] 点击画布空白处，详情卡片关闭
- [ ] ESC 键关闭详情卡片
- [ ] 进度面板显示正确数据
- [ ] 地图控制器功能正常

### 8.2 样式验收

- [ ] RF 默认蓝色选中轮廓已覆盖
- [ ] RF attribution 已隐藏
- [ ] 所有组件字体为 JetBrains Mono
- [ ] 无任何 border-radius
- [ ] 两套主题（深色/浅色）均正确

### 8.3 性能验收

- [ ] 首屏加载 < 2s
- [ ] 节点交互响应 < 100ms
- [ ] 动画流畅 60fps
