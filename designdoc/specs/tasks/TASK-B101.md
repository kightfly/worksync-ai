# TASK-B101

## 元信息

| 项 | 值 |
|----|-----|
| **标题** | Task 领域实体与状态机 |
| **状态** | done |
| **依赖** | S001 |
| **契约版本** | design.md `0.1.0-replay` §6.1 |
| **对应 US / V** | US-012a～e；V-011～015；BR-003/007/008/009 |

## 目标

在 `packages/domain` 实现 `Task`：标题必填、默认 `todo`、`transitionTo` 强制合法迁移；非法抛可映射为 `INVALID_STATE_TRANSITION` 的领域错误；`done` 禁止再改 status/内容。

## 边界（做 / 不做）

- **做**：纯 Domain + Vitest 单测；无 Drizzle/Fastify 依赖
- **不做**：HTTP、Repository、UI

## 涉及文件

- `packages/domain/src/task.ts`
- `packages/domain/src/task.test.ts`

## 失败测试（红灯意图）

- `todo`→`in_progress` / `in_progress`→`done` / `in_progress`→`todo` 成功
- `todo`→`done` 失败，消息对应「無効な状態遷移です」
- `done`→任意 失败；对 done 任务改 title 失败
- 空标题创建/更新失败

## 验收标准

- [x] 上述单测全绿
- [x] Domain 无外部框架 import
- [x] 与 design 状态机图一致

## 证据（⑧ 回写）

```bash
npm run test -w @gienharness/domain
# task.test.ts 9 passed
```

- 红灯次数：—
- 升级给人：否

## 门禁

- [x] 可独立验证
- [x] 测试证据齐全 → 可供 A102 引用
