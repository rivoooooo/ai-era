# Challenges 地图页重构 - 验收清单

## 前置检查

- [ ] 已阅读 `frontend-design` skill
- [ ] 已阅读原始实现文档 `Challenges-Map-Implementation.md`
- [ ] 已确认项目技术栈 (Next.js 16 + React 19 + Tailwind CSS 4)

---

## 阶段 1: 基础设施准备

### 1.1 依赖安装
- [ ] `@xyflow/react` 已安装
- [ ] `motion` 已安装
- [ ] `dagre` 已安装
- [ ] `@types/dagre` 已安装为 devDependencies
- [ ] `bun run dev` 能正常启动

### 1.2 全局样式更新
- [ ] `.react-flow__attribution` 已隐藏
- [ ] `.react-flow__background` 使用 `var(--background)`
- [ ] `.react-flow__node:focus` 轮廓已移除
- [ ] `.react-flow__edge-path` marker 已移除
- [ ] `.react-flow__selection` 样式已自定义

### 1.3 类型定义
- [ ] `ChallengeNodeData` 类型已定义
- [ ] `NodeStatus` 联合类型已定义 ('available' | 'in_progress' | 'completed')
- [ ] 类型文件位置正确

---

## 阶段 2: 核心工具函数

### 2.1 dagre 布局函数
- [ ] `layoutWithDagre.ts` 文件已创建
- [ ] `applyDagreLayout` 函数导出正确
- [ ] 节点尺寸常量定义 (140×72)
- [ ] dagre 配置正确
  - [ ] rankdir: 'LR'
  - [ ] nodesep: 48
  - [ ] ranksep: 120
  - [ ] marginx: 80
  - [ ] marginy: 80
- [ ] 节点居中计算正确

### 2.2 地图数据构建函数
- [ ] `buildMapData.ts` 文件已创建
- [ ] `buildMapData` 函数导出正确
- [ ] 节点构建逻辑正确
  - [ ] 所有挑战生成节点
  - [ ] 节点类型为 'challenge'
  - [ ] draggable: false
  - [ ] selectable: true
- [ ] 边构建逻辑正确
  - [ ] 同分类内按 display_order 连接
  - [ ] 前置完成 → 实线 + 高亮
  - [ ] 前置未完成 → 虚线 + 低透明度
- [ ] 调用 dagre 布局

---

## 阶段 3: UI 组件开发

### 3.1 ChallengeNode 组件
- [ ] 文件已创建: `nodes/ChallengeNode.tsx`
- [ ] 使用 `memo` 包裹
- [ ] 尺寸: 140px × 72px
- [ ] Handle 连接点已添加 (opacity: 0)
- [ ] 难度颜色映射正确
  - [ ] easy: var(--success)
  - [ ] medium: var(--warning)
  - [ ] hard: var(--destructive)
- [ ] 状态样式正确
  - [ ] available: 1px solid var(--border)
  - [ ] in_progress: 1px dashed var(--primary)
  - [ ] completed: 2px solid var(--primary) + 发光
  - [ ] selected: 2px solid var(--primary) + outline
- [ ] 状态图标显示正确
  - [ ] available: ''
  - [ ] in_progress: '[~]'
  - [ ] completed: '[✓]'
- [ ] 挑战名最多显示 2 行
- [ ] 字体使用 JetBrains Mono

### 3.2 ChallengeDetailCard 组件
- [ ] 文件已创建: `components/ChallengeDetailCard.tsx`
- [ ] 使用 Framer Motion 动画
- [ ] 飞入动画规格正确
  - [ ] 类型: Spring
  - [ ] damping: 22
  - [ ] stiffness: 280
- [ ] 目标位置正确 (top: 80px, right: 16px, width: 340px)
- [ ] 终端窗口风格
  - [ ] 标题栏: +─── CHALLENGE ───+
  - [ ] 关闭按钮: [ × ]
- [ ] 内容显示完整
  - [ ] 挑战名
  - [ ] 难度标签
  - [ ] $ description
  - [ ] 描述文本
  - [ ] 状态 (已登录)
- [ ] 按钮功能
  - [ ] START CHALLENGE 跳转正确
  - [ ] LOGIN 按钮 (未登录)
- [ ] ESC 键关闭功能
- [ ] 点击关闭按钮功能

### 3.3 AchievementBanner 组件
- [ ] 文件已创建: `components/AchievementBanner.tsx`
- [ ] 使用 Framer Motion 动画
- [ ] 滑入动画正确 (y: -100% → 0)
- [ ] 3秒后自动关闭
- [ ] 样式正确
  - [ ] 顶部居中
  - [ ] 背景: var(--primary)
  - [ ] 文字: var(--primary-foreground)
  - [ ] 字体: JetBrains Mono
- [ ] 内容显示
  - [ ] [✓] ACHIEVEMENT UNLOCKED
  - [ ] 成就名
  - [ ] +XP 数值

### 3.4 ProgressPanel 组件
- [ ] 文件已创建: `components/ProgressPanel.tsx`
- [ ] 位置: 左下角固定
- [ ] 可折叠/展开功能
- [ ] 总进度显示正确
  - [ ] 字符进度条 █░
  - [ ] 完成数/总数
  - [ ] 百分比
- [ ] 按难度分组正确
  - [ ] easy
  - [ ] medium
  - [ ] hard
- [ ] 完成分类显示 [✓] 标记

### 3.5 MapControls 组件
- [ ] 文件已创建: `components/MapControls.tsx`
- [ ] 位置: 右下角固定
- [ ] 四个按钮渲染
  - [ ] +: zoomIn
  - [ ] ─: zoomOut
  - [ ] ⌂: reset viewport
  - [ ] ⊞: fitView
- [ ] hover 效果正确
  - [ ] 背景变 var(--primary)
  - [ ] 文字变 var(--primary-foreground)

### 3.6 FilterToolbar 组件
- [ ] 文件已创建: `components/FilterToolbar.tsx`
- [ ] 位置: 画布上方悬浮
- [ ] 分类下拉
  - [ ] All 选项
  - [ ] 所有分类选项
- [ ] 难度下拉
  - [ ] All 选项
  - [ ] easy/medium/hard 选项
- [ ] 搜索框
  - [ ] 实时搜索
  - [ ] debounce 150ms
- [ ] 半透明背景 + backdrop blur

---

## 阶段 4: 主组件集成

### 4.1 ChallengesMap 组件
- [ ] 文件已创建: `ChallengesMap.tsx`
- [ ] 使用 'use client'
- [ ] ReactFlowProvider 包裹
- [ ] 状态管理正确
  - [ ] filter
  - [ ] selectedChallenge
  - [ ] selectedNodeRect
  - [ ] achievement
- [ ] React Flow 配置正确
  - [ ] panOnDrag: true
  - [ ] zoomOnScroll: true
  - [ ] zoomOnPinch: true
  - [ ] minZoom: 0.3
  - [ ] maxZoom: 2.0
  - [ ] fitView: true
  - [ ] nodesDraggable: false
  - [ ] nodesConnectable: false
- [ ] 过滤逻辑正确
  - [ ] 不匹配节点 opacity: 0.12
- [ ] 子组件集成
  - [ ] FilterToolbar
  - [ ] ChallengeDetailCard
  - [ ] AchievementBanner
  - [ ] ProgressPanel (条件渲染)
  - [ ] MapControls

### 4.2 ChallengesMapWrapper 组件
- [ ] 文件已创建: `ChallengesMapWrapper.tsx`
- [ ] dynamic import 配置正确
- [ ] ssr: false
- [ ] loading 骨架屏
  - [ ] 终端风格文本
  - [ ] 光标闪烁动画

---

## 阶段 5: 页面集成

### 5.1 page.tsx 重构
- [ ] Server Component 正确
- [ ] 数据获取正确
  - [ ] getCategories()
  - [ ] getChallenges()
  - [ ] getCurrentUser()
  - [ ] getUserProgress() (条件)
- [ ] ChallengesMapWrapper 集成
- [ ] 传递所有必要 props

### 5.2 用户进度查询
- [ ] `getUserProgress` 函数已添加
- [ ] 返回格式正确
- [ ] 处理未登录情况

---

## 阶段 6: 清理和优化

### 6.1 移除旧组件
- [ ] ChallengesSkillTree.tsx 已删除
- [ ] GuestChallengeView.tsx 已删除
- [ ] ChallengesPageClient.tsx 已删除
- [ ] 无引用错误

### 6.2 类型检查
- [ ] `npx tsc --noEmit` 无错误

### 6.3 代码检查
- [ ] `bun run lint` 无错误

---

## 阶段 7: 测试验证

### 7.1 功能测试
- [ ] 画布正确渲染
- [ ] 背景为点阵网格
- [ ] 节点按分类从左到右排列
- [ ] 同分类节点间有连线
- [ ] 已登录：完成的连线变为实线发光
- [ ] 画布可拖拽平移
- [ ] 滚轮/双指缩放正常
- [ ] 点击节点，详情卡片飞出
- [ ] 点击画布空白处，详情卡片关闭
- [ ] ESC 键关闭详情卡片
- [ ] 进度面板显示正确数据
- [ ] 地图控制器功能正常
- [ ] 过滤功能正常

### 7.2 样式测试
- [ ] RF 默认蓝色选中轮廓已覆盖
- [ ] RF attribution 已隐藏
- [ ] 所有组件字体为 JetBrains Mono
- [ ] 无任何 border-radius
- [ ] 两套主题（深色/浅色）均正确

### 7.3 响应式测试
- [ ] Desktop (>1024px) 显示正常
- [ ] Tablet (768-1024px) 显示正常
- [ ] Mobile (<768px) 显示正常
- [ ] 移动端进度面板默认折叠

### 7.4 性能测试
- [ ] 首屏加载 < 2s
- [ ] 节点交互响应 < 100ms
- [ ] 动画流畅 60fps

---

## 最终确认

- [ ] 所有 P0 任务已完成
- [ ] 所有 P1 任务已完成
- [ ] 代码审查通过
- [ ] 设计审查通过
- [ ] 功能测试通过
- [ ] 可以合并到主分支
