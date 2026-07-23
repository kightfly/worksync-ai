# TASK-A101

## 元信息

| 项 | 值 |
|----|-----|
| **标题** | Auth + Health API |
| **状态** | todo |
| **依赖** | I101 |
| **契约版本** | design.md `0.1.0-replay` §3.2、§4 |
| **对应 US / V** | US-001～003、030；V-001、V-003、V-006、V-023、V-026 |

## 目标

实现 `GET /health`、`POST /api/auth/login`、`POST /api/auth/logout`；JWT 签发与鉴权插件；登录失败统一日文消息。

## 边界（做 / 不做）

- **做**：Fastify 路由 + Application + UserRepository；bcrypt 校验
- **不做**：Tasks/Attendance 业务；前端页面（W101）

## 涉及文件

- `apps/api/src/routes/health.ts`、`auth.ts`
- `apps/api/src/plugins/auth.ts`
- 集成测试文件（可 ⑧ 写用例，⑨ 在真 DB 跑全绿）

## 失败测试（红灯意图）

- 正确登录 → 200 + token + user
- 错误密码 → 统一「メールアドレスまたはパスワードが正しくありません」
- 无 token 访问受保护探针路由 → 401
- `/health` 无认证 2xx

## 验收标准

- [ ] 契约路径/字段与 design 一致
- [ ] 密钥来自环境变量
- [ ] 相关单测/集成测意图覆盖 V-001/003/006/023

## 证据（⑧ 回写）

```bash
# npm run test / test:integration ...
```

- 红灯次数：
- 升级给人：是 / 否

## 门禁

- [ ] 可独立验证
- [ ] 测试证据齐全 → 可供 W101 / A102
