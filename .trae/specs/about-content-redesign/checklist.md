# Checklist

## 结构

- [x] Canvas 区和主标题完全不变
- [x] 内容区恢复正常滚动
- [x] 四个 Section 按顺序排列
- [x] 分隔线带 "// section N of 4" 注释
- [x] 所有内容限制在 max-w-7xl 内
- [x] Header / Footer 不受影响

## Section 1 MISSION

- [x] 左侧 sticky，primary 左竖线
- [x] 右侧两段文字，关键词 primary 加粗
- [x] 点阵分隔符正确
- [x] 滚动触发动效

## Section 2 FOUNDER + TEAM

- [x] FOUNDER 横条，左侧 primary 重点线，头像有边框
- [x] TEAM 命令行标题正确
- [x] 成员卡片 hover 效果（边框变色 + translateY）
- [x] 头像 hover 去掉 grayscale

## Section 3 STACK

- [x] font-size: 13px，line-height: 2（可读）
- [x] 三色区分：key=primary，value=amber，comment=灰italic
- [x] 横向可滚动
- [x] border-left: 3px solid primary

## Section 4 OPEN_ROLES + CONTACT

- [x] 两者都有 primary 标题栏（+─── TITLE ───+）
- [x] OPEN_ROLES 内容区有轻微绿色背景
- [x] CONTACT URL 行整行 hover 可点击
- [x] "→ open an issue" hover translateX 效果
- [x] NEWSLETTER 输入框终端风格
- [x] 移动端两栏变单列

## 动效

- [x] 所有 Section 滚动触发，once: true
- [x] MISSION 从左滑入
- [x] CONTACT / OPEN_ROLES 各自从外侧滑入
- [x] 成员卡片 stagger 入场
- [x] prefers-reduced-motion 所有动效关闭
