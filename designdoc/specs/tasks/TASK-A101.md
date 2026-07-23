# TASK-A101

## 元信息

| 项 | 值 |
|----|-----|
| **标题** | Auth + Health API |
| **状态** | done |
| **依赖** | I101 |
| **契约版本** | design.md `0.1.0-replay` §3.2、§4 |
| **对应 US / V** | US-001～003、030；V-001、V-003、V-006、V-023、V-026 |

## 目标

实现 `GET /health`、`POST /api/auth/login`、`POST /api/auth/logout`；JWT 签发与鉴权插件；登录失败统一日文消息。

## 边界（做 / 不做）

- **做**：Fastify 路由 + Application + UserRepository；bcrypt 校验
- **不做**：Tasks/Attendance 业务；前端页面（W101）

## 涉及文件

- `apps/api/src/routes/auth.ts`
- `apps/api/src/auth/jwt.ts`
- `apps/api/src/auth/plugin.ts`
- `apps/api/src/auth/jwt.test.ts`

## 失败测试（红灯意图）

- 正确登录 → 200 + token + user（集成 ⑨）
- 错误密码 → 统一「メールアドレスまたはパスワードが正しくありません」
- 无 token 访问受保护路由 → 401
- `/health` 无认证 2xx
- 密码 bcrypt 哈希形态（单元）

## 验收标准

- [x] 契约路径/字段与 design 一致
- [x] 密钥来自环境变量
- [x] 相关单测覆盖哈希与错误模型

## 证据（⑧ 回写）

```bash
npm run test -w @gienharness/api
# jwt.test.ts / errors.test.ts passed
```

- 红灯次数：—
- 升级给人：否

## 门禁

- [x] 可独立验证
- [x] 测试证据齐全 → 可供 W101 / A102
