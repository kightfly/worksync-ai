# 交付状态表（delivery-state）

> **用途**：四阶十二步的唯一进度真相源。  
> **分支**：`replay/4p12s-from-design`  
> **业务输入**：[`designdoc/整体设计.md`](../整体设计.md)  
> **相关**：`AGENTS.md`、`.gientech/rules/4p12s-gates.mdc`

**最近更新**：2026-07-22  
**当前焦点步骤**：**① 流程初始化**

---

## 状态图例

| 状态 | 含义 |
|------|------|
| `not_started` | 未开始 |
| `in_progress` | 进行中 |
| `blocked` | 有阻塞 |
| `gate_pending` | 待人确认门禁 |
| `done` | 门禁通过 |

---

## 十二步状态

| # | 步骤 | 状态 | 输入 | 输出（路径） | 阻塞项 / 备注 |
|---|------|------|------|--------------|---------------|
| ① | 流程初始化 | `not_started` | 整体设计.md、AGENTS、skills/rules | delivery-state、wiki | 测试护栏待 ⑧ 脚手架后兑现 |
| ② | 业务需求确认 | `not_started` | 整体设计.md | `specs/requirements-register.md` | |
| ③ | 生成 PRD | `not_started` | 登记表 | `specs/prd.md` | |
| ④ | 用户故事 | `not_started` | PRD | `specs/user-stories.md` | |
| ⑤ | 技术设计 | `not_started` | 用户故事 | `specs/design.md` | |
| ⑥ | 验证计划 | `not_started` | 技术设计 | `verification/verification-plan.md` | |
| ⑦ | 任务拆分 | `not_started` | 设计+验证计划 | `specs/tasks/` | |
| ⑧ | 执行开发 | `not_started` | TASK | 代码+测试 | 含 monorepo 脚手架创建 |
| ⑨ | 集成测试 | `not_started` | ⑧ | `verification-result.md` | |
| ⑩ | E2E 测试 | `not_started` | ⑨ | `apps/web/e2e/` | |
| ⑪ | Git 提交推送 | `not_started` | ⑩ | commit | |
| ⑫ | 测试环境部署 | `not_started` | ⑪ | `deploy-log.md` | |

---

## 检查清单

开始：

- [ ] 已读本表与 `整体设计.md`
- [ ] 只推进当前允许步骤
- [ ] 打开对应 `.gientech/skills/4p12s-*.md`

结束：

- [ ] 回写状态 / 输出路径 / 阻塞项
