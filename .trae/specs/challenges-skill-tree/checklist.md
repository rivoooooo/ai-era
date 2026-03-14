# Checklist - Challenges Skill Tree

## 验收标准检查清单

### 1. 画布渲染
- [ ] 画布以点阵背景渲染（radial-gradient dots pattern）
- [ ] 节点和 SVG 连线正确叠加显示
- [ ] 画布可横向滚动（overflow-x: auto）
- [ ] 桌面端画布高度 600px，移动端 400px

### 2. 节点系统
- [ ] 节点尺寸 120px × 80px
- [ ] locked 状态：虚线边框、0.4 opacity、🔒 图标
- [ ] available 状态：实线边框、脉冲光晕动画
- [ ] completed 状态：实线边框、primary 背景 15%、发光效果、[✓] 图标
- [ ] selected 状态：2px 实线边框 + outline offset
- [ ] 难度标签颜色正确（EASY=success, MEDIUM=warning, HARD=destructive）
- [ ] hover 动效 scale(1.05)

### 3. 连线系统
- [ ] SVG path 使用贝塞尔曲线
- [ ] 未激活：虚线 dashed、opacity 0.5
- [ ] 激活：实线 primary、opacity 0.8
- [ ] 完成：实线 primary、glow filter

### 4. 布局
- [ ] 节点按分类分列（从左到右）
- [ ] 列内按难度排序（EASY 在上）
- [ ] 分类标题显示在每列顶部
- [ ] 分类标题样式：primary 颜色、12px、uppercase、bold

### 5. 交互
- [ ] 点击节点变为 selected 状态
- [ ] 底部详情栏展开显示
- [ ] 详情栏显示完整信息（名称、难度、描述、前置、解锁、状态、按钮）
- [ ] START CHALLENGE 按钮跳转正确路由
- [ ] 底部栏展开动画 200ms ease-out

### 6. 过滤功能
- [ ] 分类过滤下拉菜单
- [ ] 难度过滤下拉菜单
- [ ] 状态过滤下拉菜单（ALL/AVAILABLE/COMPLETED/LOCKED）
- [ ] 搜索输入框
- [ ] 过滤时不匹配节点 opacity 0.2

### 7. 进度面板
- [ ] 固定在画布右上角
- [ ] 显示总体进度（X/Y 百分比）
- [ ] 字符进度条（█/░，12 格）
- [ ] 按难度分类显示
- [ ] 可折叠展开
- [ ] 未登录显示 "--"

### 8. 动效
- [ ] 页面加载节点依次淡入（delay = colIndex × 80ms）
- [ ] available 节点脉冲光晕 2s infinite
- [ ] 连线描边动画 stroke-dashoffset 400ms
- [ ] 节点 hover scale 100ms
- [ ] 过滤切换 opacity 150ms
- [ ] prefers-reduced-motion 关闭所有动效

### 9. 响应式
- [ ] 移动端节点尺寸适当缩小
- [ ] 移动端画布高度 400px
- [ ] 支持手势横向滚动

### 10. 未登录状态
- [ ] 所有节点显示 available（无 locked）
- [ ] 底部栏不显示 prerequisites/unlocks
- [ ] 进度面板数字为 "--"
- [ ] START CHALLENGE 正常跳转

### 11. 代码质量
- [ ] 遵循 Terminal CLI 设计系统风格
- [ ] TypeScript 类型正确
- [ ] 组件结构清晰
- [ ] 无 console 错误
