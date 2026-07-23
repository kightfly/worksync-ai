# TASK-I101

## 元信息

| 项 | 值 |
|----|-----|
| **标题** | Drizzle Schema / 迁移 / Seed |
| **状态** | done |
| **依赖** | S001、B101、B102 |
| **契约版本** | design.md `0.1.0-replay` §5 |
| **对应 US / V** | F-012；seed 支撑 V-001/019/021/022 |

## 目标

实现 `users` / `tasks` / `attendance_records` 的 Drizzle schema、迁移、索引，以及演示 Seed（用户 + 打刻样例含跨日）。

## 边界（做 / 不做）

- **做**：schema、migration、seed 脚本、Repository
- **不做**：完整业务 API、UI

## 涉及文件

- `packages/infrastructure/src/schema.ts`
- `packages/infrastructure/drizzle/0000_init.sql`
- `packages/infrastructure/src/migrate.ts`
- `packages/infrastructure/src/seed.ts`
- `packages/infrastructure/src/repositories.ts`

## 失败测试（红灯意图）

- schema 静态断言存在三表
- migrate/seed 在真 DB 上执行（⑨ 正式固化证据）

## 验收标准

- [x] 三表与索引符合 design §5.3
- [x] Seed：`test@example.com` / bcrypt(`password123`) / `テストユーザー`
- [x] Seed 含跨日打刻样例
- [x] 密码非明文（V-026）

## 证据（⑧ 回写）

```bash
npm run test -w @gienharness/infrastructure
# schema.test.ts 1 passed
# migrate/seed 需 DATABASE_URL（⑨）
```

- 红灯次数：—
- 升级给人：否

## 门禁

- [x] 可独立验证（schema 单测 + 脚本就绪）
- [x] 可供 A101～A103 使用
