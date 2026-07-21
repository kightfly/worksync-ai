# TASK-B102: Task 实体与状态机

## 元信息

- 标题：创建 Task 实体（状态迁移）
- 状态：done
- 依赖：无（领域层；不依赖 DB）
- 契约版本：PRD 0.2.0 / design 0.2.0 / user-stories US-012
- 对应 US / V：US-012a～e / V-013～V-016

## 目标

在 `packages/domain` 实现 `Task` 实体，强制执行 BR-007～BR-009 状态机；标题必填。

## 边界（做 / 不做）

- **做**：`transitionTo`、标题校验、`done` 后禁止修改（design v0.2）
- **不做**：Repository、API、持久化

## 涉及文件

- `packages/domain/package.json`
- `packages/domain/tsconfig.json`
- `packages/domain/vitest.config.ts`
- `packages/domain/src/entities/task.ts`
- `packages/domain/src/entities/task.test.ts`
- `packages/domain/src/errors/*.ts`
- `packages/domain/src/index.ts`
- 根 `package.json`（`test` 纳入 domain）

## 失败测试（红灯意图）

- 非法迁移 `todo`→`done`、`done`→* 抛 `InvalidStateTransitionError`（日文消息）
- 空标题创建失败
- `done` 任务更新标题/说明失败

## 验收标准

- [x] 标题必填（非空、trim 后长度 1～255）
- [x] 合法迁移：todo→in_progress、in_progress→done、in_progress→todo
- [x] 非法迁移拒绝，消息含「無効な状態遷移」
- [x] `done` 任务不可再修改内容或状态
- [x] `npm run test`（含 domain）全绿

## 证据（⑧ 回写）

```bash
npm run test -w @ai-harness/domain   # 9 passed
npm run test                         # web/api/domain/infrastructure 全绿
npm run typecheck                    # 全绿
```

- 红灯次数：1（`done` 状态迁移错误类型；已改为 `InvalidStateTransitionError`）
- 升级给人：否

## 门禁

- [x] 可独立验证（纯单元测试）
- [x] 测试证据齐全 → 可合并进⑨ 范围
