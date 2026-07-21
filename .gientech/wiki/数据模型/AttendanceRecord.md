# AttendanceRecord 实体

> **文档类型**：📋 设计契约  
> **实现状态**：📋 表未迁移；Repository / AttendanceService 未实现  
> **最后核对**：2026-07-21  
> **真相源**：[`design.md`](../../../designdoc/specs/design.md) §数据模型  
> **审查跟踪**：[`wiki-audit-status.md`](../../../designdoc/delivery/wiki-audit-status.md)

## 表名

`attendance_records`

## 字段定义

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | 主键 |
| `user_id` | UUID | FK → users.id, NOT NULL | 所属用户 |
| `check_in_time` | TIMESTAMPTZ | NOT NULL | 出勤时间 (UTC) |
| `check_out_time` | TIMESTAMPTZ | NULL 可空 | 退勤时间 (UTC) |
| `work_date` | DATE | NOT NULL | 工作日期 (Asia/Tokyo 日) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 创建时间 (UTC) |

> 本表 **无** `updated_at` 字段。

## Drizzle Schema（设计契约）

```typescript
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

## 时区处理

这是本实体最关键的业务规则：

| 字段 | 存储方式 | 说明 |
|------|---------|------|
| `check_in_time` | UTC TIMESTAMPTZ | 出勤时的 UTC 时间 |
| `check_out_time` | UTC TIMESTAMPTZ | 退勤时的 UTC 时间 |
| `work_date` | DATE | 按出勤时的 **Asia/Tokyo** 日期计算 |

### 示例

```
出勤操作（东京时间 2024-01-15 09:00）:
  check_in_time = 2024-01-15T00:00:00.000Z  (UTC)
  work_date     = 2024-01-15                 (Asia/Tokyo 日期)

退勤操作（东京时间 2024-01-15 18:00）:
  check_out_time = 2024-01-15T09:00:00.000Z  (UTC)

前端展示:
  出勤: 09:00 (Asia/Tokyo)
  退勤: 18:00 (Asia/Tokyo)
  工时: 9.0 小时
```

### 跨日场景

```
出勤（东京时间 2024-01-15 23:00）:
  check_in_time = 2024-01-15T14:00:00.000Z
  work_date     = 2024-01-15

退勤（东京时间 2024-01-16 02:00）:
  check_out_time = 2024-01-15T17:00:00.000Z

work_date 仍为 2024-01-15（按出勤时日期）
```

## 业务规则

- **每日一条**：同一用户同一 `work_date` 只能有一条出勤记录
- **出勤先于退勤**：`check_out_time` 必须晚于 `check_in_time`
- **退勤前须出勤**：不能在未出勤的情况下退勤
- **工时计算**：`workHours = (checkOutTime - checkInTime) / 3600_000`（毫秒转小时）

## 关联关系

| 关联 | 类型 | 说明 |
|------|------|------|
| AttendanceRecord → User | 多对一 | 打卡记录属于一个用户 |

## API 端点（📋 未实现）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/attendance` | 获取打卡记录列表（`design.md` 已定义） |
| GET | `/api/attendance/statistics` | 按日统计（`design.md` 已定义） |
| POST | `/api/attendance` | 打刻（出勤/退勤）；见 [打卡 API](../API参考/打卡API.md)，**用户故事扩展**，实现 TASK 须回写 `design.md` |

## 相关文档

- [数据模型](数据模型.md) — 实体总览
- [打卡 API](../API参考/打卡API.md) — API 端点详情
- [业务逻辑层](../业务逻辑层/业务逻辑层.md) — AttendanceService（📋）
- [编码指引](../编码指引.md) — 时区规则
