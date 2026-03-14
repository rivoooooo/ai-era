# Tasks - Challenges Skill Tree Implementation

## 依赖关系说明

- Task 1-3 为数据层准备
- Task 4-6 为样式/基础设施
- Task 7-11 为核心组件
- Task 12 为页面集成
- Task 13 为数据集成
- Task 14 为验证

---

- [ ] Task 1: 扩展数据库 schema 添加挑战依赖关系
  - [ ] SubTask 1.1: 在 schema.ts 添加 challenge_dependencies 表或字段
  - [ ] SubTask 1.2: 添加查询函数 getChallengeDependencies
  - [ ] SubTask 1.3: 更新 queries.ts 导出新类型

- [ ] Task 2: 扩展 challenges API 端点支持依赖关系
  - [ ] SubTask 2.1: 添加 /api/challenges/dependencies 路由
  - [ ] SubTask 2.2: 实现依赖关系查询逻辑

- [ ] Task 3: 创建前端类型定义
  - [ ] SubTask 3.1: 定义 ChallengeNode, NodePosition, Connection 等 TypeScript 接口
  - [ ] SubTask 3.2: 定义节点状态枚举 (locked/available/completed/selected)

- [ ] Task 4: 添加技能树相关 CSS 变量和基础样式
  - [ ] SubTask 4.1: 添加点阵背景图案到 globals.css
  - [ ] SubTask 4.2: 添加节点发光、脉冲等动效 keyframes

- [ ] Task 5: 创建 ChallengeNode 组件
  - [ ] SubTask 5.1: 实现四种状态样式
  - [ ] SubTask 5.2: 实现脉冲光晕动画
  - [ ] SubTask 5.3: 添加 hover 和点击交互

- [ ] Task 6: 创建 SkillTreeCanvas 组件
  - [ ] SubTask 6.1: 实现横向滚动画布容器
  - [ ] SubTask 6.2: 实现 SVG 连线层
  - [ ] SubTask 6.3: 计算节点坐标布局算法

- [ ] Task 7: 创建 NodeDetailPanel 组件
  - [ ] SubTask 7.1: 实现默认状态和展开状态
  - [ ] SubTask 7.2: 实现展开/收起动画
  - [ ] SubTask 7.3: 实现按钮交互逻辑

- [ ] Task 8: 创建 ProgressWidget 组件
  - [ ] SubTask 8.1: 实现字符进度条渲染
  - [ ] SubTask 8.2: 实现折叠/展开交互
  - [ ] SubTask 8.3: 处理未登录状态

- [ ] Task 9: 创建 FilterToolbar 组件
  - [ ] SubTask 9.1: 实现分类、难度、状态过滤下拉菜单
  - [ ] SubTask 9.2: 实现搜索输入框
  - [ ] SubTask 9.3: 实现过滤状态管理

- [ ] Task 10: 实现节点布局算法
  - [ ] SubTask 10.1: 按分类分组计算列位置
  - [ ] SubTask 10.2: 按难度排序计算行位置
  - [ ] SubTask 10.3: 计算贝塞尔曲线连接点

- [ ] Task 11: 实现动效系统
  - [ ] SubTask 11.1: 页面加载依次淡入动画
  - [ ] SubTask 11.2: 连线描边动画
  - [ ] SubTask 11.3: prefers-reduced-motion 支持

- [ ] Task 12: 重构主页面集成所有组件
  - [ ] SubTask 12.1: 替换现有 challenge/page.tsx
  - [ ] SubTask 12.2: 集成 FilterToolbar、Canvas、Panel、Widget
  - [ ] SubTask 12.3: 处理客户端/服务端组件边界

- [ ] Task 13: 添加国际化文本支持
  - [ ] SubTask 13.1: 在 messages/en.json 添加 skill tree 相关翻译
  - [ ] SubTask 13.2: 在 messages/zh.json 添加对应翻译
  - [ ] SubTask 13.3: 在 messages/ja.json 添加对应翻译

- [ ] Task 14: 验收检查
  - [ ] SubTask 14.1: 逐项检查 spec.md 验收标准
  - [ ] SubTask 14.2: 测试响应式布局
  - [ ] SubTask 14.3: 测试动效和可访问性
