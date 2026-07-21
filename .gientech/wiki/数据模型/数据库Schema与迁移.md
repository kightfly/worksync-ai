# 数据库 Schema 与迁移

> **文档类型**：📋 设计契约 + 运维说明  
> **实现状态**：📋 Schema / 迁移文件 / seed 均未创建；`db:*` 脚本已声明  
> **最后核对**：2026-07-21  
> **真相源**：[`design.md`](../../../designdoc/specs/design.md) | [`apps/api/package.json`](../../../apps/api/package.json)  
> **审查跟踪**：[`wiki-audit-status.md`](../../../designdoc/delivery/wiki-audit-status.md)

## 重要说明

| 项目 | 现状 |
|------|------|
| Schema 目标路径 | `packages/infrastructure/db/schema.ts`（`design.md` / `AGENTS.md`） |
| 迁移执行入口 | 根目录 `npm run db:migrate` → `apps/api` 的 `drizzle-kit push:pg` |
| Seed 目标路径 | `apps/api/src/db/seed.ts`（📋 文件不存在） |
| Drizzle 配置 | 📋 `drizzle.config.ts` 尚未创建 |
| 实际表 | 📋 无（`apps/api/src` 仅 `server.ts` 等护栏代码） |

实现 Schema TASK 时须：创建 `packages/infrastructure` 模块 → 配置 drizzle-kit → 验证 migrate/seed。

## 概述

AI Harness 使用 Drizzle ORM 管理 PostgreSQL 数据库 Schema 和迁移。

## 迁移命令

| 命令 | 说明 | 现状 |
|------|------|------|
| `npm run db:migrate` | 执行数据库迁移 | 📋 无 schema 可推 |
| `npm run db:seed` | 插入种子数据 | 📋 seed 文件未创建 |

环境变量见根目录 `.env.example`（`DATABASE_URL`）。

## 当前表结构（设计契约）

以下 SQL 与 `design.md` Drizzle 定义等价，供审查与迁移参考。

### users 表

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### tasks 表

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'todo',
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### attendance_records 表

```sql
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  check_in_time TIMESTAMPTZ NOT NULL,
  check_out_time TIMESTAMPTZ,
  work_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

> 注意：`attendance_records` 表没有 `updated_at` 字段。

## 索引设计

与 `design.md` 一致：

```sql
-- tasks（Drizzle 命名）
CREATE INDEX tasks_user_id_idx ON tasks(user_id);
CREATE INDEX tasks_status_idx ON tasks(status);
CREATE INDEX tasks_user_id_status_idx ON tasks(user_id, status);

-- attendance_records
CREATE INDEX attendance_user_id_idx ON attendance_records(user_id);
CREATE INDEX attendance_work_date_idx ON attendance_records(work_date);

-- 性能优化（design.md §性能优化，复合索引）
CREATE INDEX attendance_user_id_work_date_idx ON attendance_records(user_id, work_date);
```

`users.email` 的 UNIQUE 约束会自动创建唯一索引，无需额外 `idx_users_email`。

## 种子数据（规划）

种子数据通过 `npm run db:seed` 插入（实现后），计划包含：

- 测试用户账户（密码均为 bcrypt 哈希，`SALT_ROUNDS = 10`）
- 示例任务数据
- 示例打卡记录

## 企业版扩展 Schema

`.gientech/spec/` 中定义的企业版扩展（🔮 非本期）包括 `departments`、`work_locations`、审批流等表。须通过 4p12s ②③④ 确认后方可实施。

## 相关文档

- [数据模型](数据模型.md) — 实体定义
- [Drizzle ORM](../基础设施与中间件/DrizzleORM.md) — ORM 使用
- [数据库层](../基础设施与中间件/数据库层.md) — 连接配置
