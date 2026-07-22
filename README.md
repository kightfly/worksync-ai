# GienHarness · replay 分支

分支：`replay/4p12s-from-design`

## 当前状态

**4p12s 重跑进行中；② 业务需求确认已完成。** 当前焦点：**③ 生成 PRD**。

| 路径 | 说明 |
|------|------|
| [`designdoc/整体设计.md`](designdoc/整体设计.md) | **唯一业务设计**（含固定技术栈） |
| [`designdoc/delivery/delivery-state.md`](designdoc/delivery/delivery-state.md) | **十二步交付状态**（真相源） |
| [`designdoc/delivery/harness-alignment-status.md`](designdoc/delivery/harness-alignment-status.md) | Harness 方法论对齐状态 |
| [`designdoc/specs/raw-input.md`](designdoc/specs/raw-input.md) | 原始业务输入登记 |
| [`designdoc/specs/requirements-register.md`](designdoc/specs/requirements-register.md) | **需求登记表**（② 产出） |
| [`designdoc/templates/`](designdoc/templates/) | 空白交付物模板 |
| [`.gientech/skills/`](.gientech/skills/) | 4p12s / GienSpec / Superpower |
| [`.gientech/rules/`](.gientech/rules/) | TDD、门禁、安全、时区、命名 |
| [`.gientech/wiki/`](.gientech/wiki/) | 架构 Wiki（① 最小占位 4 页） |
| [`AGENTS.md`](AGENTS.md) | 精简开发规范 |

**尚未创建**：`apps/`、`packages/`、根 `package.json`（⑧ 执行开发时按整体设计创建）。

## 重跑流程

1. 读 `delivery-state.md` 确认当前步骤
2. 按对应 `.gientech/skills/4p12s-*.md` 执行
3. 每步完成后手动 commit，再进入下一步
