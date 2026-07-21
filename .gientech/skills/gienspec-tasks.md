# GienSpec · tasks（拆解开发任务）

## 一句话

把计划拆成可独立执行的任务：有输入/输出、验收、依赖，不过大过糊。

## 在本仓库的位置

挂载 **4p12s ⑦**；与 `4p12s-implementation-tasks` 对齐，本 Skill 侧重「规格→任务」质量。

## 触发条件

- `gienspec-plan` / 技术设计已有
- 准备进入 TDD 实现
- 现有 `tasks.md` 粒度过大需再拆

## 必读输入

1. 规格 + 计划 +（若有）验证计划
2. `designdoc/templates/TASK.template.md`
3. `designdoc/specs/tasks.md`

## 任务步骤

1. 按依赖排序（领域 → 基础设施 → 应用 → API → UI）
2. 每条 TASK：目标、边界、文件、依赖、失败测试意图、验收
3. 写入 `designdoc/specs/tasks/TASK-xxx.md` 并更新索引
4. 标出可并行项与风险优先项
5. 交 `gienspec-analyze` 做一致性检查后再编码

## 产出路径

| 产物 | 路径 |
|------|------|
| 任务索引 | `designdoc/specs/tasks.md` |
| 单任务 | `designdoc/specs/tasks/TASK-xxx.md` |

## 门禁检查表

- [ ] 每个 TASK 可独立验证
- [ ] 有依赖且无环
- [ ] 有失败测试意图（骨架任务除外并注明）
- [ ] 验收可勾选

## 禁止事项

- 禁止「实现整个打卡模块」级巨型任务
- 禁止无验收的纯感觉任务
- 禁止与计划范围脱节

## 下一步

`.gientech/skills/gienspec-analyze.md` → 通过后 `4p12s-implementation-execution` + Superpower
