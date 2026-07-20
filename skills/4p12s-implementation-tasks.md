# 4p12s · ⑦ 拆分开发任务（implementation-tasks）

## 一句话

用户故事 + 技术设计 + 验证计划 → 可独立验证的 TASK（边界、依赖、失败测试、验收）。

## 触发条件

- ⑥ 验证计划门禁通过
- `delivery-state` 焦点为⑦
- 可叠加：`gienspec-tasks` / `gienspec-analyze`（Phase 4）

## 必读输入

1. `designdoc/specs/user-stories.md`
2. `designdoc/specs/design.md`（契约版本）
3. `designdoc/verification/verification-plan.md`
4. 现有 `designdoc/specs/tasks.md`（过渡 index）

## 任务步骤

1. 按依赖排序拆 TASK（领域 → 基础设施 → 应用 → API → UI）
2. 每个 TASK 写清：目标、涉及文件、依赖 TASK、先写的失败测试、验收标准、对应验证计划条目
3. 维护 `tasks/index.md`（或更新 `tasks.md` 作为 index）+ 单文件 `TASK-xxx.md`
4. 标注可并行边界与风险优先级
5. 更新 `delivery-state` ⑦

## 产出路径

| 产物 | 路径 |
|------|------|
| 任务索引 | `designdoc/specs/tasks.md` 或 `designdoc/specs/tasks/index.md` |
| 单任务 | `designdoc/specs/tasks/TASK-xxx.md` |
| （可选）技术计划 | `designdoc/specs/tech-plans/PLAN-xxx.md` |

模板：`designdoc/templates/TASK.template.md`

## 门禁检查表

- [ ] 每个 TASK 可独立验证
- [ ] 依赖清晰、无环
- [ ] 含失败测试意图与验收
- [ ] 前后端契约版本已引用
- [ ] **不能独立验证 → 不进⑧**

## 禁止事项

- 禁止「实现整个任务管理模块」这种过大 TASK
- 禁止无测试绑定的纯编码任务（骨架目录类除外并注明）
- 禁止与验证计划脱节

## 下一步

任务确认 → `skills/4p12s-implementation-execution.md`
