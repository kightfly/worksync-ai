# 交付流程与 Skills

> **文档类型**：流程指引  
> **实现状态**：✅ 与仓库 `.gientech/skills/`、`AGENTS.md` 一致  
> **最后核对**：2026-07-21  
> **真相源**：[`AGENTS.md`](../../AGENTS.md) | [`.gientech/skills/`](../skills/)  
> **审查跟踪**：[`wiki-audit-status.md`](../../designdoc/delivery/wiki-audit-status.md)

## 概述

本仓库以 **四阶十二步（4p12s）** 为主链路交付产品；准备/设计段可叠加 **GienSpec 最小集**；开发执行段遵循 **Superpower 最小纪律**。技能文件统一在 **`.gientech/skills/`**（与 Wiki、Rules 同属 `.gientech/` Harness 目录）。

**原则：不能靠对话记忆推进，必须文件化。** 进度以 [`delivery-state.md`](../../designdoc/delivery/delivery-state.md) 为准。

## 四阶十二步与 Skill 映射

| 阶段 | # | 步骤 | Skill 文件 | 主要交付物 |
|------|---|------|------------|------------|
| **一·准备** | ① | 流程初始化 | `4p12s-delivery-orchestrator.md` | `delivery-state.md`、Wiki、测试护栏 |
| | ② | 业务需求确认 | `4p12s-requirements.md` | `specs/requirements-register.md` |
| | ③ | 生成 PRD | `4p12s-prd.md` | `specs/prd.md` |
| **二·设计** | ④ | 用户故事 | `4p12s-user-stories.md` | `specs/user-stories.md` |
| | ⑤ | 技术设计 | `4p12s-technical-design.md` | `specs/design.md` |
| | ⑥ | 验证计划 | `4p12s-verification-plan.md` | `verification/verification-plan.md` |
| **三·开发** | ⑦ | 任务拆分 | `4p12s-implementation-tasks.md` | `specs/tasks/`、`TASK-xxx.md` |
| | ⑧ | 执行开发 | `4p12s-implementation-execution.md` | 代码、测试证据 |
| **四·验证交付** | ⑨ | 集成测试 | `4p12s-integration-test.md` | `verification-result.md`（集成段） |
| | ⑩ | E2E 测试 | `4p12s-e2e-test.md` | `apps/web/e2e/` 报告 |
| | ⑪ | Git 提交推送 | `4p12s-git-push.md` | commit / MR |
| | ⑫ | 测试环境部署 | `4p12s-deployment-execution.md` | `deploy-log.md`、可访问环境 |

完整门禁检查表： [`.gientech/rules/4p12s-gates.mdc`](../rules/4p12s-gates.mdc)

## GienSpec 最小集（编码前）

| Skill | 用途 | 典型叠加步骤 |
|-------|------|--------------|
| `gienspec-specify.md` | 想法 → 可讨论规格 | ② 前后 |
| `gienspec-clarify.md` | 澄清模糊点 | ②③ |
| `gienspec-plan.md` | 实现计划 | ⑤ 前后 |
| `gienspec-tasks.md` | 任务拆解 | ⑦ |
| `gienspec-analyze.md` | 规格/计划/任务一致性 | ⑦ 后 |

## Superpower 最小集（编码中）

| Skill | 用途 | 典型叠加步骤 |
|-------|------|--------------|
| `brainstorming.md` | 澄清边界与完成标准 | ⑧ 前 |
| `writing-plans.md` | 小步骤计划 | ⑧ |
| `test-driven-development.md` | TDD 入口（详规 → `tdd.md`） | ⑧ |
| `systematic-debugging.md` | 根因调试 | ⑧ 修 Bug |
| `verification-before-completion.md` | 完成前证据检查 | ⑧⑨⑩ |

## 横切角色技能

| Skill | 用途 |
|-------|------|
| `principal-engineer.md` | 质量与流程总控 |
| `architect.md` | 架构边界（挂 ⑤） |
| `tdd.md` | TDD 纪律；**E2E 为交付门禁** |
| `react-doctor.md` | 前端质量（挂 ⑧） |
| `database.md` | 数据与 SQL（挂 ⑤/⑧） |

## 复杂功能推荐叠加顺序

```
GienSpec（讲清楚要做什么、怎么拆）
  → Superpower（按工程流程安全实现）
  → 4p12s ⑨–⑫（集成 / E2E / Git / 部署门禁）
```

## Agent 会话开场（必读顺序）

1. [`AGENTS.md`](../../AGENTS.md)
2. [`delivery-state.md`](../../designdoc/delivery/delivery-state.md)
3. [`harness-alignment-status.md`](../../designdoc/delivery/harness-alignment-status.md)（Harness 对齐工作时）
4. 当前步骤对应 `.gientech/skills/4p12s-*.md`
5. [`.gientech/rules/`](../rules/)（尤其 `4p12s-gates.mdc`、`tdd.mdc`）

## ⑧ 执行纪律（摘要）

```
brainstorming（必要时）
  → writing-plans
  → test-driven-development（红 → 绿 → 重构）
  → systematic-debugging（修 Bug 时）
  → verification-before-completion（无新鲜证据不宣称完成）
```

**同一 TASK 连续 5 次红灯 → 人必须介入**（见 `AGENTS.md`）。

## 相关文档

- [designdoc 交付物指南](designdoc交付物指南.md) — 文件路径与模板
- [Wiki 维护约定](Wiki维护约定.md) — Wiki 与真相源同步
- [测试策略](测试策略.md) — 假完成定义、E2E 门禁
- [AI Harness](AI%20Harness.md) — Wiki 总索引
