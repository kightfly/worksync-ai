# GienSpec · plan（制定实现计划）

## 一句话

在编码前对齐方案：模块增改、数据、接口、页面、测试、风险与依赖。

## 在本仓库的位置

挂载 **4p12s ⑤**（技术设计）与进入 ⑦ 前的方案层；可与 `4p12s-technical-design` 合用。

## 触发条件

- 规格已相对清晰（clarify 关键项已关）
- 多模块 / 改现有系统，路径未定
- 用户要求「先出实现计划」

## 必读输入

1. 已确认规格 / PRD / 用户故事
2. `designdoc/specs/design.md`、Wiki、现有代码结构
3. `AGENTS.md` 模块边界；`timezone.mdc`；`security.mdc`
4. 横切：`.gientech/skills/architect.md`、`database.md`

## 任务步骤

1. 列出涉及模块与「改 / 增 / 不碰」
2. 数据模型与迁移要点
3. API / 页面 / 状态流
4. 测试策略要点（单测 / 集成 / E2E）— 细节可落到 `verification-plan`
5. 风险、依赖、回滚注意
6. 落盘计划；标出版本以便 `gienspec-analyze` 对照

## 产出路径

| 产物 | 路径 |
|------|------|
| 实现计划 | `designdoc/specs/tech-plans/PLAN-xxx.md` 或更新 `design.md` 对应章节 |

## 门禁检查表

- [ ] 模块边界清晰且符合分层
- [ ] 接口与数据变更可审查
- [ ] 测试与风险有条目
- [ ] 未引入未批准的新技术

## 禁止事项

- 禁止计划与规格范围不一致却不声明变更
- 禁止 UI 直连 DB 等越界设计
- 禁止把计划写成不可执行的空话

## 下一步

`.gientech/skills/gienspec-tasks.md` → `gienspec-analyze` → `4p12s-verification-plan` / `4p12s-implementation-tasks`
