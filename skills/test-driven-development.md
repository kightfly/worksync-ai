# Superpower · test-driven-development（TDD）

## 一句话

先写失败测试，再写最小实现，再重构。没有失败测试不急着写生产代码。

## 在本仓库的位置

Superpower **第 5 步**；**4p12s ⑧** 的核心纪律。详细实践见 **`skills/tdd.md`** 与 `.cursor/rules/tdd.mdc`。

## 触发条件

- 正在实现业务逻辑 / API / 组件行为
- `writing-plans` 已给出可验步骤

## 必读输入

1. `skills/tdd.md`（完整循环与项目约定）
2. `.cursor/rules/tdd.mdc`
3. 当前 TASK 的失败测试意图与验收
4. `4p12s-implementation-execution.md`（含 5 次红灯升级）

## 任务步骤（摘要）

1. **Red**：写一个失败测试并运行确认失败
2. **Green**：最小代码使测试通过
3. **Refactor**：保持绿灯下整理
4. 回写证据到 TASK；需要时跑更广回归
5. 连续 5 次红灯 → 停，升级给人

## 产出路径

- 测试与实现文件；TASK 证据节

## 门禁检查表

- [ ] 有红灯记录
- [ ] 相关测试通过
- [ ] E2E 交付门禁认知：单测通过 ≠ 交付完成（见 `tdd.md` / 4p12s ⑩）

## 禁止事项

- 禁止无失败测试写生产逻辑
- 禁止用「以后再补测试」宣称完成

## 详细规范

→ 打开并遵循 **`skills/tdd.md`**。

## 下一步

实现中遇 Bug → `systematic-debugging.md`  
收尾 → `verification-before-completion.md`
