# designdoc 交付物指南

> **文档类型**：流程指引  
> **实现状态**：✅ 目录与模板已落地（部分产物待人确认）  
> **最后核对**：2026-07-21  
> **真相源**：[`designdoc/`](../../designdoc/) | [`designdoc/templates/`](../../designdoc/templates/)  
> **审查跟踪**：[`wiki-audit-status.md`](../../designdoc/delivery/wiki-audit-status.md)

## 概述

`designdoc/` 存放 **4p12s 各步交付物**，与 Wiki（`.gientech/wiki/`）分工如下：

| 位置 | 用途 |
|------|------|
| `designdoc/` | 规格、设计、任务、验证、交付状态（**进度真相源**） |
| `.gientech/wiki/` | 知识库、架构说明、API/数据模型参考（须与代码/designdoc 对齐） |

## 目录结构

```
designdoc/
├── delivery/              # 交付状态与对齐
│   ├── delivery-state.md           # ① 十二步进度（必维护）
│   ├── harness-alignment-status.md # Harness 方法论对齐
│   └── wiki-audit-status.md        # Wiki 分步审查
├── specs/                 # ②–⑤⑦ 规格与设计
│   ├── requirements-register.md    # ②
│   ├── prd.md                      # ③
│   ├── user-stories.md             # ④
│   ├── design.md                   # ⑤
│   ├── requirements.md             # 过渡索引
│   ├── tasks.md                    # ⑦ 索引
│   └── tasks/TASK-xxx.md           # 单任务
├── verification/          # ⑥⑨⑩
│   ├── verification-plan.md          # ⑥（待建）
│   └── verification-result.md        # ⑨（待建）
└── templates/             # 空白模板
```

## 十二步 → 交付物对照

| 步骤 | 输出路径 | 模板 |
|------|----------|------|
| ① | `delivery/delivery-state.md` 等 | — |
| ② | `specs/requirements-register.md` | `templates/requirements-register.template.md` |
| ③ | `specs/prd.md` | `templates/prd.template.md` |
| ④ | `specs/user-stories.md` | `templates/user-stories.template.md` |
| ⑤ | `specs/design.md` | —（可参考现有 `design.md`） |
| ⑥ | `verification/verification-plan.md` | `templates/verification-plan.template.md` |
| ⑦ | `specs/tasks.md` + `specs/tasks/TASK-xxx.md` | `templates/TASK.template.md` |
| ⑧ | 代码 + 测试 | — |
| ⑨ | `verification/verification-result.md` | — |
| ⑩ | `apps/web/e2e/` + 报告 | — |
| ⑪ | Git commit / MR | — |
| ⑫ | `delivery/deploy-log.md` | `templates/deploy-log.template.md` |

模板使用：复制模板 → 填写 → 过对应 `skills/4p12s-*.md` 门禁 → **回写 `delivery-state.md`**。

## 当前产物状态（摘要）

| 文件 | 状态 | 备注 |
|------|------|------|
| `requirements-register.md` | 已有 | `gate_pending` |
| `prd.md` / `user-stories.md` | 已有 | 待人确认 Q-001/Q-002 |
| `design.md` | 已有 | 与 Wiki API/数据模型对齐审查中 |
| `verification-plan.md` | 📋 待建 | 模板已备 |
| `tasks.md` + Phase 任务 | 部分 | 新 TASK 用模板 |
| `deploy-log.md` | 📋 待建 | deploy-test CI 已就绪 |

详情见 [`delivery-state.md`](../../designdoc/delivery/delivery-state.md)。

## TASK 文件约定

- 路径：`designdoc/specs/tasks/TASK-{域}{序号}.md`（如 `TASK-B101`）
- 须含：目标、验收、测试命令、完成证据、与 4p12s 步骤关联
- ⑧ 完成后回写 TASK 状态；连续 5 次红灯须人工介入

## 变更清单模板（Phase / Step 通过后）

每步门禁通过后，Agent 可输出：

```markdown
## Phase / Step 变更清单

### 新增文件
- path/to/file

### 修改文件
- path/to/file: 说明

### 通过的测试 / 证据
npm run test
# 或 E2E / 部署记录路径

### 未决问题
- 问题 + 思路
```

并更新 `delivery-state.md`（及 `harness-alignment-status.md` 若适用）。

## 与 Wiki 的关系

- **designdoc 优先**于 Wiki 作为规格与设计真相源
- **代码优先**于 designdoc 作为实现真相源
- Wiki 审查跟踪：[`wiki-audit-status.md`](../../designdoc/delivery/wiki-audit-status.md)

## 相关文档

- [交付流程与 Skills](交付流程与Skills.md) — Skill 索引与叠加顺序
- [Wiki 维护约定](Wiki维护约定.md) — Wiki 更新规则
- [AGENTS.md](../../AGENTS.md) — 目录结构与模块边界
