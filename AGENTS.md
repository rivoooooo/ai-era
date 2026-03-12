# AGENTS.md - 项目指南

## 项目概述

- **项目名称**: ai-era-web-dev-skills
- **项目类型**: Next.js Web 应用
- **核心功能**: AI 时代前端开发者技能挑战平台
- **目标用户**: 开发者

## 技术栈

- **框架**: Next.js 16.1.6
- **语言**: TypeScript
- **包管理器**: bun
- **AI SDK**: @google/genai
- **UI**: React 19 + Tailwind CSS 4
- **样式**: CSS Modules / Tailwind CSS
- **数据库**: PostgreSQL + Drizzle ORM

## 项目结构

```
src/
├── app/                        # Next.js App Router
│   ├── [locale]/
│   │   └── challenge/          # 挑战页面
│   │       └── [slug]/        # 挑战详情页
│   └── provider/               # AI Provider 页面
├── components/                 # React 组件
├── lib/                        # 工具函数
├── server/lib/db/             # 数据库相关
│   ├── schema.ts              # 表定义
│   ├── index.ts               # 数据库连接
│   ├── queries.ts             # 查询函数
│   └── seed.ts                # 种子数据
└── messages/                   # 国际化消息
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `bun run dev` | 启动开发服务器 |
| `bun run build` | 构建生产版本 |
| `bun run start` | 启动生产服务器 |
| `bun run lint` | 运行 ESLint 检查 |
| `npx tsc --noEmit` | TypeScript 类型检查 |

## 数据库命令

| 命令 | 说明 |
|------|------|
| `docker run -d --name api-test-db -e POSTGRES_DB=api_test -e POSTGRES_USER=api_user -e POSTGRES_PASSWORD=api_password -p 5432:5432 postgres:15-alpine` | 启动 PostgreSQL 容器 |
| `bun run db:push` | 推送 schema 到数据库 |
| `bun run db:seed` | 导入种子数据 |
| `bun run db:generate` | 生成迁移文件 |

## 开发规范

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 TypeScript 严格模式
- 遵循 React 19 最佳实践
- 使用 Tailwind CSS 进行样式设计
- **遵循设计系统风格指南**: 引用 `prompt.xml` 文件

### 文件命名

- 组件文件使用 PascalCase (如 `GooglePage.tsx`)
- 工具函数使用 camelCase (如 `utils.ts`)
- 配置文件使用小写连字符 (如 `eslint.config.mjs`)

### 代码风格

- 使用函数式组件
- 使用 TypeScript 类型定义
- 使用 ESLint 配置的规则

## 环境配置

### 必需的环境变量

创建 `.env.local` 文件：

```bash
# Google AI API Key
GOOGLE_API_KEY=your_api_key_here

# Database
DATABASE_URL=postgres://api_user:api_password@localhost:5432/api_test
```

### Docker PostgreSQL 启动

```bash
# 启动 PostgreSQL 容器
docker run -d --name api-test-db \
  -e POSTGRES_DB=api_test \
  -e POSTGRES_USER=api_user \
  -e POSTGRES_PASSWORD=api_password \
  -p 5432:5432 \
  postgres:15-alpine

# 或使用 docker-compose
docker-compose up -d
```

### Google AI SDK 使用示例

```typescript
import { GoogleGenerativeAI } from '@google/genai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const result = await model.generateContent('Hello, how are you?');
console.log(result.response.text());
```

## 路由结构

- `/` - 首页
- `/[locale]/challenge` - 挑战列表页
- `/[locale]/challenge/[slug]` - 挑战详情页
- `/provider/google` - Google AI 测试页面

## 数据库架构

### 表结构

#### categories 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | VARCHAR(100) | 分类名称 (唯一) |
| description | TEXT | 分类描述 |
| icon | VARCHAR(50) | 分类图标 |
| display_order | INTEGER | 显示顺序 |
| created_at | TIMESTAMP | 创建时间 |

#### challenges 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| category_id | UUID | 外键 (关联 categories) |
| slug | VARCHAR(100) | URL 标识 (唯一) |
| name | VARCHAR(255) | 挑战名称 |
| description | TEXT | 挑战描述 |
| difficulty | VARCHAR(20) | 难度等级 |
| created_at | TIMESTAMP | 创建时间 |

## 注意事项

1. 项目使用 bun 作为包管理器，请勿使用 npm 或 yarn
2. 确保在运行前安装依赖：`bun install`
3. 开发服务器默认运行在 `http://localhost:3000`
4. 数据库容器默认端口: 5432

---

> **设计系统风格指南**: 详见 [prompt.xml](./prompt.xml)
