# 认证 API

> **文档类型**：📋 设计契约  
> **实现状态**：📋 路由未注册；`jsonwebtoken` / `bcrypt` 未安装  
> **最后核对**：2026-07-21  
> **真相源**：[`design.md`](../../../designdoc/specs/design.md) | [`prd.md`](../../../designdoc/specs/prd.md) BR-001/002  
> **审查跟踪**：[`wiki-audit-status.md`](../../../designdoc/delivery/wiki-audit-status.md)

## 概述

JWT 无状态认证：登录、登出（设计）。**当前代码无 `/api/auth/*`。**

## POST /api/auth/login

用户登录，返回 JWT 与用户信息。

**请求体**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**成功响应** `200`（目标包装示例）

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "山田太郎"
    }
  }
}
```

> `design.md` 示例为扁平 `{ user, token }`；实现 TASK 须与 [编码指引](../编码指引.md) 统一。

**错误响应**

| HTTP | 代码 | 说明 |
|------|------|------|
| 400 | `VALIDATION_ERROR` | 邮箱格式无效或必填项缺失 |
| 401 | `INVALID_CREDENTIALS` | メールアドレスまたはパスワードが正しくありません |

**校验规则（产品真相）**

| 字段 | 规则 | 来源 |
|------|------|------|
| `email` | 必填，合法邮箱 | PRD F-001 |
| `password` | 必填，**最少 6 字符** | PRD BR-002 / 登记表 |

> **修订**：此前 Wiki 写「最少 8 字符」——与 PRD 不一致，已改为 **6**（与占位 UI `minLength={6}` 一致）。

## POST /api/auth/logout

客户端登出（设计）。

**请求头**

```
Authorization: Bearer <token>
```

**成功响应** `200`

```json
{
  "success": true,
  "data": {
    "message": "ログアウトしました"
  }
}
```

**说明（设计决策待 TASK 固定）**

- 无状态 JWT 常见做法：客户端删除 Token；服务端黑名单为可选增强
- 若采用纯客户端清除，本端点可返回 200 空操作

**错误**

| HTTP | 代码 |
|------|------|
| 401 | `UNAUTHORIZED` |

## 认证流程（目标）

```
客户端 POST /api/auth/login
  → AuthService 验证 bcrypt 哈希
  → 签发 JWT
后续请求 Authorization: Bearer <token>
  → 鉴权中间件 → 业务路由
```

## 安全（实现 TASK 须满足）

| 项 | 要求 |
|----|------|
| 密码存储 | bcrypt（cost ≥ 12，见 design.md） |
| JWT | HS256，`JWT_SECRET` |
| 错误文案 | 日文；不泄露用户是否存在 |
| 速率限制 | 📋 见 [中间件](../基础设施与中间件/中间件.md) |

## 相关文档

- [API 参考](API参考.md)
- [User 实体](../数据模型/User.md)
- [业务逻辑层](../业务逻辑层/业务逻辑层.md) — AuthService 📋
