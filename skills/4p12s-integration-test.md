# 4p12s · ⑨ 集成测试（integration-test）

## 一句话

启动真实前端/后端与数据库（按计划禁 Mock），验证模块间接口与状态流转；单测通过不算集成通过。

## 触发条件

- ⑧ 相关 TASK 已完成且单测绿
- `delivery-state` 焦点为⑨
- 验证计划中集成段到期执行

## 必读输入

1. `designdoc/verification/verification-plan.md`（集成范围、禁 Mock 节点）
2. `designdoc/specs/design.md` / API 契约
3. `designdoc/specs/user-stories.md`（相关验收）
4. 环境：DB 连接、`npm run dev` 等

## 任务步骤

1. 按验证计划启动**真实**后端 + DB（迁移/种子按需）
2. 运行集成测试套件；覆盖 API↔DB、关键事务、鉴权拒绝路径
3. 前端集成：组件交互/路由/API 数据流（真实 API 或计划允许的范围）
4. 记录失败归因（环境 / 契约 / 实现）
5. 写入 `verification-result.md` 集成段；更新 `delivery-state` ⑨

## 产出路径

| 产物 | 路径 |
|------|------|
| 验证结果 | `designdoc/verification/verification-result.md` |
| 测试输出摘要 | 可贴入结果文件 |

## 门禁检查表

- [ ] 禁 Mock 节点确实未 Mock
- [ ] 集成用例按计划执行并有日志/摘要
- [ ] 失败项有阻塞归因
- [ ] **只用 Mock / 只跑单测 = 假完成 → 不得进⑩宣称通过**

## 禁止事项

- 禁止把单元测试报告当作集成报告
- 禁止跳过 DB 状态检查（写路径场景）
- 禁止集成失败仍标记 `done`

## 下一步

集成门禁通过 → `skills/4p12s-e2e-test.md`
