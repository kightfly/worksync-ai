# GienSpec · specify（生成需求规格）

## 一句话

把模糊想法整理成可讨论的需求规格：场景、角色、状态、流程、异常、本期范围、验收。

## 在本仓库的位置

挂载 **4p12s ②–③**（登记表 / PRD）。宪章与技术栈以 `AGENTS.md` 为准（最小集不单独建 `gienspec-constitution`）。

## 触发条件

- 只有一句话 / 截图 / 会议纪要，边界未讲清
- 用户说「先规格再开发」「不要直接写代码」
- 复杂功能启动，需可评审输入

## 必读输入

1. 用户原始想法（消息或 `designdoc/specs/raw-input.md`）
2. `AGENTS.md`（技术栈与边界不可改）
3. `designdoc/delivery/delivery-state.md`
4. 现有相关规格（避免矛盾）

## 任务步骤

1. 提炼：要解决的问题、目标用户、成功样子
2. 写清：本期范围 / 明确不做
3. 列出主流程、异常、空态、边界
4. 标出角色、关键状态（若有状态机）
5. 写出可测试的验收要点（可粗，细节交给 clarify / 用户故事）
6. 落盘；列出模糊词与待确认项 → 交给 `gienspec-clarify`

## 产出路径

| 产物 | 建议路径 |
|------|----------|
| 规格草稿 | `designdoc/specs/requirements-register.md` 或功能专用 `designdoc/specs/<feature>-spec.md` |
| 待澄清清单 | 规格文末或 `clarify` 输入 |

## 门禁检查表

- [ ] 有「做什么 / 不做什么」
- [ ] 有至少一条可观察验收
- [ ] 异常或边界有提及或显式 N/A
- [ ] 未擅自发明未确认的业务规则并标为已确认

## 禁止事项

- 禁止从一句话直接跳到写生产代码
- 禁止用经验默默补全关键字段/权限而不标「假设」
- 禁止更换固定技术栈

## 下一步

`.gientech/skills/gienspec-clarify.md` →（确认后）`4p12s-prd` / `gienspec-plan`
