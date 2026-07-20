# 交付状态表（delivery-state）

> **用途**：四阶十二步的唯一进度真相源。每步更新「状态 / 输入 / 输出 / 阻塞项」。  
> **维护者**：Agent 在门禁通过或受阻时必须回写；人可覆盖确认。  
> **相关**：`AGENTS.md`、`harness-alignment-status.md`、`.cursor/rules/4p12s-gates.mdc`

**最近更新**：2026-07-20  
**当前焦点步骤**：**Harness 方法论对齐已完成（Phase 0–4）**；产品侧 ③/④ 待人确认，开发从 ⑥/⑦/⑧ 推进

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

## 十二步状态

| # | 步骤 | 状态 | 输入 | 输出（路径） | 阻塞项 / 备注 |
|---|------|------|------|--------------|---------------|
| ① | 流程初始化 | `done` | AGENTS、学习资料 | delivery/*、4p12s skills、Playwright、CI | Harness Phase1–3 齐 |
| ② | 业务需求确认 | `gate_pending` | 旧 requirements | `requirements-register.md` | 已迁移；请人确认 Q-001/Q-002 |
| ③ | 生成 PRD | `gate_pending` | 登记表 | `prd.md` | 已迁移；待人确认 |
| ④ | 用户故事 | `gate_pending` | PRD | `user-stories.md` | 已迁移；待人确认 |
| ⑤ | 技术设计 | `gate_pending` | 用户故事 | `design.md` | 已有汇总设计；确认后与④对齐 |
| ⑥ | 验证计划 | `not_started` | 技术设计 | `verification/verification-plan.md` | 模板已备；冒烟 E2E 已存在可写入计划 |
| ⑦ | 任务拆分 | `gate_pending` | 设计+验证计划 | `tasks.md` + `tasks/` | 有 Phase 任务；新 TASK 用模板 |
| ⑧ | 执行开发 | `blocked` | TASK | 代码 + 测试证据 | 依赖 ⑥ 与人确认 ③④；领域层未完成 |
| ⑨ | 集成测试 | `not_started` | ⑧ | `verification-result.md` | API `/health` 可作集成起点 |
| ⑩ | E2E 测试 | `in_progress` | ⑨ | `apps/web/e2e/` | **冒烟已过**；业务主路径待实现后扩展 |
| ⑪ | Git 提交推送 | `not_started` | ⑩ | commit / MR | 需用户明确授权 |
| ⑫ | 测试环境部署 | `in_progress` | ⑪ | `deploy-log.md` + CI Artifact | **deploy-test job 已就绪**；真实 URL 待团队 hosting |

---

## 当前会话检查清单（Agent）

开始工作时：

- [ ] 已读本表与 `harness-alignment-status.md`
- [ ] 明确「只推进当前允许的步骤」，不跳过门禁
- [ ] 执行步骤时打开对应 `skills/4p12s-*.md`

结束工作时：

- [ ] 更新相关步骤的状态 / 输出路径 / 阻塞项
- [ ] 若完成 Harness 对齐子任务，同步 `harness-alignment-status.md`

---

## 下一步建议

### A. Harness 对齐

✅ Phase 0–4 完成；✅ ESLint + deploy-test CI 已补。

### B. 产品交付（推荐链路）

复杂功能：

```
gienspec-specify → clarify → plan → tasks → analyze
  → 4p12s verification-plan / implementation-tasks
  → brainstorming → writing-plans → test-driven-development → verification-before-completion
  → 4p12s ⑨–⑫
```

当前可立即做：

1. 人确认 `prd.md` / `user-stories.md`（关 Q-001/Q-002）
2. ⑥ `verification-plan.md`
3. ⑦ 拆 `TASK-B101` 等领域任务 → ⑧ TDD
