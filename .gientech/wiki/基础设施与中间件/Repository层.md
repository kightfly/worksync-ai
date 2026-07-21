# Repository 层

> **文档类型**：📋 设计契约  
> **实现状态**：📋 无实现；`packages/infrastructure` 未创建  
> **最后核对**：2026-07-21  
> **真相源**：[`design.md`](../../../designdoc/specs/design.md) | [`AGENTS.md`](../../../AGENTS.md)  
> **审查跟踪**：[`wiki-audit-status.md`](../../../designdoc/delivery/wiki-audit-status.md)

## 重要说明

本文档描述 **目标 Repository 接口与职责**。当前仓库 **不存在** 任何 Repository 实现或测试文件。

| 规划路径 | 现状 |
|----------|------|
| `packages/infrastructure/repositories/user.repository.ts` | 📋 |
| `packages/infrastructure/repositories/task.repository.ts` | 📋 |
| `packages/infrastructure/repositories/attendance.repository.ts` | 📋 |
| `packages/domain/` 实体 | 📋 |

## 概述

Repository 层封装数据访问逻辑，为 Service 层提供统一的数据操作接口。遵循分层规则：**Service 不直接操作 Drizzle**，而是通过 Repository 间接访问（见 `AGENTS.md` 模块边界）。

## 设计原则

1. **接口隔离**：Repository 定义接口，Service 依赖接口而非实现
2. **单一职责**：每个 Repository 对应一个实体
3. **禁止 N+1**：关联查询使用 JOIN 或 `inArray` 批量查询
4. **类型安全**：利用 Drizzle 的 `$inferSelect` / `$inferInsert`

## 规划 Repository 接口

### UserRepository

| 方法 | 说明 |
|------|------|
| `findById(id)` | 按 ID 查找用户 |
| `findByEmail(email)` | 按邮箱查找用户 |
| `create(data)` | 创建用户 |
| `update(id, data)` | 更新用户 |
| `delete(id)` | 软删除（`is_active = false`） |

### TaskRepository

| 方法 | 说明 |
|------|------|
| `findByUserId(userId, filters?)` | 用户任务列表（可选状态筛选） |
| `findById(id)` | 按 ID 查找（须校验 `user_id`） |
| `create(data)` | 创建任务 |
| `update(id, data)` | 更新任务 |
| `delete(id)` | 物理删除 |

### AttendanceRepository

| 方法 | 说明 |
|------|------|
| `findByUserIdAndDate(userId, date)` | 某日打卡记录 |
| `findByUserIdAndDateRange(userId, start, end)` | 日期范围列表 |
| `create(data)` | 创建记录（出勤） |
| `update(id, data)` | 更新（如退勤时间） |
| `getStatistics(userId, start, end)` | 按日工时统计 |

TASK 索引见 `designdoc/specs/tasks.md`（Repository / 集成测试段）。

## 接口定义示例

```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: NewUser): Promise<User>;
  update(id: string, data: Partial<NewUser>): Promise<User>;
  delete(id: string): Promise<void>;
}
```

## 实现示例（规划）

```typescript
class DrizzleUserRepository implements UserRepository {
  constructor(private db: DbType) {}

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    return user ?? null;
  }
}
```

## 测试策略

- **集成测试**：真实 PostgreSQL（验证计划中的禁用 Mock 节点）
- Repository 层 **不应** Mock 数据库驱动本身
- 单元测试侧重领域实体；Repository 归属集成层

## 相关文档

- [Drizzle ORM](DrizzleORM.md) — ORM 查询 API
- [数据库层](数据库层.md) — 连接配置
- [数据模型](../数据模型/数据模型.md) — 实体定义
- [业务逻辑层](../业务逻辑层/业务逻辑层.md) — Service 层（📋）
