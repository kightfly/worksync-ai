# 打卡 API

> **文档类型**：📋 设计契约  
> **实现状态**：📋 未实现；**本期仅 GET**（PRD 0.2 / `design.md` 0.2）  
> **最后核对**：2026-07-21  
> **真相源**：[`design.md`](../../../designdoc/specs/design.md) | [`.cursor/rules/timezone.mdc`](../../../.cursor/rules/timezone.mdc)  
> **审查跟踪**：[`wiki-audit-status.md`](../../../designdoc/delivery/wiki-audit-status.md)

## 概述

打刻記録の**閲覧**と日次集計（US-020/021；BR-010 seed 数据）。时间 **DB 存 UTC**；**展示 Asia/Tokyo**；`workDate` 按东京日历日。

| 本期（P0/P1） | 后续迭代 |
|---------------|----------|
| `GET /api/attendance`、`GET /api/attendance/statistics` | `POST /api/attendance` 出勤/退勤 |

## POST /api/attendance（后续迭代 · 本期不实现）

打刻（出勤/退勤）。**不在 PRD 0.2 范围**；以下契约供未来需求参考。

**请求头**

```
Authorization: Bearer <token>
```

**请求体**

```json
{
  "type": "clock_in",
  "timestamp": "2025-01-15T00:00:00.000Z"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `clock_in` \| `clock_out` | 必填 |
| `timestamp` | ISO 8601 | 可选，默认当前 UTC |

**成功** `201`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "checkInTime": "2025-01-15T00:00:00.000Z",
    "checkOutTime": null,
    "workDate": "2025-01-15",
    "createdAt": "2025-01-15T00:00:00.000Z"
  }
}
```

**错误**

| HTTP | 代码 | 说明 |
|------|------|------|
| 400 | `VALIDATION_ERROR` | 类型无效 |
| 409 | `ALREADY_CLOCKED_IN` | 本日已出勤 |
| 409 | `NOT_CLOCKED_IN` | 未出勤退勤 |

## GET /api/attendance

记录列表（US-020）；按 `workDate` / 时间降序。

**查询参数**

| 参数 | 说明 |
|------|------|
| `startDate` | `YYYY-MM-DD`（东京日历筛选语义，实现须与 domain 一致） |
| `endDate` | `YYYY-MM-DD` |

**成功** `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "checkInTime": "2025-01-15T00:00:00.000Z",
      "checkOutTime": "2025-01-15T09:00:00.000Z",
      "workDate": "2025-01-15"
    }
  ]
}
```

> `design.md` 使用 `"records"` 键名；实现时与全局 `{ success, data }` 或 design 统一（TASK 门禁项）。

## GET /api/attendance/statistics

日次集计（US-021）。

**查询参数**：`startDate`、`endDate`（同上）

**成功** `200`（对齐 design.md 语义）

```json
{
  "success": true,
  "data": {
    "dailyStats": [
      {
        "date": "2025-01-15",
        "workHours": 8.5
      }
    ],
    "totalHours": 160.5
  }
}
```

## 时区处理（必须）

遵循 [编码指引](../编码指引.md) 与 `timezone.mdc`：

| 层 | 规则 |
|----|------|
| DB | `check_in_time` / `check_out_time`：**UTC**（`timestamptz`） |
| API | ISO 8601（推荐带 `Z` 或偏移） |
| `workDate` | **Asia/Tokyo 日历日**（业务日，非 UTC 日界简单截取） |
| 前端展示 | 转为 Tokyo 墙钟 |

**示例**

```
DB/API (UTC):  2025-01-15T00:00:00.000Z
东京展示:       2025-01-15 09:00
workDate:      2025-01-15  （东京日）
```

**测试要求**：跨日边界、仅有 checkIn 无 checkOut、工时计算（⑨ 集成 + 单测）。

## 业务规则

- 每日出勤一次（409）
- 退勤前须已出勤
- 工时 = checkOut − checkIn（小时，小数可接受）

## 相关文档

- [API 参考](API参考.md)
- [AttendanceRecord](../数据模型/AttendanceRecord.md)
- [数据库 Schema](../数据模型/数据库Schema与迁移.md)
