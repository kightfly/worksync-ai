# TASK-I101

## 元信息

| 项 | 值 |
|----|-----|
| **标题** | Drizzle Schema / 迁移 / Seed |
| **状态** | todo |
| **依赖** | S001、B101、B102 |
| **契约版本** | design.md `0.1.0-replay` §5 |
| **对应 US / V** | F-012；seed 支撑 V-001/019/021/022 |

## 目标

实现 `users` / `tasks` / `attendance_records` 的 Drizzle schema、迁移、索引，以及演示 Seed（用户 + 打刻样例含跨日）。

## 边界（做 / 不做）

- **做**：schema、migration、seed 脚本、Repository 接口骨架（可先空实现测连通）
- **不做**：完整业务 API、UI

## 涉及文件

- `packages/infrastructure/src/schema/*`
- `packages/infrastructure/drizzle/*`（或 migrations）
- `packages/infrastructure/src/seed.ts`
- Repository 接口文件

## 失败测试（红灯意图）

- 集成向：连真 DB 跑 migrate + seed 后，可查出 seed 用户 email（⑨ 正式固化；⑧ 可先写测试标 skip 直到 DB 就绪，但不得用 Mock DB 宣称完成）
- 单元：schema 字段/枚举与 design 一致的静态断言（可选）

## 验收标准

- [ ] 三表与索引符合 design §5.3
- [ ] Seed：`test@example.com` / bcrypt(`password123`) / `テストユーザー`
- [ ] Seed 含跨日打刻样例
- [ ] 密码非明文（V-026）

## 证据（⑧ 回写）

```bash
# migrate / seed 命令与结果
```

- 红灯次数：
- 升级给人：是 / 否

## 门禁

- [ ] 可独立验证（至少 migrate+seed 可重复执行）
- [ ] 可供 A101～A103 使用
