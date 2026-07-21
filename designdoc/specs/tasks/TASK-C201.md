# TASK-C201: 登录 API

## 元信息

- 标题：POST /api/auth/login
- 状态：done
- 依赖：B203 UserRepository、B206 seed
- 对应：US-001 / V-001～V-002 / design §认证 API

## 实现

| 组件 | 路径 |
|------|------|
| 路由 | `apps/api/src/routes/auth.ts` |
| 服务 | `apps/api/src/services/auth.service.ts` |
| 校验 | `apps/api/src/schemas/auth.schema.ts`（zod） |
| 配置 | `apps/api/src/config/env.ts`（`JWT_SECRET`） |

## 契约

**POST /api/auth/login**

- 200：`{ user: { id, email, name }, token }`
- 400：`VALIDATION_ERROR`（邮箱格式 / 密码 < 6）
- 401：`INVALID_CREDENTIALS` + `メールアドレスまたはパスワードが正しくありません`

JWT：HS256，`expiresIn: 24h`，payload `{ userId, email }`

## 证据

```bash
npm run test -w apps/api
# auth.service.test.ts 3 passed
# auth.test.ts 3 passed（含 seed 用户集成）
npm run test   # 全仓 26 passed
```

- 测试用户：`test@example.com` / `password123`（seed）

## 门禁

- [x] 邮箱/密码校验
- [x] 成功返回 token
- [x] 失败统一日文消息
- [x] 测试证据齐全
