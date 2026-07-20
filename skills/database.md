# Database 技能

## 角色定位

作为数据库设计师，你负责：
1. 数据库 Schema 设计
2. 索引策略规划
3. SQL 查询优化
4. 数据一致性保障

## 本项目的数据库技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| DBMS | PostgreSQL 15+ | 关系型数据库 |
| ORM | Drizzle ORM | 类型安全的 SQL 构建器 |
| Migration | Drizzle Kit | Schema 迁移工具 |

## 数据库设计原则

### 1. 命名规范

#### 表名
- 使用小写 + 下划线
- 使用复数形式
- 示例：`users`, `tasks`, `attendance_records`

#### 列名
- 使用小写 + 下划线
- 主键：`id`
- 外键：`{table_name}_id`（如 `user_id`）
- 时间戳：`created_at`, `updated_at`
- 布尔值：`is_` / `has_` 开头（如 `is_active`）

#### 索引名
- 格式：`{table_name}_{column_name}_idx`
- 唯一索引：`{table_name}_{column_name}_uniq`

### 2. 数据类型选择

| PostgreSQL 类型 | TypeScript 类型 | 使用场景 |
|----------------|----------------|----------|
| `serial` / `integer` | `number` | 自增主键（可选） |
| `uuid` | `string` | UUID 主键（推荐） |
| `varchar(n)` | `string` | 定长字符串 |
| `text` | `string` | 长文本 |
| `boolean` | `boolean` | 布尔值 |
| `timestamp with time zone` | `Date` | 时间戳（UTC） |
| `date` | `string` | 日期 |
| `jsonb` | `object` | JSON 数据 |

### 3. 时区处理

**核心原则**：UTC 存储，本地展示

```typescript
// 存储：UTC
const record = {
  checkIn: new Date('2025-01-15T09:00:00Z'), // UTC
};

// 展示：Asia/Tokyo
const tokyoTime = record.checkIn.toLocaleString('ja-JP', {
  timeZone: 'Asia/Tokyo',
});
```

## Drizzle ORM 使用指南

### Schema 定义

```typescript
// packages/infrastructure/db/schema.ts
import { pgTable, uuid, varchar, timestamp, boolean, text, date } from 'drizzle-orm/pg-core';

// 用户表
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// 任务表
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('todo'),
  dueDate: date('due_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// 打卡记录表
export const attendanceRecords = pgTable('attendance_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  checkInTime: timestamp('check_in_time', { withTimezone: true }).notNull(),
  checkOutTime: timestamp('check_out_time', { withTimezone: true }),
  workDate: date('work_date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// 类型导出
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type NewAttendanceRecord = typeof attendanceRecords.$inferInsert;
```

### 查询操作

```typescript
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import { db } from './db';
import { users, tasks, attendanceRecords } from './schema';

// 创建
async function createUser(userData: NewUser) {
  const result = await db.insert(users).values(userData).returning();
  return result[0];
}

// 查询单个
async function getUserById(id: string) {
  return db.select().from(users).where(eq(users.id, id)).limit(1).then(rows => rows[0]);
}

// 查询列表
async function getUserTasks(userId: string) {
  return db.select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.createdAt));
}

// 条件查询
async function getTasksByStatus(userId: string, status: string) {
  return db.select()
    .from(tasks)
    .where(and(
      eq(tasks.userId, userId),
      eq(tasks.status, status)
    ));
}

// 日期范围查询
async function getAttendanceRecords(userId: string, startDate: Date, endDate: Date) {
  return db.select()
    .from(attendanceRecords)
    .where(and(
      eq(attendanceRecords.userId, userId),
      gte(attendanceRecords.workDate, startDate),
      lte(attendanceRecords.workDate, endDate)
    ))
    .orderBy(desc(attendanceRecords.workDate));
}

// 更新
async function updateTask(id: string, updates: Partial<NewTask>) {
  const result = await db.update(tasks)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning();
  return result[0];
}

// 删除
async function deleteTask(id: string) {
  await db.delete(tasks).where(eq(tasks.id, id));
}
```

### 关联查询

```typescript
import { relations } from 'drizzle-orm';

// 定义关系
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  attendanceRecords: many(attendanceRecords),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

export const attendanceRecordsRelations = relations(attendanceRecords, ({ one }) => ({
  user: one(users, {
    fields: [attendanceRecords.userId],
    references: [users.id],
  }),
}));

// 使用关联查询
async function getUserWithTasks(userId: string) {
  const [user, userTasks] = await Promise.all([
    getUserById(userId),
    getUserTasks(userId),
  ]);
  
  return { ...user, tasks: userTasks };
}
```

## 索引设计

### 索引策略

```typescript
// 创建索引
import { index, uniqueIndex } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  status: varchar('status', { length: 50 }).notNull(),
  dueDate: date('due_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  // 外键索引（查询优化）
  userIdIdx: index('tasks_user_id_idx').on(table.userId),
  // 状态查询索引
  statusIdx: index('tasks_status_idx').on(table.status),
  // 复合索引（常用查询组合）
  userIdStatusIdx: index('tasks_user_id_status_idx').on(table.userId, table.status),
  // 唯一索引
  userEmailUniq: uniqueIndex('users_email_unique').on(table.email),
}));
```

### 索引设计原则

1. **主键自动索引**
2. **外键列建立索引**（关联查询）
3. **WHERE 子句列建立索引**
4. **ORDER BY 列考虑索引**
5. **复合索引考虑列顺序**（高选择性列在前）

## SQL 优化

### 避免 N+1 查询

```typescript
// ❌ 错误：N+1 查询
const users = await db.select().from(users);
for (const user of users) {
  const tasks = await db.select()
    .from(tasks)
    .where(eq(tasks.userId, user.id)); // 每次循环都查询
}

// ✅ 正确：批量查询
const users = await db.select().from(users);
const userIds = users.map(u => u.id);
const tasks = await db.select()
  .from(tasks)
  .where(inArray(tasks.userId, userIds));
```

### 使用 EXPLAIN 分析

```sql
-- 查看查询执行计划
EXPLAIN ANALYZE
SELECT * FROM tasks
WHERE user_id = 'xxx' AND status = 'todo';

-- 输出示例：
-- Index Scan using tasks_user_id_status_idx on tasks
--   Index Cond: (user_id = 'xxx' AND status = 'todo')
--   Actual Time: 0.050..0.055 rows = 5 loops = 1
```

### 分页查询

```typescript
// 使用 LIMIT / OFFSET
async function getTasksPage(userId: string, page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  
  const [items, total] = await Promise.all([
    db.select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .limit(pageSize)
      .offset(offset)
      .orderBy(desc(tasks.createdAt)),
    
    // 获取总数
    db.select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .then(rows => rows[0].count),
  ]);
  
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
```

## 事务处理

```typescript
import { db } from './db';

async function createTaskWithAudit(taskData: NewTask, auditData: any) {
  return db.transaction(async (tx) => {
    // 创建任务
    const task = await tx.insert(tasks)
      .values(taskData)
      .returning();
    
    // 记录审计日志（假设有 audit_logs 表）
    await tx.insert(auditLogs).values({
      action: 'CREATE_TASK',
      taskId: task[0].id,
      timestamp: new Date(),
      ...auditData,
    });
    
    return task[0];
  });
}

// 事务回滚示例
async function transferWorkTime(fromId: string, toId: string, hours: number) {
  return db.transaction(async (tx) => {
    const fromRecord = await tx.select()
      .from(attendanceRecords)
      .where(eq(attendanceRecords.id, fromId))
      .then(rows => rows[0]);
    
    if (fromRecord.hours < hours) {
      throw new Error('工时不足'); // 事务回滚
    }
    
    // 扣减
    await tx.update(attendanceRecords)
      .set({ hours: fromRecord.hours - hours })
      .where(eq(attendanceRecords.id, fromId));
    
    // 增加
    await tx.update(attendanceRecords)
      .set({ hours: sql`${hours} + ${attendanceRecords.hours}` })
      .where(eq(attendanceRecords.id, toId));
  });
}
```

## 迁移管理

### 生成迁移

```bash
# 根据 schema 生成迁移文件
npx drizzle-kit generate:pg

# 应用迁移
npx drizzle-kit push:pg
```

### 种子数据

```typescript
// packages/infrastructure/db/seed.ts
import { db } from './db';
import { users, tasks } from './schema';

async function seed() {
  // 创建测试用户
  const [user] = await db.insert(users).values({
    email: 'test@example.com',
    passwordHash: 'hashed_password',
    name: '测试用户',
  }).returning();

  // 创建测试任务
  await db.insert(tasks).values([
    { userId: user.id, title: '任务 1', status: 'todo', dueDate: '2025-01-20' },
    { userId: user.id, title: '任务 2', status: 'in_progress', dueDate: '2025-01-25' },
    { userId: user.id, title: '任务 3', status: 'done', dueDate: '2025-01-15' },
  ]);

  console.log('Seed completed');
}

seed().catch(console.error);
```

## 数据库测试

```typescript
// packages/infrastructure/db/tasks.repository.test.ts
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { db } from './db';
import { tasks, users } from './schema';
import { TasksRepository } from './tasks.repository';

describe('TasksRepository', () => {
  let repo: TasksRepository;
  let testUser: typeof users.$inferSelect;

  beforeEach(async () => {
    // 清理数据
    await db.delete(tasks);
    await db.delete(users);
    
    // 创建测试用户
    [testUser] = await db.insert(users).values({
      email: 'test@example.com',
      passwordHash: 'hash',
    }).returning();
    
    repo = new TasksRepository(db);
  });

  afterAll(async () => {
    await db.delete(tasks);
    await db.delete(users);
  });

  it('创建任务', async () => {
    const task = await repo.create({
      userId: testUser.id,
      title: '测试任务',
      status: 'todo',
    });
    
    expect(task.title).toBe('测试任务');
    expect(task.id).toBeDefined();
  });

  it('查询用户任务列表', async () => {
    await repo.create({ userId: testUser.id, title: '任务 1', status: 'todo' });
    await repo.create({ userId: testUser.id, title: '任务 2', status: 'done' });
    
    const result = await repo.findByUserId(testUser.id);
    expect(result).toHaveLength(2);
  });

  it('按状态筛选任务', async () => {
    await repo.create({ userId: testUser.id, title: '任务 1', status: 'todo' });
    await repo.create({ userId: testUser.id, title: '任务 2', status: 'done' });
    
    const todoTasks = await repo.findByStatus(testUser.id, 'todo');
    expect(todoTasks).toHaveLength(1);
    expect(todoTasks[0].title).toBe('任务 1');
  });
});
```

## 检查清单

### Schema 设计
- [ ] 表名使用复数形式
- [ ] 主键使用 UUID
- [ ] 时间戳使用 `withTimezone: true`
- [ ] 必填字段使用 `notNull()`
- [ ] 唯一约束正确设置

### 索引设计
- [ ] 外键列有索引
- [ ] 常用查询条件列有索引
- [ ] 复合索引列顺序合理

### SQL 优化
- [ ] 避免 N+1 查询
- [ ] 使用 EXPLAIN 分析复杂查询
- [ ] 分页查询使用 LIMIT/OFFSET

### 数据安全
- [ ] 敏感数据加密存储
- [ ] SQL 注入防护（使用参数化查询）
- [ ] 事务边界正确

### 测试
- [ ] Repository 层有单元测试
- [ ] 集成测试验证 SQL 行为
- [ ] 迁移脚本可重复执行
