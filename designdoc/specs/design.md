# 设计文档

> **版本**：0.2.0（对齐 PRD 0.2.0 / `user-stories.md` 2026-07-21）  
> **状态**：已确认  
> **输入**：[`prd.md`](prd.md) | [`user-stories.md`](user-stories.md) | [`requirements-register.md`](requirements-register.md)

## 规格对齐摘要

| 项 | 本期设计 |
|----|----------|
| 打刻 | **只读**：`GET /api/attendance`、`GET /api/attendance/statistics`；数据由 **seed** 初始化（BR-010） |
| 打刻不做 | `POST /api/attendance` 出勤/退勤 — **后续迭代**（见 PRD §1.2） |
| 任务状态机 | BR-007～009；领域层 `Task` 实体强制执行；非法迁移 → 400 `INVALID_STATE_TRANSITION` |
| 认证 | JWT；未登录访问 `/api/*`（除 login/health）→ 401；前端路由守卫（US-003） |
| 密码 | bcrypt `SALT_ROUNDS=10`；最少 6 字符（BR-002） |

---

## 系统架构

### 分层架构

```
┌─────────────────────────────────────────────────────────┐
│                   UI Layer (React)                      │
│  - Components (LoginForm, TaskList, AttendanceList)     │
│  - Pages (Login, Tasks, Attendance, Dashboard)          │
│  - Forms (react-hook-form + zod validation)             │
│  - State Management (React Context / Hooks)             │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Application Layer (Services)               │
│  - AuthService (login, logout, getCurrentUser)          │
│  - TaskService (CRUD operations)                        │
│  - AttendanceService (list, statistics)                 │
│  - Transaction Management                               │
│  - DTO Mapping                                          │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                Domain Layer (Entities)                  │
│  - User (entity with business logic)                    │
│  - Task (entity with status transitions)                │
│  - AttendanceRecord (entity with time calculations)     │
│  - Value Objects (Email, Password, etc.)                │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│           Infrastructure Layer (Repository)             │
│  - UserRepository (Drizzle ORM)                         │
│  - TaskRepository (Drizzle ORM)                         │
│  - AttendanceRepository (Drizzle ORM)                   │
│  - Database Connection (PostgreSQL)                     │
│  - External Services                                    │
└─────────────────────────────────────────────────────────┘
```

## 模块边界

### 依赖规则

1. **UI 层** → **应用服务层**（通过接口）
2. **应用服务层** → **领域层** + **基础设施层**（接口）
3. **领域层** → 无依赖（纯业务逻辑）
4. **基础设施层** → **领域层**（实现 Repository 接口）

### 禁止的依赖

- ❌ UI 层 → 基础设施层（直接访问 DB）
- ❌ 领域层 → 基础设施层（外部依赖）
- ❌ 基础设施层 → UI 层（反向依赖）

## 数据模型设计

### ER 图

```
┌─────────────┐       ┌─────────────┐       ┌──────────────────┐
│   users     │       │   tasks     │       │attendance_records│
├─────────────┤       ├─────────────┤       ├──────────────────┤
│ id (PK)     │◄──────│ user_id(FK) │       │ id (PK)          │
│ email       │       │ id (PK)     │       │ user_id (FK)     │
│ password    │       │ title       │       │ check_in_time    │
│ name        │       │ description │       │ check_out_time   │
│ is_active   │       │ status      │       │ work_date        │
│ created_at  │       │ due_date    │       │ created_at       │
│ updated_at  │       │ created_at  │       └──────────────────┘
└─────────────┘       │ updated_at  │
                      └─────────────┘
```

### Schema 定义 (Drizzle ORM)

```typescript
// packages/infrastructure/db/schema.ts

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

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

export const attendanceRecords = pgTable('attendance_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  checkInTime: timestamp('check_in_time', { withTimezone: true }).notNull(),
  checkOutTime: timestamp('check_out_time', { withTimezone: true }),
  workDate: date('work_date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('attendance_user_id_idx').on(table.userId),
  workDateIdx: index('attendance_work_date_idx').on(table.workDate),
}));
```

## 领域规则

### 任务状态机（BR-007～BR-009）

与 PRD §4.1、`user-stories.md` US-012a～e 一致：

```
todo ──→ in_progress ──→ done
  ↑            │
  └────────────┘（in_progress → todo 可回退）
```

| 迁移 | 允许 |
|------|------|
| `todo` → `in_progress` | ✅ |
| `in_progress` → `done` | ✅ |
| `in_progress` → `todo` | ✅ |
| `todo` → `done` | ❌ |
| `done` → 任意 | ❌ |

实现位置：`packages/domain/entities/task.ts` — `Task.transitionTo(nextStatus)` 抛 `InvalidStateTransitionError`。

```typescript
// packages/domain/entities/task.ts（示意）
const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  todo: ['in_progress'],
  in_progress: ['done', 'todo'],
  done: [],
};

function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}
```

`TaskService.updateTask` 在 PATCH `status` 时调用领域方法；API 层映射为 400：

```typescript
// PATCH /api/tasks/:id 非法状态
Response (400):
{
  "error": "INVALID_STATE_TRANSITION",
  "message": "無効な状態遷移です"
}
```

标题/说明更新不改变状态时，任意非 `done` 锁定场景下均可更新（`done` 仅禁止状态变更，内容是否可改由实现定——**本期**：`done` 任务仅可读，PATCH 非 status 字段亦拒绝，与 BR-009 一致）。

### 打刻数据（BR-010）

- 用户 **不能** 通过 API/UI 创建打刻；`AttendanceService` 仅 `list`、`getStatistics`（读路径）。
- 示例记录由 `packages/infrastructure/db/seed.ts` 插入，供 US-020/021 验收。
- 跨日工时：`work_date` 取**出勤时** Asia/Tokyo 日历日（US-021 边界）。

## API 设计

### 认证 API

```typescript
// POST /api/auth/login
Request:
{
  "email": "test@example.com",
  "password": "password123"
}

Response (200):
{
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "テストユーザー"
  },
  "token": "jwt_token"
}

Response (401):
{
  "error": "INVALID_CREDENTIALS",
  "message": "メールアドレスまたはパスワードが正しくありません"
}
```

### 任务 API

```typescript
// GET /api/tasks
Response (200):
{
  "tasks": [
    {
      "id": "uuid",
      "title": "タスク 1",
      "description": "説明",
      "status": "todo",
      "dueDate": "2025-01-20",
      "createdAt": "2025-01-15T09:00:00Z"
    }
  ]
}

// POST /api/tasks
Request:
{
  "title": "新しいタスク",
  "description": "説明（任意）",
  "dueDate": "2025-01-25"
}

Response (201):
{
  "id": "uuid",
  "title": "新しいタスク",
  // ...
}

// PATCH /api/tasks/:id
Request:
{
  "status": "in_progress"
}

Response (200):
{
  "id": "uuid",
  "status": "in_progress",
  // ...
}

// DELETE /api/tasks/:id
Response (204): No Content

// PATCH /api/tasks/:id — 非法状态迁移
Response (400):
{
  "error": "INVALID_STATE_TRANSITION",
  "message": "無効な状態遷移です"
}
```

### 打卡 API（本期只读）

> **范围**：PRD F-007/F-008；**不含** `POST` 打刻。Wiki `打卡API.md` 中 POST 段落标为后续迭代。

```typescript
// GET /api/attendance?startDate=2025-01-01&endDate=2025-01-31
Response (200):
{
  "records": [
    {
      "id": "uuid",
      "checkInTime": "2025-01-15T09:00:00+09:00",
      "checkOutTime": "2025-01-15T18:00:00+09:00",
      "workDate": "2025-01-15"
    }
  ]
}

// GET /api/attendance/statistics?startDate=2025-01-01&endDate=2025-01-31
Response (200):
{
  "dailyStats": [
    {
      "date": "2025-01-15",
      "workHours": 8.5
    }
  ],
  "totalHours": 160.5
}
```

### 前端路由与鉴权（US-003）

| 路径 | 鉴权 |
|------|------|
| `/login` | 公开 |
| `/tasks`, `/attendance`, `/dashboard` 等 | 需登录；未登录 → `Navigate` 至 `/login` |

React Router 守卫 + API `Authorization: Bearer`；401 时清除 token 并跳转登录。

## 时区处理策略

### 核心原则

1. **数据库存储**: UTC
2. **API 输入输出**: 明确时区标识（ISO 8601）
3. **前端展示**: Asia/Tokyo (UTC+9)

### 实现方案

```typescript
// 后端：存储 UTC
const record = {
  checkInTime: new Date('2025-01-15T09:00:00+09:00'), // 自动转为 UTC 存储
};

// 后端：返回带时区的信息
return {
  checkInTime: record.checkInTime.toISOString(), // "2025-01-15T00:00:00.000Z"
};

// 前端：转换为本地时区显示
const displayTime = new Date(apiResponse.checkInTime).toLocaleString('ja-JP', {
  timeZone: 'Asia/Tokyo',
  hour12: false,
});
// 出力：2025/1/15 9:00
```

### Zod Schema 时区处理

读路径查询参数示例（打刻一覧）：

```typescript
const attendanceQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
```

> `POST` 打刻请求体验证（`attendanceSchema`）留待后续迭代，本期不实现。

## 错误处理

### 统一错误响应

```typescript
interface ErrorResponse {
  error: string;        // 错误码（程序使用）
  message: string;      // 错误消息（用户显示，日文）
  details?: any;        // 详细错误信息（验证失败等）
}
```

### 错误码定义

```typescript
enum ErrorCode {
  // 认证错误
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  
  // 验证错误
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_STATE_TRANSITION = 'INVALID_STATE_TRANSITION',
  
  // 资源错误
  NOT_FOUND = 'NOT_FOUND',
  
  // 服务器错误
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}
```

### Fastify 错误处理

```typescript
// apps/api/plugins/error-handler.ts
app.setErrorHandler((error, request, reply) => {
  if (error instanceof ValidationError) {
    return reply.status(400).send({
      error: ErrorCode.VALIDATION_ERROR,
      message: '入力内容に不備があります',
      details: error.details,
    });
  }
  
  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      error: ErrorCode.UNAUTHORIZED,
      message: '認証が必要です',
    });
  }
  
  // 未知错误
  app.log.error(error);
  return reply.status(500).send({
    error: ErrorCode.INTERNAL_ERROR,
    message: 'サーバーエラーが発生しました',
  });
});
```

## 测试策略

### 测试金字塔

```
           /\
          /  \
         / E2E \        (10%) - 关键用户流程
        /______\
       /        \
      /  Integration \  (20%) - API 集成测试
     /______________\
    /                \
   /    Unit Tests    \ (70%) - 单元测试
  /____________________\
```

### 测试文件组织

```
apps/
├── web/
│   └── src/
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   └── LoginForm.test.tsx
│       └── pages/
│           ├── TasksPage.tsx
│           └── TasksPage.test.tsx
└── api/
    └── src/
        ├── routes/
        │   ├── tasks.ts
        │   └── tasks.test.ts
        └── services/
            ├── task.service.ts
            └── task.service.test.ts

packages/
├── domain/
│   └── entities/
│       ├── task.ts
│       └── task.test.ts
└── infrastructure/
    └── repositories/
        ├── task.repository.ts
        └── task.repository.test.ts
```

## 性能优化

### 数据库索引

```sql
-- 任务查询优化
CREATE INDEX tasks_user_id_status_idx ON tasks(user_id, status);

-- 打卡记录查询优化
CREATE INDEX attendance_user_id_work_date_idx ON attendance_records(user_id, work_date);
```

### 避免 N+1 查询

```typescript
// ❌ 错误示例
const users = await db.select().from(users);
for (const user of users) {
  const tasks = await db.select()
    .from(tasks)
    .where(eq(tasks.userId, user.id));
}

// ✅ 正确示例
const users = await db.select().from(users);
const userIds = users.map(u => u.id);
const tasks = await db.select()
  .from(tasks)
  .where(inArray(tasks.userId, userIds));
```

## 安全考虑

### 密码加密

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### SQL 注入防护

- 使用 Drizzle ORM 参数化查询
- 不拼接 SQL 字符串

### XSS 防护

- React 自动转义输出
- 不直接使用 `dangerouslySetInnerHTML`

## 部署架构

```
┌─────────────┐     ┌─────────────┐
│   Nginx     │────▶│   Fastify   │
│  (Reverse   │     │    (API)    │
│   Proxy)    │     └─────────────┘
└─────────────┘              │
       │                     ▼
       │            ┌─────────────┐
       │            │ PostgreSQL  │
       │            └─────────────┘
       │
       ▼
┌─────────────┐
│    Vite     │
│  (Static)   │
└─────────────┘
```

## 监控和日志

### 日志级别

```typescript
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}
```

### 日志内容

```typescript
// 请求日志
app.log.info({
  level: LogLevel.INFO,
  message: 'Request received',
  requestId: id(),
  method: request.method,
  url: request.url,
  userId: request.user?.id,
});

// 错误日志（不记录敏感信息）
app.log.error({
  level: LogLevel.ERROR,
  message: 'Database error',
  requestId: id(),
  errorCode: error.code,
  // 不记录：密码、token、完整 SQL
});
```
