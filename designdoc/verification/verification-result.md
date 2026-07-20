# E2E / 冒烟验证摘要（Phase 3）

## 环境

- 本地 Vite `apps/web`（Playwright `webServer` 自动拉起）
- 命令：`npm run test:e2e`

## 结果（2026-07-20）

| ID | 场景 | 结果 |
|----|------|------|
| E2E-SMOKE-001 | ログイン画面が表示される | ✅ passed |

## 说明

- 当前为护栏冒烟，**非**完整 AC-001 登录成功链路
- 业务 E2E 在 AUTH/タスク实现后于 4p12s ⑩ 扩展
