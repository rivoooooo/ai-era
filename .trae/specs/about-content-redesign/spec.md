# About 页面内容区重排版 Spec

## Why
当前 About 页面采用 70/30 分割的固定布局，内容展示受限。需要改为正常滚动的内容区，增加 MISSION、FOUNDER+TEAM、STACK、OPEN_ROLES+CONTACT 四个 Section，提供更完整的信息展示。

## What Changes
- 内容区从固定高度改为正常滚动（overflow: auto）
- 保留 Canvas 动效区和主标题不变
- 新增 4 个 Section：MISSION、FOUNDER+TEAM、STACK、OPEN_ROLES+CONTACT
- 添加带注释的字符分隔线组件
- 所有内容限制在 max-w-7xl 内并水平居中
- 每个 Section 添加滚动触发动效

## Impact
- 受影响文件：
  - `src/app/[locale]/(main)/about/page.tsx` - 主页面重构
  - 新增 `src/app/[locale]/(main)/about/components/` 目录下的多个组件
- 设计风格：与现有 Terminal CLI 设计系统保持一致
- 布局：从固定高度改为正常滚动

## ADDED Requirements

### Requirement: SectionDivider Component
The system SHALL provide a SectionDivider component with section numbering.

#### Scenario: Visual display
- **WHEN** viewing the divider
- **THEN** it displays character line with "// section N of total" comment
- **AND** uses JetBrains Mono font

### Requirement: MissionSection
The system SHALL provide a Mission section with two-column layout.

#### Scenario: Desktop layout
- **WHEN** viewing on desktop
- **THEN** left column shows sticky labels with primary left border
- **AND** right column shows two paragraphs with dot separator
- **AND** keywords are bold with primary color

#### Scenario: Scroll animation
- **WHEN** section enters viewport
- **THEN** it animates from left with opacity 0→1, translateX -20px→0

### Requirement: FounderSection
The system SHALL provide a Founder section with full-width bar layout.

#### Scenario: Visual presentation
- **WHEN** viewing the Founder section
- **THEN** it displays 80x80 avatar with primary border
- **AND** shows name, role, code comments, and GitHub handle
- **AND** has left primary accent line (3px)

### Requirement: TeamSection
The system SHALL provide a Team section with member grid.

#### Scenario: Grid layout
- **WHEN** viewing on desktop
- **THEN** it shows grid of member cards with hover effects
- **AND** cards have border-color change and translateY on hover

#### Scenario: Single member
- **WHEN** only one member exists
- **THEN** grid uses single column with max-w-xs, left-aligned

### Requirement: StackSection
The system SHALL provide a Stack section with package.json display.

#### Scenario: Syntax highlighting
- **WHEN** viewing the Stack section
- **THEN** it displays package.json with syntax highlighting
- **AND** keys use primary, values use secondary, comments use muted italic

### Requirement: OpenRolesSection
The system SHALL provide an Open Roles section with terminal window style.

#### Scenario: Visual style
- **WHEN** viewing the section
- **THEN** it has primary title bar with "+─── OPEN ROLES ───+"
- **AND** content area has slight primary-tinted background
- **AND** shows needs array and CTA link

### Requirement: ContactSection
The system SHALL provide a Contact section with shell script style.

#### Scenario: Interactive links
- **WHEN** hovering over URL rows
- **THEN** they show hover background and translateX effect
- **AND** URLs are clickable with proper styling

### Requirement: NewsletterSection
The system SHALL provide a Newsletter section with terminal input style.

#### Scenario: Input styling
- **WHEN** viewing the input
- **THEN** it has ">" prefix and bottom border only
- **AND** has SUBSCRIBE button

### Requirement: Scroll Animations
The system SHALL provide scroll-triggered animations for all sections.

#### Scenario: Reduced motion
- **WHEN** user prefers reduced motion
- **THEN** all animations are disabled

## MODIFIED Requirements

### Requirement: About Page Layout
The existing About page layout SHALL be changed from fixed height to scrollable.

**Previous**: 70vh Canvas + 30vh Panel, no scroll
**New**: Canvas fixed, content sections scrollable below

## REMOVED Requirements

None - this is an addition to existing layout.
