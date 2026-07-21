# 4p12s · ⑩ E2E 测试（e2e-test）

## 一句话

从用户操作覆盖主流程（及计划中的异常/权限）；前端真调后端、后端真落库，**Mock 全链路退出**。

## 触发条件

- ⑨ 集成门禁通过
- `delivery-state` 焦点为⑩
- Playwright（或既定 E2E 工具）可用；若未安装，记阻塞并转 Phase 3 护栏，**不得假装 E2E 已过**

## 必读输入

1. `designdoc/verification/verification-plan.md`（E2E 场景）
2. `designdoc/specs/user-stories.md`
3. `designdoc/verification/verification-result.md`（集成结论）
4. 可访问的本地或测试环境 URL

## 任务步骤

1. 确认前后端与 DB 已起，E2E 配置指向真实环境
2. 执行主流程冒烟（至少 1 条：如登录→タスク一覧）
3. 按计划补异常/权限场景（可分迭代，但发布前主路径必过）
4. 保存报告路径与摘要到 verification-result / 专用 report
5. 更新 `delivery-state` ⑩

## 产出路径

| 产物 | 路径 |
|------|------|
| E2E 摘要 | `designdoc/verification/verification-result.md`（E2E 节） |
| 报告（工具生成） | 如 `apps/web/playwright-report/`（以实际为准） |

## 门禁检查表

- [ ] 主验收路径 E2E 通过
- [ ] 全链路无 Mock（或偏差已书面批准）
- [ ] 环境可访问、步骤可追溯
- [ ] **未过 E2E 不得⑪宣称交付完成**

## 禁止事项

- 禁止用手动「我点了一下」替代自动化证据（除非人书面接受并记入结果）
- 禁止 Mock API 的 E2E 充当交付门禁
- 禁止忽略权限与数据正确性检查（若计划包含）

## 下一步

E2E 通过 → `.gientech/skills/4p12s-git-push.md`
