# User 实体

> **文档类型**：📋 设计契约  
> **实现状态**：📋 表未迁移；Repository / AuthService 未实现  
> **最后核对**：2026-07-21  
> **真相源**：[`design.md`](../../../designdoc/specs/design.md) §数据模型  
> **审查跟踪**：[`wiki-audit-status.md`](../../../designdoc/delivery/wiki-audit-status.md)

## 表名

`users`

## 字段定义

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | 主键 |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | 邮箱 |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt 密码哈希 |
| `name` | VARCHAR(100) | NULL 可空 | 姓名（日文，可选） |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | 是否激活（软删除） |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 创建时间 (UTC) |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 更新时间 (UTC) |

## Drizzle Schema（设计契约）

与 `design.md` 一致；实现文件目标路径：`packages/infrastructure/db/schema.ts`。

```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
```

## 业务规则

- **邮箱唯一**：登录/注册时检查邮箱是否已存在
- **密码安全**：使用 bcrypt 加密，`SALT_ROUNDS = 10`（见 `design.md`），不存储明文
- **密码长度**：产品规则最少 **6 字符**（`prd.md` BR-002），与 API 校验一致
- **软删除**：设置 `is_active = false` 而非物理删除
- **时间戳**：`created_at` / `updated_at` 以 UTC 存储（`withTimezone: true`）

## 关联关系

| 关联 | 类型 | 说明 |
|------|------|------|
| User → Task | 一对多 | 一个用户拥有多个任务 |
| User → AttendanceRecord | 一对多 | 一个用户拥有多条打卡记录 |

## API 端点（📋 未实现）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 登录验证 |
| POST | `/api/auth/logout` | 登出 |

详见 [认证 API](../API参考/认证API.md)。

## 相关文档

- [数据模型](数据模型.md) — 实体总览
- [认证 API](../API参考/认证API.md) — 认证端点
- [业务逻辑层](../业务逻辑层/业务逻辑层.md) — AuthService（📋）
