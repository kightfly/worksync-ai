# 4p12s 十二步 · GienCoder 工作任务模板

> **用途**：复制到 GienCoder「创建工作任务」表单（标题 + 详细描述）  
> **格式**：用户故事 + Skill + 交付物 + 验收标准 + 完成定义  
> **真相源**：`AGENTS.md`、`delivery-state.md`、`.cursor/rules/4p12s-gates.mdc`  
> **最近更新**：2026-07-21

## 使用说明

1. 按 **① → ⑫** 顺序创建任务；前一步 `done` 再开下一步。
2. **标题**复制到「任务标题」框（≤100 字）。
3. **详细描述**整块复制到「详细描述」框（支持 Markdown）。
4. 新迭代可从 ② 或 ⑦ 重新开一轮；全量重跑从 ① 开始。

---

## 阶段一 · 准备

### ① 流程初始化

**任务标题**

```
① 流程初始化
```

**详细描述**

```
作为 Harness 项目负责人，我需要完成 4p12s 流程初始化，以便建立可追踪的交付护栏与状态真相源。

【Skill】4p12s-delivery-orchestrator

【主要交付物】
- designdoc/delivery/delivery-state.md
- .gientech/wiki/ 基础导航
- CI / Playwright / 测试脚本护栏

【验收标准】
- delivery-state.md 十二步状态表已建立
- AGENTS.md、skills/、.cursor/rules/ 可被 Agent 读取
- npm run test / typecheck 可执行
- 无测试护栏时不进入需求实现

【完成定义】
状态表 ① 标记 done，阻塞项为空或已记录。
```

---

### ② 业务需求确认

**任务标题**

```
② 业务需求确认
```

**详细描述**

```
作为产品负责人，我需要确认并结构化业务需求边界，以便后续 PRD 与用户故事不失真。

【Skill】4p12s-requirements（可叠加 gienspec-specify / clarify）

【主要交付物】
- designdoc/specs/requirements-register.md

【验收标准】
- 业务规则（BR-*）与验收条件（AC）已登记
- 边界、异常、待决问题（Q-*）已标注开/闭状态
- 需求粒度适合进入 PRD，无重大模糊点

【完成定义】
requirements-register.md 已确认，delivery-state ② 标记 done。
```

---

### ③ 生成 PRD

**任务标题**

```
③ 生成 PRD
```

**详细描述**

```
作为产品规格负责人，我需要基于需求登记表生成 PRD，以便团队对功能范围与优先级形成一致理解。

【Skill】4p12s-prd

【主要交付物】
- designdoc/specs/prd.md

【验收标准】
- 功能范围、非功能要求、状态机/业务规则已写入
- 与 requirements-register.md 一致，无未闭合冲突
- 版本号与变更摘要已更新

【完成定义】
prd.md 经确认，delivery-state ③ 标记 done。
```

---

## 阶段二 · 设计

### ④ 用户故事

**任务标题**

```
④ 用户故事
```

**详细描述**

```
作为需求分析者，我需要将 PRD 拆解为用户故事与验收场景，以便设计与开发可按场景验证。

【Skill】4p12s-user-stories

【主要交付物】
- designdoc/specs/user-stories.md

【验收标准】
- 用户故事（US-*）覆盖主路径与边界/异常
- 每条故事含 Given-When-Then 或等价验收场景
- 粒度适合进入技术设计，无过大史诗故事

【完成定义】
user-stories.md 已确认，delivery-state ④ 标记 done。
```

---

### ⑤ 技术设计

**任务标题**

```
⑤ 技术设计
```

**详细描述**

```
作为架构师，我需要完成前后端技术设计与接口契约，以便任务拆分与 TDD 有明确实现依据。

【Skill】4p12s-technical-design（可叠加 gienspec-plan）

【主要交付物】
- designdoc/specs/design.md
- API 契约、数据模型、错误码约定

【验收标准】
- 模块边界符合 AGENTS.md（domain / application / infrastructure / web）
- 状态机、时区（UTC 存 / Tokyo 展示）、鉴权方案已明确
- 契约与 user-stories 可追溯

【完成定义】
design.md 已确认，delivery-state ⑤ 标记 done。
```

---

### ⑥ 验证计划

**任务标题**

```
⑥ 验证计划
```

**详细描述**

```
作为测试负责人，我需要制定验证计划与测试矩阵，以便集成/E2E 阶段有禁 Mock 范围与门禁依据。

【Skill】4p12s-verification-plan

【主要交付物】
- designdoc/verification/verification-plan.md

【验收标准】
- 单测 / 集成 / E2E 范围与 V-* / E2E-* ID 已定义
- 禁 Mock 节点（真 DB、真 API、真浏览器）已写明
- 关键风险与最小 E2E 主路径已覆盖

【完成定义】
verification-plan.md 已确认，delivery-state ⑥ 标记 done。
```

---

## 阶段三 · 开发

### ⑦ 任务拆分

**任务标题**

```
⑦ 任务拆分
```

**详细描述**

```
作为开发负责人，我需要将设计与验证计划拆分为可独立验证的 TASK，以便 TDD 按任务有序推进。

【Skill】4p12s-implementation-tasks（可叠加 gienspec-tasks / analyze）

【主要交付物】
- designdoc/specs/tasks.md
- designdoc/specs/tasks/TASK-xxx.md

【验收标准】
- 每个 TASK 可独立验证，含输入/输出/验收/测试命令
- 与 design.md、verification-plan.md 一致
- 依赖顺序清晰（如 domain → repository → API → 前端）

【完成定义】
tasks 索引与各 TASK 文件已就绪，delivery-state ⑦ 标记 done。
```

---

### ⑧ 执行开发

**任务标题**

```
⑧ 执行开发
```

**详细描述**

```
作为开发工程师，我需要按 TASK 以 TDD 方式实现功能并留下测试证据，以便代码质量可验证、可追溯。

【Skill】4p12s-implementation-execution + Superpower（TDD / verification-before-completion）

【主要交付物】
- 业务代码 + 单元/集成测试
- TASK-xxx.md 回写（红→绿→重构证据）

【验收标准】
- 遵循 TDD：先写失败测试，再实现，再重构
- 同一 TASK 连续 5 次红灯须人工介入
- npm run test 通过；UI 文案与错误提示为日文
- 未通过测试不得宣称完成

【完成定义】
计划内 TASK 均已实现并回写，delivery-state ⑧ 标记 done。
```

---

### ⑨ 集成测试

**任务标题**

```
⑨ 集成测试
```

**详细描述**

```
作为质量工程师，我需要执行真 DB + 真 API 集成测试并记录结果，以便确认后端与数据层在真实环境下可用。

【Skill】4p12s-integration-test

【主要交付物】
- designdoc/verification/verification-result.md（集成段）

【验收标准】
- 使用 Supabase PostgreSQL + Fastify 真服务，非 Mock 替代
- V-* 验证项按 verification-plan 执行并记录
- 鉴权拒绝、状态机非法迁移、时区等关键路径已覆盖
- 仅单测通过 ≠ 集成通过

【完成定义】
verification-result.md 集成结论已写入，delivery-state ⑨ 标记 done。
```

---

## 阶段四 · 验证提测 / 验证交付

### ⑩ E2E 测试

**任务标题**

```
⑩ E2E 测试
```

**详细描述**

```
作为 QA 工程师，我需要执行 Playwright 端到端主路径测试，以便验证真浏览器 + 真 Web + 真 API + 真 DB 全链路。

【Skill】4p12s-e2e-test

【主要交付物】
- apps/web/e2e/
- apps/web/playwright-report/

【验收标准】
- E2E 禁用 Mock，覆盖登录、受保护路由、任务主流程、打刻只读、登出等
- npm run test:e2e 通过
- E2E 结果回写 verification-result.md

【完成定义】
主路径 E2E 2+ passed，delivery-state ⑩ 标记 done。
```

---

### ⑪ Git 提交推送

**任务标题**

```
⑪ Git 提交推送
```

**详细描述**

```
作为交付负责人，我需要整理变更并提交推送到远程仓库，以便代码与测试证据可审计、可协作。

【Skill】4p12s-git-push

【主要交付物】
- Git commit / MR（关联 TASK 与测试摘要）

【验收标准】
- 需求/设计/开发/测试门禁均已通过后再推送
- Commit message 说明「为什么」，含测试摘要
- 不提交 .env.local 等密钥文件
- 远程 push 成功或阻塞原因已记录

【完成定义】
远程分支已更新，delivery-state ⑪ 标记 done。
```

---

### ⑫ 测试环境部署

**任务标题**

```
⑫ 测试环境部署
```

**详细描述**

```
作为运维/交付工程师，我需要将构建产物部署到测试环境并完成部署后冒烟，以便形成可追溯的交付闭环证据。

【Skill】4p12s-deployment-execution

【主要交付物】
- designdoc/delivery/deploy-log.md
- CI deploy-test Artifact 或等价部署记录

【验收标准】
- npm run build 成功（含 domain / infrastructure / web / api）
- 测试环境 URL 可访问（如 Web 5173 / API 3100）
- GET /health 正常；部署后 DEPLOY_SMOKE E2E 或等价冒烟通过
- deploy-log.md 含构建号、迁移、配置摘要（无密钥）、回滚方案

【完成定义】
deploy-log.md 已回写，delivery-state ⑫ 标记 done，本迭代交付闭环完成。
```

---

## 阶段对照表

| 阶段 | 名称 | 步骤 |
|------|------|------|
| 一 | 准备 | ① 流程初始化 → ② 业务需求确认 → ③ 生成 PRD |
| 二 | 设计 | ④ 用户故事 → ⑤ 技术设计 → ⑥ 验证计划 |
| 三 | 开发 | ⑦ 任务拆分 → ⑧ 执行开发 → ⑨ 集成测试 |
| 四 | 验证提测 / 验证交付 | ⑩ E2E 测试 → ⑪ Git 提交推送 → ⑫ 测试环境部署 |

## 相关文档

- [`delivery-state.md`](./delivery-state.md) — 十二步进度真相源
- [`AGENTS.md`](../../AGENTS.md) — 项目规范与 Skill 索引
- [`designdoc交付物指南.md`](../../.gientech/wiki/designdoc交付物指南.md) — 交付物路径说明
