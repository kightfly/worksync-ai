# 4p12s · ⑤ 技术设计（technical-design）

## 一句话

定义前后端边界、接口契约、数据模型与事务；设计必须先于编码且可被人审核。

## 触发条件

- ④ 用户故事门禁通过
- `delivery-state` 焦点为⑤
- 可叠加：`gienspec-plan`（Phase 4）

## 必读输入

1. `designdoc/specs/user-stories.md`
2. `designdoc/specs/prd.md`
3. 现有 `designdoc/specs/design.md`、`.gientech/wiki/`
4. `AGENTS.md` 模块边界；`timezone.mdc`；`security.mdc`
5. 横切：`skills/architect.md`、`skills/database.md`

## 任务步骤

1. **前端**：页面/组件树、路由、状态、数据流、API 对接
2. **后端**：模块职责、REST 契约、错误模型、鉴权
3. **数据**：ER、索引、迁移要点、UTC 存储
4. **事务与一致性**：打卡、任务状态等写路径
5. 更新或拆分设计文档；契约变更记版本
6. 更新 `delivery-state` ⑤，请求人审核边界与契约

## 产出路径

| 产物 | 路径 |
|------|------|
| 总设计（可继续） | `designdoc/specs/design.md` |
| 前端设计（推荐拆分） | `designdoc/specs/frontend-design.md` |
| 后端设计（推荐拆分） | `designdoc/specs/backend-design.md` |
| 接口契约（可附录） | `designdoc/specs/api-contract.md` |

## 门禁检查表

- [ ] UI / 应用 / 领域 / 基础设施边界清晰
- [ ] 接口契约（路径、方法、请求/响应、错误码）完整
- [ ] 数据模型与索引有说明
- [ ] 鉴权与时区策略已写入
- [ ] 服务依赖与风险已列
- [ ] **任一项不清 → 不进⑥/⑦ 拆任务编码**

## 禁止事项

- 禁止更改已固定技术栈（React/Fastify/Drizzle/Postgres 等）
- 禁止 UI 层直连 DB 的设计
- 禁止无索引说明的复杂查询设计
- 禁止跳过安全/时区章节

## 下一步

设计确认 → `skills/4p12s-verification-plan.md`
