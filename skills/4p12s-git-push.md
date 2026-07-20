# 4p12s · ⑪ Git 提交推送（git-push）

## 一句话

回顾需求/设计/任务/测试状态后，生成关联 TASK 与测试摘要的 commit / MR。

## 触发条件

- ⑩ E2E 门禁通过（或人明确授权的文档-only / Harness-only 提交）
- `delivery-state` 焦点为⑪
- **仅当用户明确要求 commit/push/PR 时**执行推送类操作（遵守仓库 git 安全规则）

## 必读输入

1. `designdoc/delivery/delivery-state.md`
2. 相关 TASK 与 `verification-result.md`
3. `git status` / `git diff` / 最近 commit 风格
4. 用户是否授权 push / 开 PR

## 任务步骤

1. 确认需求·设计·开发·测试状态一致，无未追踪密钥文件
2. 起草 commit message：说明 why；引用 TASK 编号与测试摘要
3. 按用户授权：`git add` → `commit` →（可选）`push` / `gh pr create`
4. 将 commit hash / PR URL 写入 `delivery-state` ⑪ 输出
5. 不在未授权时 push；不使用 `--no-verify` 除非用户明确要求

## 产出路径

| 产物 | 说明 |
|------|------|
| Git commit | 本地仓库 |
| MR/PR | 远程（若授权） |
| 状态回写 | `delivery-state.md` ⑪ |

## 门禁检查表

- [ ] 无 `.env` / 密钥入库
- [ ] 消息关联 TASK 与测试结论
- [ ] hooks 通过（若失败则修后 **新** commit，不随意 amend）
- [ ] 回滚思路可说明（revert / 上一版本）

## 禁止事项

- 禁止伪造「测试已过」写入 commit
- 禁止 force push main/master
- 禁止用户未要求时擅自 commit/push
- 禁止跳过 ⑩ 却宣称产品交付完成（Harness 文档提交除外并注明）

## 下一步

入库完成 → `skills/4p12s-deployment-execution.md`
