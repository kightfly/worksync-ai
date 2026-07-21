# 交付状态表（delivery-state）

> **用途**：四阶十二步的唯一进度真相源。每步更新「状态 / 输入 / 输出 / 阻塞项」。  
> **维护者**：Agent 在门禁通过或受阻时必须回写；人可覆盖确认。  
> **相关**：`AGENTS.md`、`harness-alignment-status.md`、`.cursor/rules/4p12s-gates.mdc`

**最近更新**：2026-07-21  
**当前焦点步骤**：**⑤⑥ 已确认**；下一步 **⑦ 任务细化** → **⑧ TDD**

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
| ① | 流程初始化 | `done` | AGENTS、学习资料 | delivery/*、4p12s skills、Playwright、CI | Harness Phase1–4 齐 |
| ② | 业务需求确认 | `done` | 旧 requirements | `requirements-register.md` | 2026-07-21：BR-007～010、AC 补全、Q-001/Q-002 闭合 |
| ③ | 生成 PRD | `done` | 登记表 | `prd.md` v0.2.0 | 任务状态机、打刻只读范围已确认 |
| ④ | 用户故事 | `done` | PRD | `user-stories.md` | US-003/012 子场景、边界 GWT 已补 |
| ⑤ | 技术设计 | `done` | 用户故事 | `design.md` v0.2.0 | 状态机、打刻只读、INVALID_STATE_TRANSITION |
| ⑥ | 验证计划 | `done` | 技术设计 | `verification/verification-plan.md` | 测试矩阵 + E2E 最小集 |
| ⑦ | 任务拆分 | `gate_pending` | 设计+验证计划 | `tasks.md` + `tasks/` | Phase 任务已有；可按 V-* 细化 TASK |
| ⑧ | 执行开发 | `blocked` | TASK | 代码 + 测试证据 | 可启动 TASK-B101 等领域层；依赖 ⑦ 确认 |
| ⑨ | 集成测试 | `not_started` | ⑧ | `verification-result.md` | API `/health` 可作集成起点 |
| ⑩ | E2E 测试 | `in_progress` | ⑨ | `apps/web/e2e/` | **冒烟已过**；业务主路径待 ⑧ |
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

✅ Phase 0–4 完成；✅ Wiki 全量审查完成。

### B. 产品交付（推荐链路）

1. **⑦** 按 `verification-plan.md` 细化/确认 `tasks.md` 与 `TASK-xxx.md`
2. **⑧** 从 `TASK-B101`（User 实体）/ `TASK-B102`（Task 状态机）TDD 起步
3. ⑨⑩ 集成 + E2E 按 V-* / E2E-* 执行

### C. 规格变更摘要（2026-07-21）

- 打刻范围：**只读**（一覧 + 集計）；seed 数据；**不含**出勤/退勤 API
- 任务状态机：BR-007～009 + US-012a～e
- Q-001/Q-002 已关闭（空态文案、削除確認ダイアログ）

### D. Wiki

→ ✅ 全量完成（见 `wiki-audit-status.md`）
