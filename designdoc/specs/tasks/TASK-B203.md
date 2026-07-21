# TASK-B203: UserRepository

## 元信息

- 标题：UserRepository（Drizzle）
- 状态：done
- 依赖：B201/B202
- 对应：Wiki Repository层 / design 基础设施层

## 实现

- `findById` / `findByEmail`（仅 `is_active=true`）
- `create` / `update` / `delete`（软删除）
- `withTransaction` 事务支持

## 证据

```bash
npm run test -w @ai-harness/infrastructure
# user.repository.integration.test.ts 2 passed（真实 Supabase）
```
