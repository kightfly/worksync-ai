# TASK-W101

## 元信息

| 项 | 值 |
|----|-----|
| **标题** | 登录 / 登出 / 路由守卫 UI |
| **状态** | todo |
| **依赖** | A101 |
| **契约版本** | design.md `0.1.0-replay` §2 |
| **对应 US / V** | US-001～003；V-002、V-004、V-005；E2E-001～003、007 |

## 目标

实现 `/login`、AuthProvider、保护路由守卫、ログアウト；表单 zod 日文校验；登录成功进 `/dashboard`。

## 边界（做 / 不做）

- **做**：LoginPage、AppLayout 壳、UserMenu ログアウト、路由守卫
- **不做**：タスク/打刻完整业务页（可占位）

## 涉及文件

- `apps/web/src/pages/LoginPage.tsx`
- `apps/web/src/auth/*`
- `apps/web/src/routes/*`
- 组件/路由单测；E2E 用例可先写 skip 到 ⑩

## 失败测试（红灯意图）

- 非法邮箱 zod 失败（日文）
- 无 token 访问 `/tasks` → 重定向 `/login`
- 登录成功后 context 含 user（可 Mock API **仅单元**；E2E 禁 Mock）

## 验收标准

- [ ] US-001～003 UI 行为满足
- [ ] 错误文案与 design §2.5 一致
- [ ] Token 登出后清除

## 证据（⑧ 回写）

```bash
# vitest apps/web ...
```

- 红灯次数：
- 升级给人：是 / 否

## 门禁

- [ ] 可独立验证
- [ ] 可供 W102/W103
