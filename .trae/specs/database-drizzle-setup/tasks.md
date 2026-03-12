# 任务列表

## 任务 1: 安装 Drizzle ORM 相关依赖

- [x] 1.1 安装 drizzle-orm 包
- [x] 1.2 安装 postgres 驱动包
- [x] 1.3 安装 drizzle-kit (用于迁移)
- [x] 1.4 安装 dotenv (用于环境变量)

## 任务 2: 创建 Docker 配置文件

- [x] 2.1 创建 docker-compose.yml 配置 PostgreSQL
- [x] 2.2 创建 .env.docker 文件 (包含数据库配置示例)
- [x] 2.3 更新 .gitignore 忽略数据库相关文件

## 任务 3: 配置 Drizzle ORM

- [x] 3.1 创建 drizzle.config.ts 配置文件
- [x] 3.2 创建 src/server/lib/db/schema.ts 表定义
- [x] 3.3 创建 src/server/lib/db/index.ts 数据库连接
- [ ] 3.4 创建数据库迁移脚本 (使用 push 模式代替)

## 任务 4: 创建种子数据

- [x] 4.1 从现有代码提取挑战数据
- [x] 4.2 创建 seed 脚本导入分类数据
- [x] 4.3 创建 seed 脚本导入挑战数据

## 任务 5: 更新应用代码

- [x] 5.1 创建数据库查询工具函数
- [x] 5.2 更新挑战页面从数据库读取数据
- [x] 5.3 添加数据库连接错误处理

## 任务依赖

- [任务 2] 依赖 [任务 1] - Docker 需要数据库驱动
- [任务 3] 依赖 [任务 1] - Drizzle 配置需要相关包
- [任务 4] 依赖 [任务 3] - 种子数据需要数据库连接
- [任务 5] 依赖 [任务 3] - 应用代码需要数据库连接
