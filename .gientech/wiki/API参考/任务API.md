# 任务 API

> **文档类型**：📋 设计契约  
> **实现状态**：📋 全部端点未实现  
> **最后核对**：2026-07-21  
> **真相源**：[`design.md`](../../../designdoc/specs/design.md) | [`user-stories.md`](../../../designdoc/specs/user-stories.md) US-010–013  
> **审查跟踪**：[`wiki-audit-status.md`](../../../designdoc/delivery/wiki-audit-status.md)

## 概述

当前用户任务的 CRUD 与状态流转。**须 JWT 鉴权**；用户只能访问 `user_id` 为自己的任务。

## 通用

**请求头（除公开路由外）**

```
Authorization: Bearer <token>
```

## GET /api/tasks

任务列表；默认按 `created_at` 降序（用户故事 US-011）。

**查询参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| `status` | `todo` \| `in_progress` \| `done` | 可选筛选 |

**成功** `200`（示例）

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "週報の作成",
      "description": "説明",
      "status": "in_progress",
      "dueDate": "2025-01-20",
      "userId": "uuid",
      "createdAt": "2025-01-15T09:00:00.000Z",
      "updatedAt": "2025-01-15T09:00:00.000Z"
    }
  ]
}
```

## POST /api/tasks

创建任务（US-010）。

**请求体**

```json
{
  "title": "新しいタスク",
  "description": "説明（任意）",
  "dueDate": "2025-01-25"
}
```

**校验**

| 字段 | 规则 |
|------|------|
| `title` | **必填**（PRD BR-003） |
| `description` | 可选 |
| `dueDate` | 可选，ISO 8601 日期 |

**成功** `201` — 返回创建后的任务对象。

## GET /api/tasks/:id

单条详情。

**错误**：404 `NOT_FOUND`；403 `FORBIDDEN`（非本人）。

## PATCH /api/tasks/:id

更新任务（US-012）。**以 `design.md` 为准使用 PATCH**（非 PUT）。

**请求体（部分更新）**

```json
{
  "title": "修正タイトル",
  "description": "説明",
  "status": "done",
  "dueDate": "2025-01-26"
}
```

**状态流转**

```
todo → in_progress → done
  ↑         │
  └─────────┘  （允许回退至 todo）
```

非法流转 → 400 `VALIDATION_ERROR`。

**成功** `200` — 更新后完整对象。

## DELETE /api/tasks/:id

删除任务（US-013）；删除前 UI 确认（Q-002 待产品确认）。

**成功** `200` 或 `204`（实现 TASK 与 design.md 对齐：`204 No Content` 亦可）

```json
{
  "success": true,
  "data": { "message": "タスクを削除しました" }
}
```

**错误**：404 / 403 同上。

## 实现检查清单（⑧ TASK）

- [ ] Zod schema 与日文错误消息
- [ ] Repository 按 `user_id` 过滤
- [ ] 单测 + 路由集成测试（真实 DB）
- [ ] E2E：创建→一覧→更新→削除

## 相关文档

- [API 参考](API参考.md)
- [Task 实体](../数据模型/Task.md)
- [业务逻辑层](../业务逻辑层/业务逻辑层.md) — TaskService 📋
