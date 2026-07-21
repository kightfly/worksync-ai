# AI Harness - 勤怠・タスク管理

> **文档类型**：流程指引（Wiki 索引）  
> **实现状态**：🟡 项目护栏已就绪，业务功能 📋 设计中  
> **最后核对**：2026-07-21  
> **审查跟踪**：[`designdoc/delivery/wiki-audit-status.md`](../../designdoc/delivery/wiki-audit-status.md)

日文界面的「勤怠・タスク管理」迷你后台系统，用于练习 **AI Agent 在约束下可靠交付**。

---

## 仓库外必读（Agent / 开发者）

| 路径 | 说明 |
|------|------|
| [`AGENTS.md`](../../AGENTS.md) | 开发规范、四阶十二步、技术栈固定表 |
| [`designdoc/delivery/delivery-state.md`](../../designdoc/delivery/delivery-state.md) | 十二步进度真相源 |
| [`designdoc/delivery/harness-alignment-status.md`](../../designdoc/delivery/harness-alignment-status.md) | Harness 方法论对齐状态 |
| [`designdoc/delivery/wiki-audit-status.md`](../../designdoc/delivery/wiki-audit-status.md) | **Wiki 分步审查跟踪** |
| [`skills/`](../../skills/) | 4p12s（12）+ GienSpec（5）+ Superpower（5）+ 横切技能 |
| [`.cursor/rules/`](../../.cursor/rules/) | TDD、门禁、安全、时区、命名 |
| [`学习资料.md`](../../学习资料.md) | 四阶十二步 / Superpower / GienSpec 方法论 |

---

## 文档导航

### 入门

| 文档 | 说明 |
|------|------|
| [项目概述](项目概述.md) | 项目定位、**实现现状**、技术栈、4p12s 流程 |
| [快速开始](快速开始.md) | 环境要求、安装步骤、开发命令 |
| [技术栈与依赖](技术栈与依赖.md) | 前后端技术选型、版本号、依赖关系图 |

### 架构与设计

| 文档 | 说明 |
|------|------|
| [架构总览](架构总览.md) | 系统架构全景、模块边界、主要链路 |

### 开发规范

| 文档 | 说明 |
|------|------|
| [编码指引](编码指引.md) | 命名规范、代码结构、异常处理、时区、安全 |
| [测试策略](测试策略.md) | 测试金字塔、TDD、E2E 交付门禁、假完成定义 |

### API 与数据

| 文档 | 说明 |
|------|------|
| [API 参考](API参考/API参考.md) | API 总览、认证机制、端点索引（多数为 📋 设计契约） |
| [数据模型](数据模型/数据模型.md) | 实体、ER 图、业务规则（Schema 📋 待迁移） |

### 基础设施

| 文档 | 说明 |
|------|------|
| [基础设施与中间件](基础设施与中间件/基础设施与中间件.md) | 数据库、Repository、中间件、Drizzle |
| [业务逻辑层](业务逻辑层/业务逻辑层.md) | Auth / Task / Attendance Service（📋 设计） |
| [外部系统集成](外部系统集成/外部系统集成.md) | PostgreSQL、JWT 与环境变量 |

### 交付与 Harness 流程

| 文档 | 说明 |
|------|------|
| [交付流程与 Skills](交付流程与Skills.md) | 4p12s + GienSpec + Superpower 与 `skills/` 映射 |
| [designdoc 交付物指南](designdoc交付物指南.md) | `designdoc/` 路径、模板、十二步对照 |
| [Wiki 维护约定](Wiki维护约定.md) | 真相源优先级、状态标注、更新时机 |
| [Wiki 结构性改动说明](Wiki结构性改动说明.md) | 2026-07-21 审查为何大幅重写、非增量修改 |

### 运维

| 文档 | 说明 |
|------|------|
| [部署与运维](部署与运维.md) | CI/CD、deploy-test、监控与故障排查 |

### 交付规格（designdoc，非 Wiki）

| 路径 | 4p12s 步骤 |
|------|------------|
| `designdoc/specs/requirements-register.md` | ② |
| `designdoc/specs/prd.md` | ③ |
| `designdoc/specs/user-stories.md` | ④ |
| `designdoc/specs/design.md` | ⑤ |
| `designdoc/verification/verification-plan.md` | ⑥（待建） |
| `designdoc/specs/tasks/` + `TASK-xxx.md` | ⑦ |

---

## 建议阅读路径

### 新成员入门

1. [项目概述](项目概述.md) → 2. [快速开始](快速开始.md) → 3. [架构总览](架构总览.md) → 4. [编码指引](编码指引.md) → 5. [测试策略](测试策略.md)

### Agent 会话开场（推荐）

1. [`AGENTS.md`](../../AGENTS.md) → 2. [`delivery-state.md`](../../designdoc/delivery/delivery-state.md) → 3. 当前步骤对应 [`skills/`](../../skills/) → 4. 本 Wiki 相关章节 → 5. [`.cursor/rules/`](../../.cursor/rules/)

复杂功能叠加顺序（见 `学习资料.md` §10）：

```
GienSpec（规格/计划/任务）
  → Superpower（澄清/TDD/验证收尾）
  → 4p12s ⑨–⑫（集成/E2E/Git/部署）
```

### 开发者深入

1. [技术栈与依赖](技术栈与依赖.md) → 2. [API 参考](API参考/API参考.md) → 3. [数据模型](数据模型/数据模型.md) → 4. [基础设施与中间件](基础设施与中间件/基础设施与中间件.md) → 5. [业务逻辑层](业务逻辑层/业务逻辑层.md)

### 架构师视角

1. [架构总览](架构总览.md) → 2. [数据模型](数据模型/数据模型.md) → 3. [基础设施与中间件](基础设施与中间件/基础设施与中间件.md) → 4. [外部系统集成](外部系统集成/外部系统集成.md) → 5. [部署与运维](部署与运维.md)

---

## 文档维护约定

详见 [Wiki 维护约定](Wiki维护约定.md)。摘要：代码 > designdoc > AGENTS/skills > Wiki；状态用 ✅/🟡/📋/🔮。

---

## Wiki 审查进度

| 批次 | 状态 |
|------|------|
| Step 0–7（全量 24 篇） | ✅ |
| **Step 8 新增页（3 篇）** | **✅** |

详情：[`designdoc/delivery/wiki-audit-status.md`](../../designdoc/delivery/wiki-audit-status.md)
