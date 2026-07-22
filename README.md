# GienHarness · replay 分支（仅设计输入）

分支：`replay/4p12s-from-design`

## 当前状态

**暂不重跑 4p12s。** 本分支目前只保留业务设计输入与 Harness 工具：

| 路径 | 说明 |
|------|------|
| [`designdoc/整体设计.md`](designdoc/整体设计.md) | **唯一业务设计**（含固定技术栈） |
| [`designdoc/templates/`](designdoc/templates/) | 空白交付物模板（备用） |
| [`.gientech/skills/`](.gientech/skills/) | 4p12s / GienSpec / Superpower |
| [`.gientech/rules/`](.gientech/rules/) | TDD、门禁、安全、时区、命名 |
| [`AGENTS.md`](AGENTS.md) | 精简开发规范 |

**已移除（多余）**：`apps/`、`packages/`、业务 Wiki、旧 specs/verification/delivery、从 develop 恢复的实现代码。

## 之后若要重跑

1. 确认 `designdoc/整体设计.md`
2. 按 4p12s ①～⑫ 再生成 Wiki、规格、脚手架与测试
