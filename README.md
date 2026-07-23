# GienHarness · replay 分支

分支：`replay/4p12s-from-design`

## 当前状态

**4p12s 重跑进行中；⑧ 执行开发已完成（单元测试通过）。** 当前焦点：**⑨ 集成测试**。

| 路径 | 说明 |
|------|------|
| [`designdoc/整体设计.md`](designdoc/整体设计.md) | **唯一业务设计**（含固定技术栈） |
| [`designdoc/delivery/delivery-state.md`](designdoc/delivery/delivery-state.md) | **十二步交付状态**（真相源） |
| [`designdoc/delivery/harness-alignment-status.md`](designdoc/delivery/harness-alignment-status.md) | Harness 方法论对齐状态 |
| [`designdoc/specs/raw-input.md`](designdoc/specs/raw-input.md) | 原始业务输入登记 |
| [`designdoc/specs/requirements-register.md`](designdoc/specs/requirements-register.md) | 需求登记表（② 产出） |
| [`designdoc/specs/prd.md`](designdoc/specs/prd.md) | 产品需求文档 PRD（③ 产出） |
| [`designdoc/specs/user-stories.md`](designdoc/specs/user-stories.md) | 用户故事（④ 产出） |
| [`designdoc/specs/design.md`](designdoc/specs/design.md) | 技术设计（⑤ 产出） |
| [`designdoc/verification/verification-plan.md`](designdoc/verification/verification-plan.md) | 验证计划（⑥ 产出） |
| [`designdoc/specs/tasks.md`](designdoc/specs/tasks.md) | 开发任务索引（⑦ 产出） |
| [`apps/`](apps/) / [`packages/`](packages/) | **业务实现**（⑧ 产出） |
| [`designdoc/templates/`](designdoc/templates/) | 空白交付物模板 |
| [`.gientech/skills/`](.gientech/skills/) | 4p12s / GienSpec / Superpower |
| [`.gientech/rules/`](.gientech/rules/) | TDD、门禁、安全、时区、命名 |
| [`.gientech/wiki/`](.gientech/wiki/) | 架构 Wiki（① 最小占位 4 页） |
| [`AGENTS.md`](AGENTS.md) | 精简开发规范 |

**尚未完成**：集成测试证据（⑨）、E2E（⑩）、部署记录（⑫）。本地需 PostgreSQL + `.env`（见 `.env.example`）。

## 本地开发（⑧ 后）

```bash
cp .env.example .env   # 填入 DATABASE_URL / JWT_SECRET
npm install
npm run build -w @gienharness/domain -w @gienharness/infrastructure
npm run db:migrate
npm run db:seed
npm run dev:api          # :3100
npm run dev:web          # :5173
npm test                 # 单元测试
```

Seed 账号：`test@example.com` / `password123`