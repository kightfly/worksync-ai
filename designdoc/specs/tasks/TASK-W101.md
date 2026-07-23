# TASK-W101

## 元信息

| 项 | 值 |
|----|-----|
| **标题** | 登录 / 登出 / 路由守卫 UI |
| **状态** | done |
| **依赖** | A101 |
| **契约版本** | design.md `0.1.0-replay` §2 |
| **对应 US / V** | US-001～003；V-002、V-004、V-005；E2E-001～003、007 |

## 目标

实现 `/login`、AuthProvider、保护路由守卫、ログアウト；表单 zod 日文校验；登录成功进 `/dashboard`。

## 边界（做 / 不做）

- **做**：LoginPage、AppLayout 壳、UserMenu ログアウト、路由守卫
- **不做**：タスク/打刻完整业务页以外的扩展

## 涉及文件

- `apps/web/src/pages/LoginPage.tsx`
- `apps/web/src/auth/*`
- `apps/web/src/pages/AppLayout.tsx`

## 失败测试（红灯意图）

- 非法邮箱 zod 失败（日文）
- 无 token 访问 `/tasks` → 重定向 `/login`

## 验收标准

- [x] US-001～003 UI 行为满足
- [x] 错误文案与 design §2.5 一致
- [x] Token 登出后清除

## 证据（⑧ 回写）

```bash
npm run test -w @gienharness/web
# LoginPage.test / ProtectedRoute.test passed
```

- 红灯次数：—
- 升级给人：否

## 门禁

- [x] 可独立验证
- [x] 可供 W102/W103
