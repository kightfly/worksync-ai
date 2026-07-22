# 交付状态表（delivery-state）

> **用途**：四阶十二步的唯一进度真相源。每步更新「状态 / 输入 / 输出 / 阻塞项」。  
> **维护者**：Agent 在门禁通过或受阻时必须回写；人可覆盖确认。  
> **相关**：`AGENTS.md`、`harness-alignment-status.md`、`.gientech/rules/4p12s-gates.mdc`

**最近更新**：2026-07-22  
**当前焦点步骤**：**③ 生成 PRD**

---

## 状态图例

| 状态 | 含义 |
|------|------|
| `not_started` | 未开始 |
| `in_progress` | 进行中 |
| `blocked` | 有阻塞，不可进下一步 |
| `gate_pending` | 产出已有，待人确认门禁 |
| `done` | 门禁通过，可进下一步 |

---

## 护栏约定（replay）

| 项 | 约定 |
|----|------|
| 技术栈 | React 19 + Vite / Fastify / PostgreSQL + Drizzle / Vitest + Playwright（见 `整体设计.md` §2） |
| 模块边界 | UI → API → Domain → Infrastructure；Domain 无外部依赖 |
| 语言 | 代码、UI、种子数据、错误提示：**日文** |
| ⑧ 前禁止 | 创建 `apps/`、`packages/`、根 `package.json`、业务实现代码 |

---

## 全局阻塞项（不阻止①完成）

| 阻塞项 | 预期解除步骤 |
|--------|--------------|
| 无根 `package.json`；`npm test` / `lint` / `e2e` 脚本不存在 | ⑧ |
| 无 `DATABASE_URL` / 本地 DB 配置 | ⑧ |
| 无 CI workflow | ⑪ 前 |

---

## 十二步状态

| # | 步骤 | 状态 | 输入 | 输出（路径） | 阻塞项 / 备注 |
|---|------|------|------|--------------|---------------|
| ① | 流程初始化 | `done` | `AGENTS.md`、`整体设计.md`、`.gientech/skills/`、`.gientech/rules/` | `designdoc/delivery/delivery-state.md`、`harness-alignment-status.md`、`designdoc/specs/raw-input.md`、`.gientech/wiki/`（最小占位 4 页） | 测试 scripts 待⑧；Wiki 仅占位 |
| ② | 业务需求确认 | `done` | `raw-input.md` → `整体设计.md` | `designdoc/specs/requirements-register.md` | Q-001/Q-002 已关闭 |
| ③ | 生成 PRD | `not_started` | `requirements-register.md` | `designdoc/specs/prd.md` | — |
| ④ | 用户故事 | `not_started` | `prd.md` | `designdoc/specs/user-stories.md` | — |
| ⑤ | 技术设计 | `not_started` | `user-stories.md` | `designdoc/specs/design.md` | — |
| ⑥ | 验证计划 | `not_started` | `design.md` | `designdoc/verification/verification-plan.md` | — |
| ⑦ | 任务拆分 | `not_started` | 设计 + 验证计划 | `designdoc/tasks.md`、`designdoc/tasks/TASK-*.md` | — |
| ⑧ | 执行开发 | `not_started` | TASK | `apps/`、`packages/`、单测 | 无 package.json / DB |
| ⑨ | 集成测试 | `not_started` | ⑧ | `designdoc/verification/verification-result.md` | 依赖⑧ |
| ⑩ | E2E 测试 | `not_started` | ⑨ | `apps/web/e2e/`、Playwright 报告 | 依赖⑧⑨ |
| ⑪ | Git 提交推送 | `not_started` | ⑩ | 对齐检查清单 | 无 CI |
| ⑫ | 测试环境部署 | `not_started` | ⑪ | `designdoc/delivery/deploy-log.md` | 依赖⑧ |

---

## 当前会话检查清单（Agent）

开始工作时：

- [ ] 已读本表与 `harness-alignment-status.md`
- [ ] 明确「只推进当前允许的步骤」，不跳过门禁
- [ ] 执行步骤时打开对应 `.gientech/skills/4p12s-*.md`

结束工作时：

- [ ] 更新相关步骤的状态 / 输出路径 / 阻塞项
- [ ] 若完成 Harness 对齐子任务，同步 `harness-alignment-status.md`

---

## 下一步

**③ 生成 PRD** → Skill：`.gientech/skills/4p12s-prd.md`  
输入：`designdoc/specs/requirements-register.md`  
产出：`designdoc/specs/prd.md`
