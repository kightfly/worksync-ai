# AI Harness 开发规范（replay 分支）

## 项目概述

本分支 `replay/4p12s-from-design` 用于 **从整体设计重跑 4p12s**：业务唯一输入为 [`designdoc/整体设计.md`](designdoc/整体设计.md)。

初始**无**业务实现代码；脚手架与实现在 ⑧ 起按整体设计「固定技术栈」创建。

本仓库以 **GienCoder 4p12s（四阶十二步）** 为主链路；准备/设计段可叠加 **GienSpec**；开发执行段遵循 **Superpower** 最小纪律。

## 技术栈（固定 · 详见整体设计 §2）

| 层 | 技术 |
|----|------|
| 前端 | React 19 + TypeScript + Vite + React Router |
| 表单 | react-hook-form + zod |
| 后端 | Node.js + TypeScript + Fastify |
| DB | PostgreSQL + Drizzle ORM |
| 测试 | Vitest + Testing Library + Playwright |
| 质量 | ESLint + Prettier + TypeScript strict |

## Agent 开场必读

1. 本文档 `AGENTS.md`
2. [`designdoc/整体设计.md`](designdoc/整体设计.md) — **业务输入**
3. `designdoc/delivery/delivery-state.md` — 十二步状态
4. 当前步骤对应 `.gientech/skills/*.md`
5. `.gientech/rules/*.mdc`（尤其 `4p12s-gates.mdc`、`tdd.mdc`）

**原则：不能靠对话记忆推进，必须文件化。**

## 三大原则（稳 · 效 · 控）

| 原则 | 含义 |
|------|------|
| **稳** | 先规划再动手；需求结构化；层层转化不失真 |
| **效** | 每步有明确输入 / 输出 / 完成标准 |
| **控** | TDD 先行；单测 → 集成 → E2E → Git → 部署 |

## 四阶十二步（摘要）

| 阶段 | 步骤 |
|------|------|
| 一·准备 | ① 流程初始化 → ② 业务需求确认 → ③ 生成 PRD |
| 二·设计 | ④ 用户故事 → ⑤ 技术设计 → ⑥ 验证计划 |
| 三·开发 | ⑦ 任务拆分 → ⑧ 执行开发 → ⑨ 集成测试 |
| 四·验证交付 | ⑩ E2E → ⑪ Git → ⑫ 部署 |

Skills：`.gientech/skills/4p12s-*.md`  
门禁：`.gientech/rules/4p12s-gates.mdc`

### ⑧ Superpower 纪律

```
brainstorming → writing-plans → test-driven-development
  → systematic-debugging → verification-before-completion
```

同一 TASK 连续 5 次红灯 → 人必须介入。

## 模块边界

1. UI → 仅 API，不直连 DB  
2. Application → Domain + Infrastructure  
3. Domain → 无外部依赖  
4. Infrastructure → Repository / Drizzle  

## 语言约定

- 代码、UI、种子数据、错误提示：**日文**
- Harness / delivery 文档：**中文可**

## Harness 入口

见 [`.gientech/README.md`](.gientech/README.md)：`wiki/`、`skills/`、`rules/`。
