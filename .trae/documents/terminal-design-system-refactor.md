# Terminal CLI 设计系统重构计划

## 项目概述

基于 `prompt.xml` 中的 Terminal CLI 设计系统，对现有主题进行专业化整理，实现双主题方案（深色/浅色），并更新 `globals.css`。

---

## 现状分析

### 当前设计系统
- **风格**: Terminal CLI / 终端命令行风格
- **当前模式**: 仅深色模式
- **主色调**: 终端绿 (#33ff00) + 琥珀色 (#ffb000)
- **技术栈**: Tailwind CSS v4 + shadcn/ui

### 现有问题
1. 缺少浅色模式配色方案
2. 颜色语义不够清晰（如 accent 与 primary 重复）
3. 缺少系统化的主题切换机制
4. 部分设计 token 命名不够规范

---

## 设计目标

### 1. 双主题方案
设计一套完整的浅色模式配色，保持 Terminal CLI 的核心视觉特征：
- 高对比度
- 无圆角
- 等宽字体
- 单色/双色限制

### 2. 颜色系统优化
- 建立清晰的颜色层级
- 区分功能色（成功、警告、错误、信息）
- 保持 Terminal 风格的视觉一致性

### 3. 技术实现
- 使用 CSS 变量实现主题切换
- 支持系统偏好自动检测
- 提供手动切换能力

---

## 设计方案

### 深色模式（Dark）- 现有优化

```
背景层级:
- background: #0a0a0a (主背景)
- foreground: #33ff00 (主文字)
- card: #0f0f0f (卡片背景)
- popover: #0f0f0f (浮层背景)

功能色:
- primary: #33ff00 (终端绿)
- secondary: #ffb000 (琥珀/警告)
- success: #33ff00 (成功 - 同 primary)
- warning: #ffb000 (警告 - 同 secondary)
- error: #ff3333 (错误红)
- info: #00ffff (信息青)

辅助色:
- muted: #1a3d1a (弱化绿)
- muted-foreground: #66ff66 (弱化文字)
- border: #1f521f (边框绿)
- input: #1f521f (输入框边框)
- ring: #33ff00 (焦点环)
```

### 浅色模式（Light）- 新增设计

设计思路：
- 保持高对比度
- 反转背景/前景色
- 降低饱和度避免刺眼
- 保留 Terminal 的工业感

```
背景层级:
- background: #f5f5f0 (米白/纸张色)
- foreground: #1a3d1a (深墨绿)
- card: #ffffff (纯白卡片)
- popover: #ffffff (纯白浮层)

功能色:
- primary: #2d8a2d (深终端绿)
- secondary: #cc8800 (深琥珀)
- success: #2d8a2d (成功绿)
- warning: #cc8800 (警告琥珀)
- error: #cc3333 (错误红)
- info: #0088cc (信息蓝)

辅助色:
- muted: #e8e8e0 (弱化背景)
- muted-foreground: #5a7a5a (弱化文字)
- border: #c4d4c4 (边框绿)
- input: #c4d4c4 (输入框边框)
- ring: #2d8a2d (焦点环)
```

---

## 实施步骤

### Phase 1: 更新 prompt.xml 设计文档 ✅
1. 更新 Colors 章节，添加浅色模式配色
2. 新增主题切换最佳实践章节
3. 补充 CSS 变量使用规范

### Phase 2: 更新 globals.css
1. 更新 `:root` 为浅色模式默认
2. 添加 `.dark` 类选择器
3. 更新 `@theme inline` 映射
4. 保留 Terminal 特色样式类

### Phase 3: 组件适配
1. 检查现有组件兼容性
2. 测试双主题下的视觉效果
3. 修复颜色对比度问题

---

## 文件变更

### 主要修改文件
- `/Users/owocc/Documents/Project/api-test/prompt.xml` - 设计系统文档 ✅ 已完成
- `/Users/owocc/Documents/Project/api-test/src/app/globals.css` - 主题系统核心

### 可能需要调整
- `/Users/owocc/Documents/Project/api-test/src/app/layout.tsx` - 添加主题支持
- 组件文件 - 确保使用语义化颜色

---

## 设计原则

1. **保持 Terminal CLI 核心特征**
   - 等宽字体优先
   - 0px 圆角
   - 高对比度
   - 工业/命令行美学

2. **无障碍优先**
   - WCAG AA 对比度标准
   - 清晰的焦点状态
   - 支持键盘导航

3. **可维护性**
   - 语义化命名
   - 模块化结构
   - 清晰的注释

4. **扩展性**
   - 预留主题扩展空间
   - 支持未来添加更多主题变体
