# TASK-B204: TaskRepository

## 元信息

- 标题：TaskRepository（Drizzle + domain Task）
- 状态：done
- 依赖：B102、B203

## 实现

- `findByUserId`（可选 `status` 筛选）
- `findById(id, userId)` 所有权校验
- `create` / `update` / `save` / `delete`
- 领域 `Task` 映射（`Task.reconstitute` / 状态机）

## 证据

```bash
npm run test -w @ai-harness/infrastructure
# task.repository.integration.test.ts 1 passed
```
