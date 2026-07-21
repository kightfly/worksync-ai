# 验证计划

> Skill：`.gientech/skills/4p12s-verification-plan.md`  
> 基于：PRD 0.2.0、`user-stories.md`、`design.md` 0.2.0

## 元信息

- 基于设计/故事版本：2026-07-21
- 状态：**已确认**

## 1. 验证目标与范围

证明本期交付满足：

- 认证（登录/登出/路由守卫）
- タスク CRUD + **状态机**（合法/非法迁移）
- 打刻 **只读**（一覧 + 日次集計；seed 数据）
- 时区（DB UTC / 展示 Asia/Tokyo）
- 质量门禁：单测 → 集成（真 DB）→ E2E（禁 Mock 主路径）

**不在本期验证范围**：`POST /api/attendance` 出勤/退勤打刻。

## 2. 测试矩阵

| ID | 对应 US/AC/F | 层级 | 要点 | 禁 Mock？ |
|----|--------------|------|------|-----------|
| V-001 | US-001 / AC-001 | 集成 + E2E | 有效凭据登录 → タスク一覧 | E2E：是 |
| V-002 | US-001 / AC-002, AC-011 | 单元 + 集成 | 格式/长度错误、错误密码；统一日文消息 | 集成：是 |
| V-003 | US-002 / AC-003 | E2E | ログアウト → ログイン画面 | E2E：是 |
| V-004 | US-003 / AC-016 | E2E + 集成 | 未登录访问保护路由/API → 401 或重定向 | E2E：是 |
| V-010 | US-010 / AC-004 | 集成 + E2E | 创建任务 → 一覧显示；默认 `todo` | E2E：是 |
| V-011 | US-010 / AC-017 | 单元 | 标题为空 zod/领域校验 | 否 |
| V-012 | US-011 / AC-005, AC-010 | E2E | 降序列表；空态「タスクはありません」 | E2E：是 |
| V-013 | US-012a / AC-006 | 单元 + 集成 | `todo`→`in_progress` | 集成：是 |
| V-014 | US-012b | 单元 + 集成 | `in_progress`→`done` | 集成：是 |
| V-015 | US-012c | 单元 + 集成 | `in_progress`→`todo` | 集成：是 |
| V-016 | US-012e / AC-012 | 单元 + 集成 | `todo`→`done`、`done`→* → 400 | 集成：是 |
| V-017 | US-012d | 集成 | 更新标题/说明（状态不变） | 集成：是 |
| V-018 | US-013 / AC-007, AC-013 | E2E | 削除確認ダイアログ；确定删除/取消 | E2E：是 |
| V-020 | US-020 / AC-008, AC-014 | 集成 + E2E | 一覧 Tokyo 显示；空态「打刻記録はありません」 | 集成+seed：是 |
| V-021 | US-021 / AC-009, AC-015 | 集成 | 日次集計 + 跨勤務日边界 | 集成+seed：是 |
| V-030 | NFR-004 | 单元 + 集成 | 时间戳 UTC 存储；API ISO8601 | 集成：是 |
| V-031 | NFR-002 | 集成 | 鉴权头缺失 → 401 | 集成：是 |

### 单元测试重点文件（规划）

| 模块 | 路径 | 覆盖 |
|------|------|------|
| Task 状态机 | `packages/domain/entities/task.test.ts` | V-013～V-016 |
| 表单校验 | `apps/web/src/components/*.test.tsx` | V-011 |
| Repository | `packages/infrastructure/repositories/*.test.ts` | 与集成互补 |

## 3. 禁 Mock 节点

| 节点 | 说明 | 对应步骤 |
|------|------|----------|
| 集成-DB | 真实 PostgreSQL；`db:migrate` + `db:seed` | ⑨ |
| 集成-API | Fastify 路由 + 真 DB；不禁用 Drizzle | ⑨ |
| E2E-全链路 | Playwright：真 Web + 真 API + 真 DB | ⑩ |
| E2E-禁 Mock | 不得 MSW/mock fetch 替代业务 API | ⑩ |

**允许 Mock**：单元测试中 Repository 接口、时钟（时区边界测试可注入固定 `Date`）。

## 4. 环境与数据

| 环境 | 用途 |
|------|------|
| 本地 | `npm run dev` + 本地 Postgres + `.env` |
| CI | `.github/workflows/ci.yml`：quality + E2E（需 DB service 或 testcontainers，实现 ⑧ 时配置） |
| 测试环境 | ⑫ deploy-test Artifact |

**种子数据**（`db:seed`）须包含：

- 测试用户（已知邮箱/密码，bcrypt）
- 若干 `tasks`（各状态至少 1 条）
- 若干 `attendance_records`（含跨日边界样例，US-021）

## 5. 失败归因规则

1. **测试用例错误** — 断言/GWT 与规格不符 → 修测试  
2. **设计/契约错误** — `design.md` 与用户故事矛盾 → 回退 ⑤，修设计后再测  
3. **实现错误** — 规格与测试正确但代码失败 → TDD 修实现  

**⑧ 纪律**：同一 TASK 连续 **5 次红灯** → 停止，升级给人（`AGENTS.md`）。

## 6. E2E 最小集

| ID | 路径（日文 UI） | 优先级 | 映射 |
|----|----------------|--------|------|
| E2E-001 | ログイン（成功）→ タスク一覧表示 | P0 | V-001 |
| E2E-002 | ログイン失敗メッセージ | P0 | V-002 |
| E2E-003 | タスク作成 → 一覧に表示 | P0 | V-010 |
| E2E-004 | タスク状態 todo→in_progress→done | P0 | V-013～V-014 |
| E2E-005 | ログアウト → ログイン画面 | P0 | V-003 |
| E2E-006 | 打刻一覧表示（seed 数据） | P1 | V-020 |
| E2E-007 | 未ログインで /tasks → /login | P1 | V-004 |

现有冒烟 [`apps/web/e2e/smoke.spec.ts`](../../apps/web/e2e/smoke.spec.ts) 保留；业务路径实现后扩展为上表。

## 7. 门禁结论

- [x] 主流程与关键异常均有验证手段
- [x] 禁 Mock 范围清晰
- [x] E2E 覆盖主验收路径（可薄，随 ⑧ 扩展）
- [x] 与用户故事 / AC 可映射
- [x] **已确认**（2026-07-21）→ 下一步：⑦ 任务拆分 / ⑧ TDD
