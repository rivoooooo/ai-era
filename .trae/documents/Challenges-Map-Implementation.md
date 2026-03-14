# Challenges 地图页 — 完整实现文档

> 本文档供 AI 助手直接执行。
>
> ## 执行前必读：Skills
>
> 在开始任何编码之前，**必须先读取以下 skill 文件**，这些文件包含
> 经过验证的最佳实践，直接影响代码质量：
>
> ```
> 必读（按顺序）:
> 1. frontend-design skill
>    → 视觉设计原则，避免通用 AI 审美，动效和排版规范
> ```

> 读完 skill 后再开始编码。

---

## 技术栈

| 职责 | 库 | 版本 | 说明 |
|------|-----|------|------|
| 地图画布 / 节点 / 连线 / 拖拽缩放 | `@xyflow/react` | latest | 核心库 |
| 节点飞出动效 / 成就横幅 | `motion` | latest | 即 Framer Motion v11 |
| 自动图布局（计算节点坐标） | `dagre` | latest | 有向图自动排列 |
| 数据获取 | Next.js Server Component + Drizzle ORM | 已有 | 服务端直接查库 |
| 客户端状态 | React `useState` / `useReducer` | 内置 | 不需要额外状态库 |

### 安装

```bash
bun add @xyflow/react motion dagre
bun add -d @types/dagre
```

---

## 项目文件结构

```
src/app/[locale]/challenge/
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

---

## 一、数据层

### `page.tsx` — Server Component

```tsx
// app/[locale]/challenge/page.tsx
import { getChallenges, getCategories } from '@/server/lib/db/queries'
import { getCurrentUser } from '@/server/lib/auth'        // 获取当前用户
import { getUserProgress } from '@/server/lib/db/queries'  // 用户进度
import { ChallengesMapWrapper } from './ChallengesMapWrapper'

export default async function ChallengePage() {
  const [categories, challenges, user] = await Promise.all([
    getCategories(),
    getChallenges(),
    getCurrentUser(),
  ])

  const userProgress = user
    ? await getUserProgress(user.id)
    : null

  return (
    <ChallengesMapWrapper
      categories={categories}
      challenges={challenges}
      user={user}
      userProgress={userProgress}
    />
  )
}
```

### `ChallengesMapWrapper.tsx` — SSR 禁用包裹层

```tsx
// app/[locale]/challenge/ChallengesMapWrapper.tsx
import dynamic from 'next/dynamic'
import type { Challenge, Category, User, UserProgress } from '@/types'

// React Flow 依赖 DOM API，不能在服务端运行
const ChallengesMap = dynamic(
  () => import('./ChallengesMap'),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />,
  }
)

interface Props {
  categories: Category[]
  challenges: Challenge[]
  user: User | null
  userProgress: UserProgress[] | null
}

export function ChallengesMapWrapper(props: Props) {
  return <ChallengesMap {...props} />
}

function MapLoadingSkeleton() {
  return (
    <div className="w-full h-[calc(100vh-120px)] flex items-center justify-center">
      <span className="text-muted-foreground text-sm font-mono">
        {'> loading skill map...'}
        <span className="animate-blink ml-1">█</span>
      </span>
    </div>
  )
}
```

---

## 二、布局计算

### `lib/layoutWithDagre.ts`

```typescript
import dagre from 'dagre'
import type { Node, Edge } from '@xyflow/react'

const NODE_WIDTH  = 140
const NODE_HEIGHT = 72

export function applyDagreLayout<T>(
  nodes: Node<T>[],
  edges: Edge[]
): Node<T>[] {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir:  'LR',    // 从左到右（基础 → 进阶）
    nodesep:  48,      // 同列节点间距
    ranksep:  120,     // 列间距
    marginx:  80,
    marginy:  80,
  })

  nodes.forEach(n => g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }))
  edges.forEach(e => g.setEdge(e.source, e.target))

  dagre.layout(g)

  return nodes.map(n => {
    const pos = g.node(n.id)
    return {
      ...n,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    }
  })
}
```

### `lib/buildMapData.ts`

```typescript
import type { Node, Edge } from '@xyflow/react'
import type { Challenge, Category, UserProgress } from '@/types'
import { applyDagreLayout } from './layoutWithDagre'

export type NodeStatus = 'available' | 'in_progress' | 'completed'

export type ChallengeNodeData = {
  challenge: Challenge
  category:  Category
  status:    NodeStatus
}

export function buildMapData(
  challenges:   Challenge[],
  categories:   Category[],
  userProgress: UserProgress[] | null
): { nodes: Node<ChallengeNodeData>[]; edges: Edge[] } {

  const categoryMap = new Map(categories.map(c => [c.id, c]))
  const progressMap = new Map(
    (userProgress ?? []).map(p => [p.challengeId, p.status])
  )

  // 构建节点
  const rawNodes: Node<ChallengeNodeData>[] = challenges.map(challenge => ({
    id:       challenge.id,
    type:     'challenge',
    position: { x: 0, y: 0 },         // dagre 会覆盖
    draggable: false,
    selectable: true,
    data: {
      challenge,
      category: categoryMap.get(challenge.categoryId)!,
      status: userProgress
        ? (progressMap.get(challenge.id) as NodeStatus ?? 'available')
        : 'available',                 // 未登录全部 available
    },
  }))

  // 构建连线（同分类内按 display_order 顺序相邻连线）
  const edges: Edge[] = []
  categories.forEach(category => {
    const categoryChals = challenges
      .filter(c => c.categoryId === category.id)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))

    categoryChals.forEach((chal, i) => {
      if (i === 0) return
      const prev = categoryChals[i - 1]
      const isActivated =
        progressMap.get(prev.id) === 'completed'

      edges.push({
        id:     `${prev.id}->${chal.id}`,
        source: prev.id,
        target: chal.id,
        type:   'smoothstep',
        style: {
          stroke:          isActivated ? 'var(--primary)' : 'var(--border)',
          strokeWidth:     isActivated ? 1.5 : 1,
          strokeDasharray: isActivated ? undefined : '6 4',
          opacity:         isActivated ? 0.8 : 0.5,
        },
        animated: false,
      })
    })
  })

  // 应用 dagre 布局
  const nodes = applyDagreLayout(rawNodes, edges)
  return { nodes, edges }
}
```

---

## 三、自定义节点

### `nodes/ChallengeNode.tsx`

```tsx
'use client'
import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { ChallengeNodeData, NodeStatus } from '../lib/buildMapData'

const DIFFICULTY_COLOR: Record<string, string> = {
  easy:   'var(--success)',
  medium: 'var(--warning)',
  hard:   'var(--destructive)',
}

const STATUS_ICON: Record<NodeStatus, string> = {
  available:   '',
  in_progress: '[~]',
  completed:   '[✓]',
}

const STATUS_ICON_COLOR: Record<NodeStatus, string> = {
  available:   '',
  in_progress: 'var(--warning)',
  completed:   'var(--primary)',
}

export const ChallengeNode = memo(function ChallengeNode({
  data,
  selected,
}: NodeProps<ChallengeNodeData>) {
  const { challenge, status } = data
  const isCompleted   = status === 'completed'
  const isInProgress  = status === 'in_progress'

  return (
    <>
      {/* React Flow 连接点（隐形） */}
      <Handle type="target" position={Position.Left}  style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />

      <div
        style={{
          width:      140,
          height:     72,
          padding:    '8px 10px',
          border:     selected
            ? '2px solid var(--primary)'
            : isCompleted
            ? '2px solid var(--primary)'
            : isInProgress
            ? '1px dashed var(--primary)'
            : '1px solid var(--border)',
          background: selected
            ? 'color-mix(in srgb, var(--primary) 25%, var(--card))'
            : isCompleted
            ? 'color-mix(in srgb, var(--primary) 12%, var(--card))'
            : 'var(--card)',
          outline:     selected ? '2px solid var(--primary)' : 'none',
          outlineOffset: selected ? '3px' : '0',
          fontFamily:  'JetBrains Mono, monospace',
          cursor:      'pointer',
          transition:  'border-color 120ms, background 120ms, transform 120ms',
          // 发光效果（完成状态）
          filter: isCompleted
            ? 'drop-shadow(0 0 4px color-mix(in srgb, var(--primary) 50%, transparent))'
            : 'none',
        }}
      >
        {/* 顶部行：难度 + 状态图标 */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   4,
        }}>
          <span style={{
            fontSize:    10,
            color:       DIFFICULTY_COLOR[challenge.difficulty] ?? 'var(--foreground)',
            fontWeight:  700,
            textTransform: 'uppercase',
          }}>
            {challenge.difficulty}
          </span>
          {STATUS_ICON[status] && (
            <span style={{
              fontSize: 10,
              color:    STATUS_ICON_COLOR[status],
              fontWeight: 700,
            }}>
              {STATUS_ICON[status]}
            </span>
          )}
        </div>

        {/* 挑战名 */}
        <div style={{
          fontSize:     11,
          color:        isCompleted ? 'var(--primary)' : 'var(--foreground)',
          fontWeight:   isCompleted ? 700 : 400,
          lineHeight:   1.4,
          overflow:     'hidden',
          display:      '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          wordBreak:    'break-all',
        }}>
          {challenge.name}
        </div>
      </div>
    </>
  )
})
```

---

## 四、主画布

### `ChallengesMap.tsx`

```tsx
'use client'
import { useCallback, useState, useRef } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { buildMapData }        from './lib/buildMapData'
import { ChallengeNode }       from './nodes/ChallengeNode'
import { ChallengeDetailCard } from './components/ChallengeDetailCard'
import { AchievementBanner }   from './components/AchievementBanner'
import { ProgressPanel }       from './components/ProgressPanel'
import { MapControls }         from './components/MapControls'
import { FilterToolbar }       from './components/FilterToolbar'
import type { Challenge, Category, User, UserProgress } from '@/types'

const nodeTypes = { challenge: ChallengeNode }

interface Props {
  categories:   Category[]
  challenges:   Challenge[]
  user:         User | null
  userProgress: UserProgress[] | null
}

// ReactFlowProvider 必须包在外层
export default function ChallengesMap(props: Props) {
  return (
    <ReactFlowProvider>
      <ChallengesMapInner {...props} />
    </ReactFlowProvider>
  )
}

function ChallengesMapInner({
  categories,
  challenges,
  user,
  userProgress,
}: Props) {
  const { fitView, zoomIn, zoomOut, setViewport } = useReactFlow()

  // 过滤状态
  const [filter, setFilter] = useState({
    category:   'all',
    difficulty: 'all',
    search:     '',
  })

  // 选中的挑战
  const [selectedChallenge, setSelectedChallenge] =
    useState<Challenge | null>(null)

  // 选中节点在视口中的位置（用于飞出动效）
  const [selectedNodeRect, setSelectedNodeRect] =
    useState<DOMRect | null>(null)

  // 成就横幅
  const [achievement, setAchievement] =
    useState<{ name: string; xp: number } | null>(null)

  // 构建地图数据
  const { nodes: rawNodes, edges } = buildMapData(
    challenges,
    categories,
    userProgress
  )

  // 应用过滤（不匹配的节点 opacity 降低）
  const nodes = rawNodes.map(node => {
    const { challenge } = node.data
    const matchCat  = filter.category   === 'all' || challenge.categoryId === filter.category
    const matchDiff = filter.difficulty === 'all' || challenge.difficulty  === filter.difficulty
    const matchSrch = !filter.search
      || challenge.name.toLowerCase().includes(filter.search.toLowerCase())

    const visible = matchCat && matchDiff && matchSrch

    return {
      ...node,
      style: {
        opacity:    visible ? 1 : 0.12,
        transition: 'opacity 150ms',
      },
    }
  })

  // 节点点击
  const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    const el = event.currentTarget as HTMLElement
    setSelectedNodeRect(el.getBoundingClientRect())
    setSelectedChallenge(node.data.challenge)
  }, [])

  // 画布空白点击 → 关闭详情
  const handlePaneClick = useCallback(() => {
    setSelectedChallenge(null)
    setSelectedNodeRect(null)
  }, [])

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 120px)', position: 'relative' }}>

      {/* 过滤工具栏（悬浮在画布上方） */}
      <FilterToolbar
        categories={categories}
        filter={filter}
        onChange={setFilter}
      />

      {/* React Flow 画布 */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        panOnDrag
        zoomOnScroll
        zoomOnPinch           // 移动端双指缩放
        panOnScroll={false}
        minZoom={0.3}
        maxZoom={2.0}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}     // 节点不可单独拖拽
        nodesConnectable={false}   // 不可手动连线
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        {/* 双层网格背景 */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={32}
          size={1}
          color="var(--border)"
          style={{ opacity: 0.4 }}
        />
      </ReactFlow>

      {/* 悬浮详情卡片 */}
      <ChallengeDetailCard
        challenge={selectedChallenge}
        originRect={selectedNodeRect}
        user={user}
        onClose={() => {
          setSelectedChallenge(null)
          setSelectedNodeRect(null)
        }}
      />

      {/* 成就横幅 */}
      <AchievementBanner
        achievement={achievement}
        onDismiss={() => setAchievement(null)}
      />

      {/* 进度面板（仅登录后） */}
      {user && userProgress && (
        <ProgressPanel
          challenges={challenges}
          userProgress={userProgress}
        />
      )}

      {/* 地图控制器 */}
      <MapControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={() => setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 })}
        onFitView={() => fitView({ duration: 400, padding: 0.15 })}
      />
    </div>
  )
}
```

---

## 五、悬浮详情卡片

### `components/ChallengeDetailCard.tsx`

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter, useParams } from 'next/navigation'
import type { Challenge, User } from '@/types'

interface Props {
  challenge:  Challenge | null
  originRect: DOMRect | null
  user:       User | null
  onClose:    () => void
}

// 卡片固定落点（右上角）
const TARGET = { x: 16, y: 80, width: 340 }   // right: 16px, top: 80px

export function ChallengeDetailCard({ challenge, originRect, user, onClose }: Props) {
  const router = useRouter()
  const { locale } = useParams()

  // 计算飞出起点（节点中心相对于卡片目标位置的偏移）
  const getInitial = () => {
    if (!originRect) return { x: 0, y: -20, scale: 0.8, opacity: 0 }
    const targetX = window.innerWidth - TARGET.x - TARGET.width
    const targetY = TARGET.y
    return {
      x:       originRect.left - targetX,
      y:       originRect.top  - targetY,
      scale:   0.25,
      opacity: 0,
    }
  }

  // Esc 键关闭
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {challenge && (
        <motion.div
          key={challenge.id}
          initial={getInitial()}
          animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0, y: -8 }}
          transition={{
            type:      'spring',
            damping:   22,
            stiffness: 280,
            opacity:   { duration: 0.12 },
          }}
          style={{
            position: 'fixed',
            top:      TARGET.y,
            right:    TARGET.x,
            width:    TARGET.width,
            zIndex:   100,
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {/* 终端窗口风格外框 */}
          <div style={{
            border:     '1px solid var(--border)',
            background: 'var(--card)',
          }}>
            {/* 标题栏 */}
            <div style={{
              background:     'var(--primary)',
              color:          'var(--primary-foreground)',
              padding:        '6px 12px',
              fontSize:       11,
              fontWeight:     700,
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
            }}>
              <span>+─── CHALLENGE ───+</span>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border:     'none',
                  color:      'var(--primary-foreground)',
                  cursor:     'pointer',
                  fontSize:   12,
                  padding:    '0 4px',
                }}
              >
                [ × ]
              </button>
            </div>

            {/* 内容区 */}
            <div style={{ padding: '16px' }}>

              {/* 挑战名 + 难度 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>
                  {challenge.name}
                </span>
                <DifficultyBadge difficulty={challenge.difficulty} />
              </div>

              <Divider />

              {/* 描述 */}
              <div style={{ marginBottom: 12 }}>
                <Label>$ description</Label>
                <p style={{ fontSize: 12, color: 'var(--foreground)', lineHeight: 1.7, margin: '6px 0 0' }}>
                  {challenge.description}
                </p>
              </div>

              <Divider />

              {/* 登录后：进度信息 */}
              {user && (
                <div style={{ marginBottom: 12 }}>
                  <Label>status:</Label>
                  <StatusBadge challengeId={challenge.id} />
                </div>
              )}

              {/* 未登录：注册引导 */}
              {!user && (
                <div style={{
                  marginBottom: 12,
                  fontSize:     12,
                  color:        'var(--muted-foreground)',
                }}>
                  <span style={{ color: 'var(--primary)' }}>▓ </span>
                  Login to track this challenge
                </div>
              )}

              <Divider />

              {/* 操作按钮 */}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  onClick={() => router.push(`/${locale}/challenge/${challenge.slug}`)}
                  style={primaryButtonStyle}
                >
                  [ START CHALLENGE → ]
                </button>
                {!user && (
                  <button style={outlineButtonStyle}>
                    [ LOGIN ]
                  </button>
                )}
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── 子组件 ──────────────────────────────────────────

function Divider() {
  return <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0' }} />
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 10, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>
      {children}
    </span>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const color = { easy: 'var(--success)', medium: 'var(--warning)', hard: 'var(--destructive)' }
  return (
    <span style={{
      fontSize:   10,
      fontWeight: 700,
      color:      color[difficulty as keyof typeof color] ?? 'var(--foreground)',
      border:     `1px dashed ${color[difficulty as keyof typeof color] ?? 'var(--border)'}`,
      padding:    '2px 6px',
    }}>
      [{difficulty.toUpperCase()}]
    </span>
  )
}

const primaryButtonStyle: React.CSSProperties = {
  flex:        1,
  padding:     '8px 12px',
  fontSize:    11,
  fontWeight:  700,
  fontFamily:  'JetBrains Mono, monospace',
  background:  'var(--primary)',
  color:       'var(--primary-foreground)',
  border:      '1px solid var(--primary)',
  cursor:      'pointer',
  textTransform: 'uppercase',
}

const outlineButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  background: 'transparent',
  color:      'var(--primary)',
}
```

---

## 六、成就横幅

### `components/AchievementBanner.tsx`

```tsx
'use client'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'

interface Props {
  achievement: { name: string; xp: number } | null
  onDismiss:   () => void
}

export function AchievementBanner({ achievement, onDismiss }: Props) {
  // 3 秒后自动关闭
  useEffect(() => {
    if (!achievement) return
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [achievement, onDismiss])

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0,       opacity: 1 }}
          exit={{    y: '-100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position:   'fixed',
            top:        0,
            left:       '50%',
            transform:  'translateX(-50%)',
            zIndex:     200,
            background: 'var(--primary)',
            color:      'var(--primary-foreground)',
            padding:    '12px 32px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize:   13,
            fontWeight: 700,
            textAlign:  'center',
            minWidth:   320,
          }}
        >
          <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 4 }}>
            [✓] ACHIEVEMENT UNLOCKED
          </div>
          <div>{achievement.name}</div>
          <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>
            +{achievement.xp} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

---

## 七、进度面板

### `components/ProgressPanel.tsx`

```tsx
'use client'
import { useState, useMemo } from 'react'
import type { Challenge, UserProgress } from '@/types'

interface Props {
  challenges:   Challenge[]
  userProgress: UserProgress[]
}

export function ProgressPanel({ challenges, userProgress }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  const stats = useMemo(() => {
    const progressMap = new Map(userProgress.map(p => [p.challengeId, p.status]))
    const total     = challenges.length
    const completed = challenges.filter(c => progressMap.get(c.id) === 'completed').length
    const pct       = total ? Math.round((completed / total) * 100) : 0
    const bar       = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10))

    const byDiff = ['easy', 'medium', 'hard'].map(d => {
      const total = challenges.filter(c => c.difficulty === d).length
      const done  = challenges.filter(c => c.difficulty === d && progressMap.get(c.id) === 'completed').length
      const bar   = '█'.repeat(Math.round((done / total) * 8 || 0)) + '░'.repeat(8 - Math.round((done / total) * 8 || 0))
      return { d, total, done, bar }
    })

    return { total, completed, pct, bar, byDiff }
  }, [challenges, userProgress])

  const panelStyle: React.CSSProperties = {
    position:   'fixed',
    bottom:     16,
    left:       16,
    zIndex:     50,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize:   11,
    border:     '1px solid var(--border)',
    background: 'color-mix(in srgb, var(--background) 90%, transparent)',
    backdropFilter: 'blur(8px)',
    minWidth:   240,
  }

  return (
    <div style={panelStyle}>
      {/* 标题栏（可折叠） */}
      <div
        onClick={() => setCollapsed(v => !v)}
        style={{
          background: 'var(--primary)',
          color:      'var(--primary-foreground)',
          padding:    '5px 10px',
          cursor:     'pointer',
          display:    'flex',
          justifyContent: 'space-between',
          fontSize:   10,
          fontWeight: 700,
        }}
      >
        <span>+─── PROGRESS ───+</span>
        <span>{collapsed ? '▶' : '▼'}</span>
      </div>

      {!collapsed && (
        <div style={{ padding: '12px' }}>
          {/* 总进度条 */}
          <div style={{ color: 'var(--primary)', marginBottom: 8 }}>
            {stats.bar}{'  '}
            <span style={{ color: 'var(--foreground)' }}>
              {stats.completed}/{stats.total}
            </span>
            {'  '}
            <span style={{ color: 'var(--muted-foreground)' }}>
              {stats.pct}%
            </span>
          </div>

          {/* 按难度分组 */}
          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 8 }}>
            {stats.byDiff.map(({ d, total, done, bar }) => (
              <div key={d} style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'center' }}>
                <span style={{ width: 52, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>{d}</span>
                <span style={{ color: 'var(--primary)', fontSize: 10 }}>{bar}</span>
                <span style={{ color: 'var(--muted-foreground)' }}>{done}/{total}</span>
                {done === total && total > 0 && (
                  <span style={{ color: 'var(--primary)' }}>[✓]</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## 八、地图控制器

### `components/MapControls.tsx`

```tsx
'use client'

interface Props {
  onZoomIn:  () => void
  onZoomOut: () => void
  onReset:   () => void
  onFitView: () => void
}

export function MapControls({ onZoomIn, onZoomOut, onReset, onFitView }: Props) {
  const btnStyle: React.CSSProperties = {
    width:      32,
    height:     32,
    background: 'var(--card)',
    border:     '1px solid var(--border)',
    borderTop:  'none',
    color:      'var(--foreground)',
    cursor:     'pointer',
    fontSize:   14,
    fontFamily: 'JetBrains Mono, monospace',
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 100ms, color 100ms',
  }

  return (
    <div style={{
      position: 'fixed',
      bottom:   16,
      right:    16,
      zIndex:   50,
      display:  'flex',
      flexDirection: 'column',
      border:   '1px solid var(--border)',
    }}>
      {[
        { label: '+', action: onZoomIn,  title: 'Zoom in'  },
        { label: '─', action: onZoomOut, title: 'Zoom out' },
        { label: '⌂', action: onReset,   title: 'Reset view' },
        { label: '⊞', action: onFitView, title: 'Fit all' },
      ].map(({ label, action, title }, i) => (
        <button
          key={label}
          onClick={action}
          title={title}
          style={{ ...btnStyle, borderTop: i === 0 ? '1px solid var(--border)' : 'none' }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLElement).style.background = 'var(--primary)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--primary-foreground)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLElement).style.background = 'var(--card)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--foreground)'
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
```

---

## 九、React Flow 样式覆盖

在 `globals.css` 末尾追加，覆盖 RF 默认样式以匹配设计系统：

```css
/* ─── React Flow 样式覆盖 ─────────────────────────── */

/* 隐藏默认归因 */
.react-flow__attribution { display: none !important; }

/* 画布背景 */
.react-flow__background { background-color: var(--background) !important; }

/* 节点选中状态去除 RF 默认蓝色轮廓 */
.react-flow__node:focus,
.react-flow__node:focus-visible { outline: none !important; }

/* 边（连线）—— RF 默认会加 marker，这里统一关闭 */
.react-flow__edge-path { marker-end: none; }

/* 选择框 */
.react-flow__selection {
  background: color-mix(in srgb, var(--primary) 10%, transparent);
  border: 1px dashed var(--primary);
}

/* 迷你地图（如果启用） */
.react-flow__minimap {
  background: var(--card) !important;
  border: 1px solid var(--border) !important;
  border-radius: 0 !important;
}

.react-flow__minimap-mask { fill: color-mix(in srgb, var(--background) 80%, transparent); }
.react-flow__minimap-node { fill: var(--border); }
```

---

## 十、验收标准

### 依赖安装
```
□ @xyflow/react 安装成功，bun run dev 无报错
□ motion 安装成功
□ dagre + @types/dagre 安装成功
```

### 地图渲染
```
□ 画布正确渲染，背景为点阵网格
□ 节点按分类从左到右排列（dagre LR 布局）
□ 同分类节点间有连线（未登录全部虚线）
□ 已登录：完成的连线变为实线发光
□ 画布可拖拽平移，cursor 正确切换
□ 滚轮 / 双指缩放正常，范围 0.3 ~ 2.0
```

### 节点交互
```
□ hover 节点边框高亮（无需额外 JS，CSS 处理）
□ 点击节点，详情卡片从节点位置飞出到右上角
□ 点击画布空白处，详情卡片关闭并飞回
□ Esc 键关闭详情卡片
□ 已登录：节点状态（completed/in_progress/available）视觉正确
□ 未登录：所有节点为 available 样式
```

### 详情卡片
```
□ 飞出动效有弹性曲线（spring），不是线性
□ 内容：挑战名、难度、描述
□ 已登录：显示进度状态
□ 未登录：显示注册引导 + LOGIN 按钮
□ START CHALLENGE 跳转路由正确
```

### 进度面板（已登录）
```
□ 左下角固定显示
□ 总进度条字符正确（按完成比例）
□ 按难度分组数据正确
□ 可折叠/展开
```

### 成就横幅
```
□ 完成挑战返回时触发
□ 从顶部滑入，3s 后滑出
□ 显示挑战名和 XP
```

### 控制器
```
□ + 放大，- 缩小
□ ⌂ 重置回初始视口，有过渡动效
□ ⊞ fitView 显示所有节点，有过渡动效
□ hover 背景变 primary 反色
```

### 过滤
```
□ 分类/难度过滤：不匹配节点 opacity 0.12
□ 搜索：实时过滤，debounce 150ms
□ 过滤工具栏悬浮在画布上方，半透明背景
```

### 样式
```
□ RF 默认蓝色选中轮廓已覆盖
□ RF attribution 已隐藏
□ 所有组件字体为 JetBrains Mono
□ 无任何 border-radius（设计系统规定）
□ 两套主题（深色/浅色）均正确
```

### 移动端
```
□ 触摸拖拽正常（ReactFlow 内置支持）
□ 双指缩放正常（zoomOnPinch）
□ 详情卡片在小屏幕不超出视口（right: 16px 自适应）
□ 进度面板默认折叠
```
