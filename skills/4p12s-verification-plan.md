# 4p12s · ⑥ 验证计划（verification-plan）

## 一句话

先定义「如何证明做完」：单测、集成、E2E、契约；写明禁 Mock 范围与风险覆盖。

## 触发条件

- ⑤ 技术设计门禁通过（或关键契约已确认）
- `delivery-state` 焦点为⑥

## 必读输入

1. `designdoc/specs/design.md`（及前后端拆分文档）
2. `designdoc/specs/user-stories.md`
3. `skills/tdd.md`、`.cursor/rules/tdd.mdc`
4. `designdoc/delivery/delivery-state.md`

## 任务步骤

1. 按故事/模块建测试矩阵：单元 / 集成 / E2E
2. 标明：组件交互、路由、API、持久化、事务、异常、权限、时区用例
3. **明确禁用 Mock 的节点**（例：⑨ 真 DB；⑩ 真前后端链路）
4. 写性能/基线（若本期有）；连续失败归因规则（测试错 / 设计错 / 实现错）
5. 落盘并更新 `delivery-state` ⑥

## 产出路径

| 产物 | 路径 |
|------|------|
| 验证计划 | `designdoc/verification/verification-plan.md` |

模板：`designdoc/templates/verification-plan.template.md`

## 门禁检查表

- [ ] 主流程与关键异常均有验证手段
- [ ] 禁 Mock 范围写清
- [ ] E2E 至少覆盖一条主验收路径（可薄）
- [ ] 与用户故事可映射
- [ ] **关键风险未覆盖 → 不进⑦/⑧ TDD**

## 禁止事项

- 禁止只有「写单测」而无集成/E2E 计划
- 禁止把「全 Mock」写成交付级验证
- 禁止验证计划与设计契约矛盾

## 下一步

计划确认 → `skills/4p12s-implementation-tasks.md`
