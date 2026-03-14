# Challenges 地图页重构 - 任务分解文档

## 阶段 1: 基础设施准备

### 任务 1.1: 安装依赖
**状态**: ⬜ 待完成
**优先级**: P0
**预估工时**: 10 分钟

**详细步骤**:
1. 安装核心依赖
   ```bash
   bun add @xyflow/react motion dagre
   bun add -d @types/dagre
   ```
2. 验证安装成功
   ```bash
   bun run dev
   ```
   确认无报错

**验收标准**:
- [ ] `package.json` 中包含 `@xyflow/react`, `motion`, `dagre`
- [ ] `bun run dev` 正常启动

---

### 任务 1.2: 更新全局样式
**状态**: ⬜ 待完成
**优先级**: P0
**预估工时**: 15 分钟

**详细步骤**:
1. 在 `src/app/globals.css` 末尾追加 React Flow 样式覆盖
2. 添加必要的动画关键帧

**代码位置**: `src/app/globals.css`

**验收标准**:
- [ ] `.react-flow__attribution` 已隐藏
- [ ] `.react-flow__node:focus` 轮廓已移除
- [ ] 边线 marker 已移除

---

### 任务 1.3: 创建类型定义
**状态**: ⬜ 待完成
**优先级**: P0
**预估工时**: 10 分钟

**详细步骤**:
1. 在 `src/app/[locale]/(main)/challenge/lib/buildMapData.ts` 同级创建类型
2. 定义 `ChallengeNodeData`, `NodeStatus` 类型

**代码位置**: `src/app/[locale]/(main)/challenge/lib/types.ts`

**验收标准**:
- [ ] `ChallengeNodeData` 类型定义完整
- [ ] `NodeStatus` 联合类型定义正确

---

## 阶段 2: 核心工具函数

### 任务 2.1: 实现 dagre 布局函数
**状态**: ⬜ 待完成
**优先级**: P0
**预估工时**: 20 分钟

**详细步骤**:
1. 创建 `src/app/[locale]/(main)/challenge/lib/layoutWithDagre.ts`
2. 实现 `applyDagreLayout` 函数
3. 配置 dagre 图参数

**关键代码**:
```typescript
const NODE_WIDTH = 140
const NODE_HEIGHT = 72

g.setGraph({
  rankdir: 'LR',
  nodesep: 48,
  ranksep: 120,
  marginx: 80,
  marginy: 80,
})
```

**验收标准**:
- [ ] 函数接受 nodes 和 edges 参数
- [ ] 返回带有正确 position 的 nodes
- [ ] 节点居中计算正确 (x - width/2, y - height/2)

---

### 任务 2.2: 实现地图数据构建函数
**状态**: ⬜ 待完成
**优先级**: P0
**预估工时**: 30 分钟

**详细步骤**:
1. 创建 `src/app/[locale]/(main)/challenge/lib/buildMapData.ts`
2. 实现 `buildMapData` 函数
3. 构建节点和边的逻辑
4. 调用 dagre 布局

**关键逻辑**:
- 节点状态映射: `userProgress` → `status`
- 边构建: 同分类内按 `display_order` 连接
- 边样式: 前置完成 → 实线，未完成 → 虚线

**验收标准**:
- [ ] 正确生成所有挑战节点
- [ ] 同分类节点按顺序连接
- [ ] 边样式根据前置状态变化
- [ ] 应用 dagre 布局后位置正确

---

## 阶段 3: UI 组件开发

### 任务 3.1: 实现 ChallengeNode 组件
**状态**: ⬜ 待完成
**优先级**: P0
**预估工时**: 40 分钟

**详细步骤**:
1. 创建 `src/app/[locale]/(main)/challenge/nodes/ChallengeNode.tsx`
2. 实现节点渲染
3. 添加状态样式
4. 使用 memo 优化

**视觉规格**:
- 尺寸: 140px × 72px
- 边框根据状态变化
- 难度颜色映射
- 状态图标显示

**验收标准**:
- [ ] 节点渲染符合设计规格
- [ ] 三种状态样式正确
- [ ] 难度颜色正确
- [ ] 使用 `memo` 包裹

---

### 任务 3.2: 实现 ChallengeDetailCard 组件
**状态**: ⬜ 待完成
**优先级**: P0
**预估工时**: 50 分钟

**详细步骤**:
1. 创建 `src/app/[locale]/(main)/challenge/components/ChallengeDetailCard.tsx`
2. 实现飞入动画 (Framer Motion)
3. 实现终端窗口风格 UI
4. 添加交互功能

**动画规格**:
- 初始: 从节点位置计算偏移
- 目标: 右上角固定位置
- 类型: Spring (damping: 22, stiffness: 280)

**验收标准**:
- [ ] 飞入动画流畅
- [ ] 终端窗口风格正确
- [ ] ESC 键关闭功能
- [ ] 内容显示完整

---

### 任务 3.3: 实现 AchievementBanner 组件
**状态**: ⬜ 待完成
**优先级**: P1
**预估工时**: 20 分钟

**详细步骤**:
1. 创建 `src/app/[locale]/(main)/challenge/components/AchievementBanner.tsx`
2. 实现滑入/滑出动画
3. 添加自动关闭逻辑

**动画规格**:
- 进入: y: -100% → 0
- 退出: y: 0 → -100%
- 自动关闭: 3秒

**验收标准**:
- [ ] 从顶部滑入动画
- [ ] 3秒后自动关闭
- [ ] 样式符合设计系统

---

### 任务 3.4: 实现 ProgressPanel 组件
**状态**: ⬜ 待完成
**优先级**: P1
**预估工时**: 30 分钟

**详细步骤**:
1. 创建 `src/app/[locale]/(main)/challenge/components/ProgressPanel.tsx`
2. 实现进度统计计算
3. 实现字符进度条
4. 添加折叠功能

**进度条算法**:
```typescript
const bar = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10))
```

**验收标准**:
- [ ] 总进度显示正确
- [ ] 按难度分组正确
- [ ] 字符进度条渲染正确
- [ ] 折叠功能正常

---

### 任务 3.5: 实现 MapControls 组件
**状态**: ⬜ 待完成
**优先级**: P1
**预估工时**: 20 分钟

**详细步骤**:
1. 创建 `src/app/[locale]/(main)/challenge/components/MapControls.tsx`
2. 实现四个控制按钮
3. 添加 hover 效果

**按钮功能**:
- +: zoomIn
- ─: zoomOut
- ⌂: reset viewport
- ⊞: fitView

**验收标准**:
- [ ] 四个按钮渲染正确
- [ ] hover 效果正确
- [ ] 点击调用对应函数

---

### 任务 3.6: 实现 FilterToolbar 组件
**状态**: ⬜ 待完成
**优先级**: P1
**预估工时**: 30 分钟

**详细步骤**:
1. 创建 `src/app/[locale]/(main)/challenge/components/FilterToolbar.tsx`
2. 实现分类下拉
3. 实现难度下拉
4. 实现搜索框

**过滤逻辑**:
- 分类: 精确匹配 categoryId
- 难度: 精确匹配 difficulty
- 搜索: 模糊匹配 name

**验收标准**:
- [ ] 三个过滤控件渲染
- [ ] 过滤状态正确传递
- [ ] 样式符合设计系统

---

## 阶段 4: 主组件集成

### 任务 4.1: 实现 ChallengesMap 组件
**状态**: ⬜ 待完成
**优先级**: P0
**预估工时**: 60 分钟

**详细步骤**:
1. 创建 `src/app/[locale]/(main)/challenge/ChallengesMap.tsx`
2. 集成 React Flow
3. 实现状态管理
4. 集成所有子组件

**状态管理**:
- filter: 过滤条件
- selectedChallenge: 选中挑战
- selectedNodeRect: 节点位置
- achievement: 成就数据

**验收标准**:
- [ ] React Flow 正常渲染
- [ ] 节点和边正确显示
- [ ] 过滤功能正常
- [ ] 所有子组件集成正确

---

### 任务 4.2: 实现 ChallengesMapWrapper 组件
**状态**: ⬜ 待完成
**优先级**: P0
**预估工时**: 15 分钟

**详细步骤**:
1. 创建 `src/app/[locale]/(main)/challenge/ChallengesMapWrapper.tsx`
2. 使用 next/dynamic 禁用 SSR
3. 实现加载骨架屏

**验收标准**:
- [ ] dynamic import 配置正确
- [ ] SSR 已禁用
- [ ] 加载骨架屏显示正确

---

## 阶段 5: 页面集成

### 任务 5.1: 重构 page.tsx
**状态**: ⬜ 待完成
**优先级**: P0
**预估工时**: 30 分钟

**详细步骤**:
1. 修改 `src/app/[locale]/(main)/challenge/page.tsx`
2. 添加用户和进度数据获取
3. 集成 ChallengesMapWrapper

**数据获取**:
```typescript
const [categories, challenges, user] = await Promise.all([
  getCategories(),
  getChallenges(),
  getCurrentUser(),
])
```

**验收标准**:
- [ ] 服务端数据获取正确
- [ ] 传递所有必要 props
- [ ] 页面正常渲染

---

### 任务 5.2: 添加用户进度查询函数
**状态**: ⬜ 待完成
**优先级**: P0
**预估工时**: 20 分钟

**详细步骤**:
1. 在 `src/server/lib/db/queries.ts` 添加 `getUserProgress`
2. 创建用户进度表查询逻辑

**注意**: 如果用户进度表不存在，需要先创建表

**验收标准**:
- [ ] 查询函数返回正确格式
- [ ] 处理未登录情况

---

## 阶段 6: 清理和优化

### 任务 6.1: 移除旧组件
**状态**: ⬜ 待完成
**优先级**: P2
**预估工时**: 10 分钟

**详细步骤**:
1. 删除 `src/components/ChallengesSkillTree.tsx`
2. 删除 `src/components/GuestChallengeView.tsx`
3. 删除 `src/components/ChallengesPageClient.tsx`

**验收标准**:
- [ ] 旧组件已删除
- [ ] 无引用错误

---

### 任务 6.2: 类型检查
**状态**: ⬜ 待完成
**优先级**: P0
**预估工时**: 15 分钟

**详细步骤**:
```bash
npx tsc --noEmit
```

**验收标准**:
- [ ] 无 TypeScript 错误

---

### 任务 6.3: 代码检查
**状态**: ⬜ 待完成
**优先级**: P1
**预估工时**: 10 分钟

**详细步骤**:
```bash
bun run lint
```

**验收标准**:
- [ ] 无 ESLint 错误

---

## 阶段 7: 测试验证

### 任务 7.1: 功能测试
**状态**: ⬜ 待完成
**优先级**: P0
**预估工时**: 30 分钟

**测试项**:
1. 地图渲染
2. 节点交互
3. 详情卡片
4. 过滤功能
5. 缩放控制
6. 进度面板

**验收标准**:
- [ ] 所有功能测试通过

---

### 任务 7.2: 响应式测试
**状态**: ⬜ 待完成
**优先级**: P1
**预估工时**: 20 分钟

**测试项**:
1. Desktop (>1024px)
2. Tablet (768-1024px)
3. Mobile (<768px)

**验收标准**:
- [ ] 各断点显示正常

---

### 任务 7.3: 主题测试
**状态**: ⬜ 待完成
**优先级**: P1
**预估工时**: 10 分钟

**测试项**:
1. 深色模式
2. 浅色模式

**验收标准**:
- [ ] 两套主题显示正确

---

## 任务统计

| 阶段 | 任务数 | 预估总工时 |
|------|--------|-----------|
| 阶段 1: 基础设施 | 3 | 35 分钟 |
| 阶段 2: 核心工具 | 2 | 50 分钟 |
| 阶段 3: UI 组件 | 6 | 190 分钟 |
| 阶段 4: 主组件 | 2 | 75 分钟 |
| 阶段 5: 页面集成 | 2 | 50 分钟 |
| 阶段 6: 清理优化 | 3 | 35 分钟 |
| 阶段 7: 测试验证 | 3 | 60 分钟 |
| **总计** | **21** | **约 8 小时** |
