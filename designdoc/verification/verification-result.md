# 验证结果（verification-result）

> **步骤**：⑨ 集成测试  
> **日期**：2026-07-23  
> **环境**：真 PostgreSQL（`.env.local` → `DATABASE_URL`，Supabase pooler `prepare: false`）  
> **禁 Mock**：未 Mock DB / Repository；Fastify `inject` + 真 Drizzle

---

## 1. 执行摘要

| 项 | 结果 |
|----|------|
| 门禁结论 | **通过**（可进⑩） |
| 集成套件 | `apps/api/src/api.integration.test.ts` |
| 命令 | `node scripts/run-integration.mjs`（含 migrate/seed + `npm run test:integration -w @gienharness/api`） |
| 结果 | **16 passed / 0 failed** |
| 耗时 | ~13s（仅 vitest；含 migrate/seed 约 40s） |

---

## 2. 覆盖对照（验证计划 · 集成段）

| ID | 要点 | 结果 | 备注 |
|----|------|------|------|
| V-001 | 登录成功 token+user | pass | 真 DB 用户 |
| V-003 | 错误密码统一日文 | pass | `UNAUTHORIZED` |
| V-006 | 无 JWT → `/api/tasks` 401 | pass | |
| V-007 | 创建任务默认 `todo` | pass | |
| V-008 | 空标题 → 400 | pass | |
| V-009 | 一覧 `createdAt` 降序 | pass | |
| V-011 | `todo`→`in_progress` | pass | |
| V-012 | `in_progress`→`done` | pass | |
| V-013 | `in_progress`→`todo` | pass | |
| V-014 | `todo`→`done` 非法 | pass | `INVALID_STATE_TRANSITION` |
| V-015 | `done` 禁止 PATCH | pass | |
| V-016 | 非 done 可改标题 | pass | |
| V-019 | 打刻时刻 `+09:00` | pass | 测试自备 seed 等价数据 |
| V-021 | 日次集計分钟 | pass | 540 / 180 |
| V-022 | 跨日 `work_date` | pass | 出勤 Tokyo 日 |
| V-023 | `GET /health` 无需认证 | pass | |
| V-024 | 越权 PATCH 他人任务 | pass | 404 |

**留⑩（E2E 为主）**：V-002、V-004、V-005、V-010、V-017、V-018、V-020 等。  
**单元已覆盖（⑧）**：V-025、V-026 等 Domain/密码哈希。

---

## 3. 禁 Mock 自检

| 节点 | 是否 Mock | 说明 |
|------|-----------|------|
| PostgreSQL | 否 | 真实 `DATABASE_URL` |
| User/Task/Attendance Repository | 否 | 生产同款 Drizzle |
| JWT / bcrypt | 否 | 真实签发与校验 |
| HTTP | inject | 进程内 Fastify，非假契约 |

---

## 4. 失败与阻塞

无。历史注意：库内旧 seed 出勤日期可能与文档不一致；集成用例改为自插入已知记录，避免假绿依赖脏数据。

---

## 5. 复现步骤

```bash
# 需已配置 .env.local（DATABASE_URL / JWT_SECRET）
node scripts/run-integration.mjs
# 或分步：
# npm run build -w @gienharness/domain && npm run build -w @gienharness/infrastructure
# npm run db:migrate && npm run db:seed
# npm run test:integration -w @gienharness/api
```

---

## 6. 下一步

**⑩ E2E 测试** → Skill：`.gientech/skills/4p12s-e2e-test.md`（Playwright + 真 API/DB）
