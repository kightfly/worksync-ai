# Drizzle ORM

> **文档类型**：设计契约 + 实现说明  
> **实现状态**：🟡 `drizzle-orm` 已安装；Schema / 查询 / 迁移 **📋 未落地**  
> **最后核对**：2026-07-21  
> **真相源**：[`design.md`](../../../designdoc/specs/design.md) | [`apps/api/package.json`](../../../apps/api/package.json)  
> **审查跟踪**：[`wiki-audit-status.md`](../../../designdoc/delivery/wiki-audit-status.md)

## 概述

AI Harness 使用 Drizzle ORM 作为 PostgreSQL 的数据访问层。Drizzle 提供类型安全的 SQL-like API，轻量且高性能。

| 项目 | 现状 |
|------|------|
| `drizzle-orm` | ✅ `^0.29.0`（`apps/api`） |
| `drizzle-kit` | ✅ devDependency；`db:migrate` → `drizzle-kit push:pg` |
| Schema 文件 | 📋 目标 `packages/infrastructure/db/schema.ts` |
| `drizzle.config.ts` | 📋 未创建 |
| 业务查询代码 | 📋 无 |

## Schema 定义（设计契约）

完整字段与索引以 [`design.md`](../../../designdoc/specs/design.md) 与 [数据模型](../数据模型/数据模型.md) 为准。实现路径：

```
packages/infrastructure/db/schema.ts
```

示例（节选，与 design 一致）：

```typescript
import { pgTable, uuid, varchar, text, boolean, timestamp, date, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// tasks、attendanceRecords 见 design.md
```

## 查询构建（规划示例）

实现 Repository 后，在 `packages/infrastructure` 内使用：

```typescript
import { eq, and, inArray } from 'drizzle-orm';

// 按 ID 查询
const [user] = await db.select().from(users).where(eq(users.id, userId));

// 条件组合
const rows = await db.select().from(tasksTable).where(
  and(eq(tasksTable.userId, userId), eq(tasksTable.status, 'todo'))
);
```

插入 / 更新 / 删除 / JOIN 模式见 `skills/database.md`；**当前仓库无上述运行时代码**。

## 迁移管理

### 当前 npm 脚本

```bash
npm run db:migrate   # apps/api: drizzle-kit push:pg
npm run db:seed      # apps/api: tsx src/db/seed.ts（📋 seed 文件未创建）
```

### 推荐工作流（TASK 落地时）

1. 创建 `packages/infrastructure/db/schema.ts`
2. 添加根或 `apps/api` 下的 `drizzle.config.ts`（指向 schema 与 migrations 目录）
3. 开发期可用 `drizzle-kit push:pg` 快速同步；交付前可改为 `generate` + 版本化迁移

| 命令 | 说明 | 现状 |
|------|------|------|
| `drizzle-kit push:pg` | 将 schema 推送到 DB | 🟡 脚本已配置 |
| `drizzle-kit generate:pg` | 生成 SQL 迁移文件 | 📋 未配置 |
| 迁移目录 | 建议 `packages/infrastructure/drizzle/` | 📋 未创建 |

## 类型推导

```typescript
type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;
```

## N+1 防护

遵循项目规范，禁止 N+1 查询（`.cursor/rules`、[`skills/database.md`](../../../skills/database.md)）：

```typescript
// ❌ N+1
for (const user of userList) {
  await db.select().from(tasksTable).where(eq(tasksTable.userId, user.id));
}

// ✅ 批量
const userIds = userList.map((u) => u.id);
await db.select().from(tasksTable).where(inArray(tasksTable.userId, userIds));
```

## 相关文档

- [数据库层](数据库层.md) — `pg` 连接配置
- [Repository 层](Repository层.md) — 数据访问封装
- [数据模型 - Schema 与迁移](../数据模型/数据库Schema与迁移.md) — 表结构定义
