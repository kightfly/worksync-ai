# TASK-C202: 登出 API

## 元信息

- 标题：POST /api/auth/logout
- 状态：done
- 依赖：C201
- 对应：US-002 / V-003 / E2E-005

## 实现

无状态 JWT 登出：服务端校验 Bearer Token 有效性后返回成功；客户端负责清除本地 Token。

| 组件 | 说明 |
|------|------|
| `POST /api/auth/logout` | 需 `Authorization: Bearer <token>` |
| `AuthService.verifyToken` | JWT 校验（供后续中间件复用） |
| `AuthService.logout` | 校验通过后返回 `{ message: "ログアウトしました" }` |
| `lib/auth-header.ts` | `extractBearerToken` 工具 |

## 契约

- 200：`{ message: "ログアウトしました" }`
- 401：`UNAUTHORIZED`（无 Header / 无效 Token）

## 证据

```bash
npm run test -w apps/api
# auth.service.test.ts 6 passed
# auth.test.ts 6 passed（含 login→logout 集成）
```

## 门禁

- [x] 有效 Token 登出成功
- [x] 无/无效 Token 返回 401
- [x] 测试证据齐全
