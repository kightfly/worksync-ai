# Superpower · verification-before-completion（完成前验证）

## 一句话

没有新鲜验证证据，不要声明完成。

## 在本仓库的位置

Superpower 收尾纪律；对应 **4p12s ⑧ 结束** 与进入 ⑨/⑩ 前。与 `.cursor/rules/4p12s-gates.mdc` 一致。

## 触发条件

- 准备说「做完了」「可以合并」「交付完成」
- TASK 状态拟改为 done
- 用户问「好了吗」

## 必读输入

1. 本任务的验收标准 / 用户故事
2. 计划中的验证手段（单测 / 集成 / E2E）
3. `delivery-state.md`、最近测试输出
4. `designdoc/verification/verification-result.md`（若有）

## 任务步骤

1. 对照验收逐条：有证据 / 无证据 / 不适用
2. 跑约定命令（至少相关单测；交付级需集成/E2E）
3. 检查是否超出设计边界、是否引入密钥
4. 更新 TASK 证据与 `delivery-state`
5. **证据不足则只报告状态，不宣称完成**

## 产出路径

- 更新后的 TASK 证据节、verification-result 摘要、对用户的结论（完成 / 未完成 + 缺口）

## 门禁检查表

- [ ] 验收项均有对应证据或书面豁免
- [ ] 测试命令与结果时间新鲜（对本改动）
- [ ] 未把「只跑单测」说成「E2E/交付完成」
- [ ] delivery-state 已回写

## 禁止事项

- 禁止「代码写了」=「完成」
- 禁止使用过期测试结果充当本改动证据
- 禁止 Mock 全链路却声称真实验证通过

## 下一步

TASK 完成 → 下一 TASK 或 `4p12s-integration-test` / `4p12s-e2e-test`
