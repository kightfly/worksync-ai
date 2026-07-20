# AI Harness - 勤怠・タスク管理

A mini task & attendance management system for practicing AI Agent delivery under constraints.

## 项目概述

本项目用于练习 **AI Agent 在约束下可靠交付**，实现一个日文界面的勤务任务管理后台系统。

### 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 19 + TypeScript + Vite + React Router |
| UI 组件 | shadcn/ui |
| 表单 | react-hook-form + zod |
| 后端 | Node.js + TypeScript + Fastify |
| DB | PostgreSQL + Drizzle ORM |
| 测试 | Vitest + Testing Library + Playwright (E2E) |
| 质量 | ESLint + Prettier + React Doctor + TypeScript strict |

## 快速开始

### 环境要求

- Node.js >= 20.0.0
- PostgreSQL 15+
- npm >= 10.0.0

### 安装

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 配置数据库连接

# 数据库迁移
npm run db:migrate

# 种子数据（可选）
npm run db:seed
```

### 开发

```bash
# 启动开发服务器（前后端）
npm run dev

# 单独启动
npm run dev -w apps/web    # 前端
npm run dev -w apps/api    # 后端
```

### 测试

```bash
# 运行所有测试
npm run test

# 监视模式
npm run test:watch

# 生成覆盖率报告
npm run test -- --coverage
```

### 质量检查

```bash
# TypeScript 类型检查
npm run typecheck

# ESLint 检查
npm run lint

# Prettier 格式化
npm run format

# React Doctor 检查
npm run doctor
```

### 构建

```bash
# 生产构建
npm run build

# 启动生产服务器
npm run start -w apps/api
```

### CI / 测试环境部署

GitHub Actions（`.github/workflows/ci.yml`）：

| Job | 内容 | 触发 |
|-----|------|------|
| **quality** | lint → typecheck → unit test → E2E 冒烟 | push / PR / 手动 |
| **deploy-test** | build → 上传 web/api Artifact → 部署 Summary | `main`/`master` push 或 `workflow_dispatch` |

本地等价检查：

```bash
npm run lint && npm run typecheck && npm run test && npm run test:e2e && npm run build
```

部署证据：Actions 运行页的 **Deploy Test Environment** job Summary → 复制到 `designdoc/delivery/deploy-log.md`（4p12s ⑫）。

## 目录结构

```
├── apps/
│   ├── web/                    # 前端应用 (React + Vite)
│   └── api/                    # 后端应用 (Fastify)
├── packages/
│   ├── domain/                 # 领域层（实体、值对象）
│   ├── application/            # 应用服务层
│   ├── infrastructure/         # 基础设施层（DB、外部服务）
│   └── shared/                 # 共享代码（类型、工具）
├── designdoc/
│   └── specs/
│       ├── requirements.md     # 需求规格
│       ├── design.md           # 设计文档
│       └── tasks.md            # 任务清单
├── skills/                     # 技能文件
├── .cursor/rules/              # Cursor 规则
├── .github/workflows/          # CI/CD
└── package.json                # 根配置
```

## 开发流程

1. **需求理解** - 阅读 `AGENTS.md` 和需求文档
2. **设计** - 阅读设计文档，理解模块边界
3. **任务** - 按 `designdoc/specs/tasks.md` 执行
4. **TDD** - 先写测试 → 实现 → 重构
5. **验证** - 运行测试和质量检查

## 质量要求

- 单元测试覆盖率：80%+
- TypeScript strict 模式
- 所有表单必填校验
- 时区处理：UTC 存储，Asia/Tokyo 展示
- SQL 可审查、可优化
- React Doctor 检查通过

## 文档

- [AGENTS.md](./AGENTS.md) - 开发规范
- [需求规格](./designdoc/specs/requirements.md)
- [设计文档](./designdoc/specs/design.md)
- [任务清单](./designdoc/specs/tasks.md)

## License

MIT
