## 布局验证
- [x] Header 固定在顶部，滚动页面时始终可见
- [x] 高度为 60px
- [x] 背景为半透明 + backdrop-filter: blur(12px)
- [x] 下边框 1px solid，颜色跟随设计系统

## Logo 验证
- [x] Logo 显示 "AI-Era" 文字
- [x] "_" 光标持续闪烁
- [x] 使用设计系统的 `animate-blink` 动效类

## 导航链接验证
- [x] 4 个导航链接全部显示：Home、Challenges、Docs、About
- [x] 点击链接跳转到正确路由
- [x] 导航使用 `<nav>` 标签包裹
- [x] Hover 时显示方括号效果 `[ Link ]`
- [x] 当前页高亮显示

## 主题切换验证
- [x] 深色模式显示 ☀，点击切换为浅色
- [x] 浅色模式显示 ☾，点击切换为深色
- [x] 切换后 localStorage 正确保存主题状态
- [x] 刷新页面后主题状态保持

## 移动端验证
- [x] 移动端导航链接可以折叠或横向滚动
- [x] 不遮挡内容

## 代码质量验证
- [x] TypeScript 类型检查通过
- [x] ESLint 检查通过

