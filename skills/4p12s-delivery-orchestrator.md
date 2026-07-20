# 4p12s · ① 流程初始化（delivery-orchestrator）

## 一句话

用户输入业务需求 → 建立/更新交付状态跟踪表，确认 Harness 护栏，启动十二步流程。

## 触发条件

- 新功能 / 新迭代开始，尚无或需重置 `delivery-state.md`
- 用户说「按 4p12s 启动」「初始化交付流程」
- `harness-alignment-status.md` 指示需从①推进

## 必读输入

1. `AGENTS.md`
2. `designdoc/delivery/delivery-state.md`（若存在则更新，否则创建）
3. `designdoc/delivery/harness-alignment-status.md`
4. `.cursor/rules/4p12s-gates.mdc`
5. 用户原始需求（口头、Issue、附件路径）

## 任务步骤

1. 确认技术栈与模块边界未被擅自更改（见 `AGENTS.md`）
2. 确认测试护栏约定存在：Vitest、（目标）Playwright、lint/typecheck 脚本
3. 初始化或刷新 `delivery-state.md` 十二步表：状态 / 输入 / 输出 / 阻塞项
4. 将原始需求落盘路径记入①输出或②输入（如 `designdoc/specs/raw-input.md`）
5. 向用户确认「当前焦点步骤」与下一步 Skill
6. **不得跳到编码**；下一步默认调用 `4p12s-requirements`

## 产出路径

| 产物 | 路径 |
|------|------|
| 交付状态表 | `designdoc/delivery/delivery-state.md` |
| 原始需求摘录（可选） | `designdoc/specs/raw-input.md` |
| 对齐进度（若改 Harness） | `designdoc/delivery/harness-alignment-status.md` |

模板：无独立模板；状态表结构见现有 `delivery-state.md`。

## 门禁检查表

- [ ] `delivery-state.md` 含十二步，每步有状态/输入/输出/阻塞项
- [ ] 测试相关 npm scripts 可说明（即使 E2E 尚未装，须记入阻塞项）
- [ ] Wiki / AGENTS / rules 路径对 Agent 清晰
- [ ] 当前焦点步骤已写明
- [ ] **无测试环境约定时，不进入需求实现（②可登记，⑧不可编码）**

## 禁止事项

- 禁止未写状态表就开始改业务代码
- 禁止在①一次性生成 PRD+设计+代码
- 禁止清除人已确认的 `done` 步骤而不说明原因

## 下一步

门禁通过 → `skills/4p12s-requirements.md`
