# Task 实体

> **文档类型**：📋 设计契约  
> **实现状态**：📋 表未迁移；Repository / TaskService 未实现  
> **最后核对**：2026-07-21  
> **真相源**：[`design.md`](../../../designdoc/specs/design.md) §数据模型  
> **审查跟踪**：[`wiki-audit-status.md`](../../../designdoc/delivery/wiki-audit-status.md)

## 表名

`tasks`

## 字段定义

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | 主键 |
| `user_id` | UUID | FK → users.id, NOT NULL | 所属用户 |
| `title` | VARCHAR(255) | NOT NULL | 任务标题 |
| `description` | TEXT | NULL 可空 | 任务描述 |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'todo' | 状态 |
| `due_date` | DATE | NULL 可空 | 截止日期（日期，非时刻） |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 创建时间 (UTC) |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 更新时间 (UTC) |

## Drizzle Schema（设计契约）

```typescript
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('todo'),
  dueDate: date('due_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('tasks_user_id_idx').on(table.userId),
  statusIdx: index('tasks_status_idx').on(table.status),
  userIdStatusIdx: index('tasks_user_id_status_idx').on(table.userId, table.status),
}));
```

## 状态枚举

| 状态值 | 日文 | 说明 |
|--------|------|------|
| `todo` | 未着手 | 待办 |
| `in_progress` | 進行中 | 进行中 |
| `done` | 完了 | 已完成 |

## 状态流转规则

```
todo ──────> in_progress ──────> done
  ↑               │
  └───────────────┘  （允许回退）
```

允许的转换：

| 从 | 到 | 说明 |
|----|-----|------|
| `todo` | `in_progress` | 开始任务 |
| `in_progress` | `done` | 完成任务 |
| `in_progress` | `todo` | 回退任务 |

不允许：`todo` → `done`（跳过进行中）、`done` → 其他状态（已完成不可回退）

## 业务规则

- **用户隔离**：用户只能查看和操作自己的任务（`user_id` 过滤）
- **标题必填**：1–255 字符（与 Schema 一致）
- **描述可选**
- **截止日期可选**：`YYYY-MM-DD` 格式（DATE 字段）

## 关联关系

| 关联 | 类型 | 说明 |
|------|------|------|
| Task → User | 多对一 | 任务属于一个用户 |

## API 端点（📋 未实现）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/tasks` | 获取任务列表 |
| POST | `/api/tasks` | 创建任务 |
| GET | `/api/tasks/:id` | 获取任务详情 |
| PATCH | `/api/tasks/:id` | 更新任务（含状态） |
| DELETE | `/api/tasks/:id` | 删除任务 |

> 更新任务使用 **PATCH**（非 PUT），与 [`design.md`](../../../designdoc/specs/design.md) 及 [任务 API](../API参考/任务API.md) 一致。

## 相关文档

- [数据模型](数据模型.md) — 实体总览
- [任务 API](../API参考/任务API.md) — API 端点详情
- [业务逻辑层](../业务逻辑层/业务逻辑层.md) — TaskService（📋）
