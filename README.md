# GienHarness · 4p12s 重跑分支

分支：`replay/4p12s-from-design`

## 本分支是什么

从「一份整体设计 + Harness skills/rules」**重新跑**四阶十二步，再生成 Wiki、规格、代码与测试。

## 当前输入（Phase 0）

| 路径 | 说明 |
|------|------|
| [`designdoc/整体设计.md`](designdoc/整体设计.md) | **唯一业务输入**（含固定技术栈） |
| [`.gientech/skills/`](.gientech/skills/) | 4p12s / GienSpec / Superpower |
| [`.gientech/rules/`](.gientech/rules/) | TDD、门禁、安全、时区、命名 |
| [`AGENTS.md`](AGENTS.md) | 精简开发规范 |
| [`designdoc/templates/`](designdoc/templates/) | 交付物空白模板 |
| [`designdoc/delivery/delivery-state.md`](designdoc/delivery/delivery-state.md) | 十二步状态表 |

**尚无**：`apps/`、`packages/`、业务 Wiki（① 后生成）。

## 下一步

1. ① 流程初始化 + 生成 `.gientech/wiki/`
2. ②～⑥ 从整体设计拆规格
3. ⑦⑧ 建脚手架并 TDD 实现
4. ⑨～⑫ 集成 / E2E / Git / 部署

详见 [`AGENTS.md`](AGENTS.md)。
