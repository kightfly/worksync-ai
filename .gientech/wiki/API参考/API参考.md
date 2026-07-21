# API 参考

> **文档类型**：📋 设计契约（目标 API）  
> **实现状态**：🟡 仅 `GET /health` 已实现；下表 `/api/*` 均未注册  
> **最后核对**：2026-07-21  
> **真相源**：[`designdoc/specs/design.md`](../../../designdoc/specs/design.md) | [`apps/api/src/server.ts`](../../../apps/api/src/server.ts)  
> **审查跟踪**：[`wiki-audit-status.md`](../../../designdoc/delivery/wiki-audit-status.md)

## 重要说明

本文档描述 **目标 REST API**，供 4p12s ⑤ 契约与 ⑦⑧ TASK 实现使用。**不是**当前运行中接口清单。

| 已实现（护栏） | 路径 | 说明 |
|----------------|------|------|
| ✅ | `GET /health` | `{ "status": "ok" }`，无 `/api` 前缀 |

业务端点实现后须：注册路由 → 集成测试 → E2E（禁 Mock）→ 回写本文档状态列。

## 总览

- **框架**：Fastify（`apps/api`）
- **目标基础路径**：`/api`
- **目标认证**：JWT Bearer Token（📋 Auth TASK）
- **内容类型**：`application/json`
- **响应约定**：成功/失败包装见 [编码指引](../编码指引.md)；`design.md` 中部分示例为简化形态，**实现以统一错误模型为准**

## 认证机制（设计 📋）

1. `POST /api/auth/login` 获取 Token  
2. 请求头 `Authorization: Bearer <token>`  
3. 鉴权中间件验证并注入用户上下文  

| 项目 | 设计值 |
|------|--------|
| 算法 | HS256 |
| 密钥 | `JWT_SECRET` 环境变量 |
| 有效期 | 24h（可调，须在实现 TASK 固定） |
| Payload | `{ userId, email }`（最小集） |

## 端点索引（设计 📋）

### 认证

| 方法 | 路径 | 说明 | 认证 | 实现 |
|------|------|------|------|------|
| POST | `/api/auth/login` | 登录 | 否 | 📋 |
| POST | `/api/auth/logout` | 登出 | 是 | 📋 |

→ [认证 API](认证API.md)

### 任务

| 方法 | 路径 | 说明 | 认证 | 实现 |
|------|------|------|------|------|
| GET | `/api/tasks` | 列表 | 是 | 📋 |
| POST | `/api/tasks` | 创建 | 是 | 📋 |
| GET | `/api/tasks/:id` | 详情 | 是 | 📋 |
| PATCH | `/api/tasks/:id` | 更新（**design.md 为 PATCH**） | 是 | 📋 |
| DELETE | `/api/tasks/:id` | 删除 | 是 | 📋 |

→ [任务 API](任务API.md)

### 打卡

| 方法 | 路径 | 说明 | 认证 | 实现 |
|------|------|------|------|------|
| POST | `/api/attendance` | 出勤/退勤打刻 | 是 | 📋 |
| GET | `/api/attendance` | 记录列表 | 是 | 📋 |
| GET | `/api/attendance/statistics` | 日次统计 | 是 | 📋 |

→ [打卡 API](打卡API.md)

## 错误处理（目标）

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "日文メッセージ",
    "details": []
  }
}
```

### 常见错误码

| HTTP | 代码 | 说明 |
|------|------|------|
| 400 | `VALIDATION_ERROR` | 校验失败 |
| 401 | `UNAUTHORIZED` | 未认证 / Token 无效 |
| 401 | `INVALID_CREDENTIALS` | 登录失败（统一日文，不泄露账号是否存在） |
| 403 | `FORBIDDEN` | 无权限 |
| 404 | `NOT_FOUND` | 资源不存在 |
| 409 | `CONFLICT` | 冲突 |
| 409 | `ALREADY_CLOCKED_IN` | 当日已出勤 |
| 409 | `NOT_CLOCKED_IN` | 未出勤退勤 |
| 429 | `RATE_LIMIT_EXCEEDED` | 频率限制 |
| 500 | `INTERNAL_ERROR` | 服务器错误 |

## 与 4p12s / Skills

| 步骤 | 动作 |
|------|------|
| ⑤ 技术设计 | 契约以 `design.md` 为准；Wiki 为可读索引 |
| ⑦ 任务拆分 | 每模块独立 TASK + 失败测试 |
| ⑧ 实现 | `4p12s-implementation-execution` + TDD |
| ⑨⑩ | 真实 API 集成 / E2E |

## 相关文档

- [编码指引](../编码指引.md) — 错误格式、时区、安全
- [数据模型](../数据模型/数据模型.md) — 实体
- [业务逻辑层](../业务逻辑层/业务逻辑层.md) — Service（📋）
- [架构总览](../架构总览.md) — 仅 `/health` 现状
