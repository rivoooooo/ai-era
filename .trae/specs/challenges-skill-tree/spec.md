# Challenges Skill Tree - 技能树地图风格

## 变更概述

将当前 CHALLENGES 页面从分组卡片网格替换为可交互的技能解锁地图，节点是挑战，连线表示依赖关系，完成后节点发光亮起。

## 设计方向

采用 **Terminal CLI 风格 + RPG 技能树** 的混合美学：
- 背景：点阵网格图案（radial-gradient dots）
- 节点：终端风格卡片，带发光边框
- 连线：SVG 贝塞尔曲线，激活时高亮
- 动效：脉冲光晕 + 依次淡入 + 路径描边动画

## 影响范围

- **涉及文件**:
  - `src/app/[locale]/(main)/challenge/page.tsx` - 主页面
  - `src/server/lib/db/queries.ts` - 数据查询（需扩展支持依赖关系）
  - `src/app/globals.css` - 样式扩展
  - 新增组件: `ChallengeNode.tsx`, `SkillTreeCanvas.tsx`, `NodeDetailPanel.tsx`, `ProgressWidget.tsx`, `FilterToolbar.tsx`

## 功能需求

### 1. 画布容器
- 横向滚动容器，宽度超出视口
- 固定高度：桌面端 600px，移动端 400px
- 背景叠加点阵网格图案：`radial-gradient(circle, var(--border) 1px, transparent 1px)`，网格大小 32px

### 2. 节点系统 (ChallengeNode)

**节点尺寸**: 120px × 80px

**节点状态**:

| 状态 | 边框 | 背景 | 文字 | 图标 | 动效 |
|------|------|------|------|------|------|
| locked | 1px dashed border | card opacity: 0.4 | muted-foreground | 🔒 / [X] | 无 |
| available | 1px solid primary | card | foreground | - | 脉冲光晕 2s infinite |
| completed | 2px solid primary | primary/15 | primary font-bold | [✓] | 发光 |
| selected | 2px solid primary | primary/25 | - | - | outline offset |

**难度标签颜色**:
- EASY: var(--success)
- MEDIUM: var(--warning)
- HARD: var(--chart-3 / destructive)
- EXPERT: var(--error)

### 3. 连线系统 (SVG Connections)

使用 SVG `<path>` 渲染贝塞尔曲线：
- 起点：节点右侧中点 (x1+120, y1+40)
- 终点：节点左侧中点 (x2, y2+40)

**连线状态**:
- 未激活：stroke: border, dashed 4 4, opacity 0.5
- 激活：stroke: primary, width 1.5, opacity 0.8
- 完成：stroke: primary, width 2, drop-shadow glow

### 4. 节点布局

按分类分列（从左到右），列内按难度排序（EASY 在上）:
- COL_WIDTH: 200px
- ROW_HEIGHT: 120px
- PADDING: 60px

### 5. 分类标题

每列顶部显示分类名，样式：
- 颜色：primary
- 字号：12px uppercase font-bold
- 下方：1px solid primary 分隔线，宽度与节点同宽

### 6. 底部详情栏 (NodeDetailPanel)

**默认状态**:
```
> hover or click a node to view details
```

**展开状态**:
```
> challenge-name                    [DIFFICULTY]
$ description

prerequisites: challenge-1, challenge-2
unlocks: challenge-3, challenge-4

status: [AVAILABLE]

[START CHALLENGE]      [VIEW DETAILS]
```

展开动画：height 从 48px 展开到 auto，duration 200ms ease-out

### 7. 过滤工具栏 (FilterToolbar)

位置：页面标题下方，画布上方

```
category: [ ALL ▾ ]   difficulty: [ ALL ▾ ]   status: [ ALL ▾ ]   > search_
```

- 过滤时：不匹配节点 opacity: 0.2（不隐藏）
- 搜索时：不匹配节点 opacity: 0.15

### 8. 进度面板 (ProgressWidget)

画布右上角 fixed 定位：

```
┌─────────────────┐
│  PROGRESS       │
│  ─────────────  │
│  3 / 12  25%    │
│  ██░░░░░░░░░░   │
│                 │
│  EASY    2/4    │
│  MEDIUM  1/6    │
│  HARD    0/2    │
└─────────────────┘
```

- 进度条：字符 █ / ░，长度 12 格
- 可折叠（点击标题收起）
- 未登录时数字显示 "--"

### 9. 动效汇总

| 触发 | 动效 |
|------|------|
| 页面加载 | 节点从左到右依次淡入，delay = colIndex × 80ms |
| available 节点 | 脉冲光晕 2s infinite |
| completed 节点 | 爆发光效 box-shadow 0→20px→0，600ms |
| 连线激活 | stroke-dashoffset 描边动画 400ms |
| 节点 hover | scale(1.05)，100ms |
| 底部栏展开 | height 200ms ease-out |
| 过滤切换 | opacity 150ms |

**prefers-reduced-motion**: 所有动效关闭

### 10. 未登录状态

- 所有节点显示为 available
- 底部栏不显示 prerequisites/unlocks
- 进度面板数字为 "--"
- START CHALLENGE 正常跳转（不强制登录）

## 技术实现

### 数据模型扩展

需要扩展 challenges 表添加依赖关系字段，或创建中间表：

```typescript
// challenge_dependencies 表
challenge_dependencies {
  id: uuid
  challenge_id: uuid (前置挑战)
  depends_on: uuid (依赖的挑战)
}
```

### 组件结构

```
app/[locale]/(main)/challenge/page.tsx
  └── ChallengesPage (Server Component)
      ├── PageHeader
      ├── FilterToolbar (Client)
      ├── SkillTreeCanvas (Client)
      │   ├── svg (连线层 - pointer-events: none)
      │   └── ChallengeNode × n
      ├── NodeDetailPanel (Client)
      └── ProgressWidget (Client)
```

### 响应式设计

- 桌面端：节点 120×80px，画布高度 600px
- 移动端：节点缩小，画布高度 400px，支持手势滚动

## 验收标准

- [ ] 画布以点阵背景渲染，节点和连线正确叠加
- [ ] 节点四种状态（locked/available/completed/selected）视觉正确
- [ ] available 节点持续脉冲光晕
- [ ] completed 节点发光样式正确
- [ ] SVG 连线三种状态（虚线/实线/发光）正确
- [ ] 连线使用贝塞尔曲线，从节点右侧到下一节点左侧
- [ ] 节点按分类分列，从左到右排布
- [ ] 点击节点：节点变为 selected，底部详情栏展开
- [ ] 底部详情栏展开动效流畅
- [ ] 详情栏显示：名称、难度、描述、前置、解锁、状态、按钮
- [ ] START CHALLENGE 按钮跳转正确路由
- [ ] 分类/难度/状态过滤：不匹配节点变暗
- [ ] 搜索：匹配节点正常，不匹配节点变暗
- [ ] 进度面板字符进度条正确
- [ ] 进度面板可折叠
- [ ] 页面加载节点依次淡入
- [ ] 画布可横向滚动
- [ ] prefers-reduced-motion：所有动效关闭
- [ ] 移动端：画布横向滚动，节点尺寸适当缩小
- [ ] 未登录：无 locked 状态，进度显示 "--"
