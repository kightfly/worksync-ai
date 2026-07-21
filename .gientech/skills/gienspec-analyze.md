# GienSpec · analyze（一致性分析）

## 一句话

检查规格 / 计划 / 任务是否对齐：覆盖缺口、越界、冲突、边界遗漏。

## 在本仓库的位置

挂载 **4p12s ⑥–⑦ 之间**（进 TDD 前最后一道规格门禁）。最小集不含独立 `checklist` skill 时，本步兼做规格体检要点。

## 触发条件

- `gienspec-tasks` 刚完成
- 改规格或计划后需重检
- 准备宣称「可以开始编码」

## 必读输入

1. 规格（register / prd / user-stories / feature-spec）
2. 计划（design / PLAN-xxx）
3. 任务清单（tasks.md + TASK-xxx）
4. （若有）`verification-plan.md`

## 任务步骤

1. **覆盖**：每个 P0 验收是否有对应 TASK 或验证项
2. **越界**：TASK 是否做了规格未要求的事
3. **冲突**：计划与故事、接口与数据是否矛盾
4. **边界**：异常/权限/时区/空态是否遗漏
5. **模糊词**：规格中是否仍有未关闭的「适当」等
6. 输出分析报告：问题列表 + 建议修复；不通过则退回 specify/clarify/plan/tasks

## 产出路径

| 产物 | 路径 |
|------|------|
| 一致性报告 | `designdoc/specs/analyze-report.md`（或 TASK 索引附录） |

## 门禁检查表（规格体检要点）

- [ ] P0 验收有着落
- [ ] 无未解释的范围膨胀
- [ ] 权限 / 异常 / 时区有覆盖或显式推迟
- [ ] 禁模糊词或已澄清
- [ ] **不通过 → 禁止进入⑧编码**

## 禁止事项

- 禁止分析只写「看起来对齐」而无对照表
- 禁止发现问题仍放行编码
- 禁止用分析代替人确认产品决策

## 下一步

通过 → `4p12s-verification-plan`（若未做）→ `4p12s-implementation-execution` + Superpower 最小集
