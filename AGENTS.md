# AI Harness 开发规范

## 项目概述

本项目是一个「勤怠・タスク管理」迷你后台系统，用于练习 **AI Agent 在约束下可靠交付**。

本仓库以 **GienCoder 4p12s（四阶十二步）** 为主链路；准备/设计段可落到 **GienSpec** 产物；开发执行段遵循 **Superpower** 最小纪律。详见 `学习资料.md` §7–§10。

## 技术栈（固定）

| 层 | 技术 | 版本/说明 |
|----|------|----------|
| 前端 | React 19 + TypeScript + Vite + React Router | 固定 |
| UI 组件 | shadcn/ui | 已选定，不再更换 |
| 表单 | react-hook-form + zod | 必填・格式校验 |
| 后端 | Node.js + TypeScript + Fastify | 已选定，不再更换 |
| DB | PostgreSQL + Drizzle ORM | 已选定，不再更换 |
| 测试 | Vitest + Testing Library + Playwright (E2E) | E2E 为交付门禁 |
| 质量 | ESLint + Prettier + React Doctor + TypeScript strict | CI 含 lint |

## Agent 开场必读（每次会话）

1. 本文档 `AGENTS.md`
2. `designdoc/delivery/delivery-state.md` — 十二步状态（当前做什么、阻塞项）
3. `designdoc/delivery/harness-alignment-status.md` — Harness 对齐进度（下一步补齐什么）
4. 当前步骤对应的 `skills/*.md`
5. `.cursor/rules/*.mdc`（尤其 `4p12s-gates.mdc`、`tdd.mdc`）

**原则：不能靠对话记忆推进，必须文件化。** 状态与交付物以仓库内 Markdown 为准。

## 三大原则（稳 · 效 · 控）

| 原则 | 含义 |
|------|------|
| **稳** | 先规划再动手；需求结构化；层层转化不失真 |
| **效** | 每步有明确输入 / 输出 / 完成标准；可追溯 |
| **控** | TDD 先行；单测 → 集成 → E2E → Git → 部署，逐级门禁 |

## 三套方法论怎么配合

| 方法 | 层次 | 本仓库用法 |
|------|------|------------|
| **4p12s** | 端到端交付主链路 | 状态表 + 十二步 Skills + 门禁 |
| **GienSpec（最小集）** | 编码前规格驱动 | specify / clarify / plan / tasks / analyze |
| **Superpower（最小集）** | 编码中可控工作流 | brainstorming / writing-plans / TDD / systematic-debugging / verification-before-completion |

复杂功能推荐叠加：

```
GienSpec（讲清楚要做什么、怎么拆）
  → Superpower（按工程流程安全实现）
  → 4p12s ⑨–⑫（集成 / E2E / Git / 部署门禁）
```

## 四阶十二步（主流程）

| 阶段 | 步骤 | Skill（仓库根 `skills/`） | 主要交付物 |
|------|------|---------------------------|------------|
| **一·准备** | ① 流程初始化 | `4p12s-delivery-orchestrator.md` | `delivery-state.md`、Harness/Wiki、测试护栏 |
| | ② 业务需求确认 | `4p12s-requirements.md`（可叠加 `gienspec-specify` / `clarify`） | `requirements-register.md` |
| | ③ 生成 PRD | `4p12s-prd.md` | `prd.md` / `software-requirements.md` |
| **二·设计** | ④ 用户故事 | `4p12s-user-stories.md` | `user-stories.md`、验收场景矩阵 |
| | ⑤ 技术设计 | `4p12s-technical-design.md`（可叠加 `gienspec-plan`） | `design.md`、前后端设计、接口契约 |
| | ⑥ 验证计划 | `4p12s-verification-plan.md` | `verification-plan.md` |
| **三·开发** | ⑦ 任务拆分 | `4p12s-implementation-tasks.md`（可叠加 `gienspec-tasks` / `analyze`） | `tasks/index.md`、`TASK-xxx.md` |
| | ⑧ 执行开发 | `4p12s-implementation-execution.md` + Superpower 最小集 | 代码、红/绿灯证据、TASK 回写 |
| | ⑨ 集成测试 | `4p12s-integration-test.md` | `verification-result.md`（集成段） |
| **四·验证交付** | ⑩ E2E 测试 | `4p12s-e2e-test.md` | E2E report（禁 Mock 全链路） |
| | ⑪ Git 提交推送 | `4p12s-git-push.md` | commit / MR，关联 TASK 与测试摘要 |
| | ⑫ 测试环境部署 | `4p12s-deployment-execution.md` | `deploy-log.md`、可访问环境 |

### 逐步门禁（摘要）

- ① 无测试护栏 / 状态表不完整 → **不进入需求实现**
- ② 边界或验收场景不清 → **不进 PRD**
- ③ 规格未确认 → **不进用户故事**
- ④ 粒度过大或缺异常/边界 → **不进技术设计**
- ⑤ 契约/数据模型不清 → **不拆任务**
- ⑥ 关键风险未覆盖或禁 Mock 范围不清 → **不进 TDD**
- ⑦ 不能独立验证或缺验收 → **不进实现**
- ⑧ **同一 Task 连续 5 次红灯 → 人必须介入**
- ⑨ 只用 Mock / 只跑单测 = **假完成**，不得部署
- ⑩ 发布前 E2E 必须禁用 Mock
- ⑪ 需求/设计/开发/测试未全过 → **不推送宣称完成**
- ⑫ 必须有流水线/部署记录与可访问证据

完整检查表见 `.cursor/rules/4p12s-gates.mdc`。

### ⑧ 执行时的 Superpower 纪律（最小集）

```
brainstorming（必要时）
  → writing-plans
  → test-driven-development（红 → 绿 → 重构）
  → systematic-debugging（修 Bug 时）
  → verification-before-completion（无新鲜证据不宣称完成）
```

## 目录结构

```
├── apps/
│   ├── web/                         # 前端 (React + Vite)
│   └── api/                         # 后端 (Fastify)
├── packages/
│   ├── domain/                      # 领域层
│   ├── application/                 # 应用服务层
│   ├── infrastructure/              # 基础设施层
│   └── shared/                      # 共享代码
├── designdoc/
│   ├── delivery/                    # 交付状态与对齐进度
│   │   ├── delivery-state.md        # 十二步状态表（必维护）
│   │   └── harness-alignment-status.md
│   ├── specs/                       # 规格与设计
│   │   ├── requirements-register.md # ②
│   │   ├── prd.md                   # ③
│   │   ├── user-stories.md          # ④
│   │   ├── requirements.md          # 过渡索引
│   │   ├── design.md                # ⑤
│   │   ├── tasks.md                 # ⑦ 索引
│   │   └── tasks/TASK-xxx.md        # 单任务
│   ├── verification/                # ⑥⑨⑩ 验证产物
│   └── templates/                   # 交付物空白模板
├── skills/                          # 技能文件（仓库根）
├── .cursor/rules/                   # Cursor 规则
├── .gientech/wiki/                  # 知识库 Wiki
├── .github/workflows/ci.yml         # CI：typecheck / test / e2e
└── package.json
```

## 模块边界规则

1. **UI 层** (`apps/web/`) — 只依赖应用服务接口；不直接访问数据层；须通过 React Doctor
2. **应用服务层** (`packages/application/`) — 编排领域与基础设施；事务边界；不依赖 UI
3. **领域层** (`packages/domain/`) — 纯业务逻辑；无外部依赖；可独立测试
4. **数据访问层** (`packages/infrastructure/`) — 实现 Repository；封装 Drizzle/PostgreSQL；禁 N+1

## 质量要求

### 测试金字塔与门禁

- 单元测试：业务逻辑必测，覆盖率目标 80%+
- 集成测试：真实服务/DB 范围按验证计划；禁用 Mock 节点须写明
- E2E：交付前必过；可薄（主流程冒烟），但不可缺
- **未通过测试的修改不得宣称完成**

### 表单 / 时区 / SQL

- 表单：zod 必填与格式校验；日文错误提示
- 时区：DB 存 UTC，展示 Asia/Tokyo（见 `timezone.mdc`）
- SQL：索引可审查；禁 N+1；复杂查询附说明

## NPM Scripts

```bash
# 根目录
npm run test          # 运行所有单元测试
npm run test:e2e      # Playwright E2E 冒烟
npm run test:watch    # 监视模式
npm run lint          # ESLint（需已配置 eslint；CI 当前跑 typecheck/test/e2e）
npm run format        # Prettier
npm run typecheck     # TypeScript
npm run doctor        # React Doctor

# 前端 / 后端
npm run dev -w apps/web
npm run dev -w apps/api
npm run db:migrate
npm run db:seed
```

## 变更清单模板

每个 Phase / 十二步门禁通过后输出：

```markdown
## Phase / Step 变更清单

### 新增文件
- path/to/file

### 修改文件
- path/to/file: 说明

### 通过的测试 / 证据
```bash
npm run test
# 或 E2E / 部署记录路径
```

### 未决问题
- 问题 + 思路
```

并回写 `designdoc/delivery/delivery-state.md` 与（若为 Harness 对齐工作）`harness-alignment-status.md`。

## 技能文件索引

### 4p12s（十二步 · 已落地）

| 文件 | 状态 |
|------|------|
| `skills/4p12s-delivery-orchestrator.md` | ✅ |
| `skills/4p12s-requirements.md` | ✅ |
| `skills/4p12s-prd.md` | ✅ |
| `skills/4p12s-user-stories.md` | ✅ |
| `skills/4p12s-technical-design.md` | ✅ |
| `skills/4p12s-verification-plan.md` | ✅ |
| `skills/4p12s-implementation-tasks.md` | ✅ |
| `skills/4p12s-implementation-execution.md` | ✅ |
| `skills/4p12s-integration-test.md` | ✅ |
| `skills/4p12s-e2e-test.md` | ✅ |
| `skills/4p12s-git-push.md` | ✅ |
| `skills/4p12s-deployment-execution.md` | ✅ |

产物模板：`designdoc/templates/*.template.md`

### GienSpec 最小集（✅ 已落地）

| 文件 | 状态 | 用途 |
|------|------|------|
| `skills/gienspec-specify.md` | ✅ | 想法 → 可讨论规格 |
| `skills/gienspec-clarify.md` | ✅ | 澄清模糊点 |
| `skills/gienspec-plan.md` | ✅ | 实现计划 |
| `skills/gienspec-tasks.md` | ✅ | 任务拆解 |
| `skills/gienspec-analyze.md` | ✅ | 规格/计划/任务一致性 |

宪章与 init 由 `AGENTS.md` + `4p12s-delivery-orchestrator` 承担（最小集不单独建 skill）。

### Superpower 最小集（✅ 已落地）

| 文件 | 状态 | 用途 |
|------|------|------|
| `skills/brainstorming.md` | ✅ | 澄清边界与完成标准 |
| `skills/writing-plans.md` | ✅ | 小步骤计划 |
| `skills/test-driven-development.md` | ✅ | TDD 入口（详规 → `tdd.md`） |
| `skills/systematic-debugging.md` | ✅ | 根因调试 |
| `skills/verification-before-completion.md` | ✅ | 完成前证据检查 |

### 横切角色技能（保留）

- `skills/principal-engineer.md` — 质量与流程总控
- `skills/architect.md` — 架构边界（挂 ⑤）
- `skills/tdd.md` — TDD（挂 ⑧；E2E 为交付门禁，不可缺）
- `skills/react-doctor.md` — 前端质量（挂 ⑧）
- `skills/database.md` — 数据与 SQL（挂 ⑤/⑧）

## 规则文件索引

- `.cursor/rules/tdd.mdc` — TDD 强制
- `.cursor/rules/naming.mdc` — 命名规范
- `.cursor/rules/security.mdc` — 安全规范
- `.cursor/rules/timezone.mdc` — 时区处理
- `.cursor/rules/4p12s-gates.mdc` — 十二步门禁

## 语言约定

- 代码、UI 文案、种子数据、错误提示：**日文**
- 与 Agent 的对话与 Harness 流程文档：**中文可**（本文件与 delivery 状态用中文维护）
