# Superpower · writing-plans（小步计划）

## 一句话

把工作拆成小步骤：改哪些文件、为什么、如何验证、依赖是什么。任务越小越好验。

## 在本仓库的位置

Superpower **第 3 步**；在 **4p12s ⑧** 执行单个 TASK 前使用。仓库级任务拆分仍用 `gienspec-tasks` / `4p12s-implementation-tasks`。

## 触发条件

- brainstorming / TASK 目标已清，即将改代码
- 一次变更可能触及多文件，需顺序

## 必读输入

1. 当前 TASK 或用户目标
2. 相关设计与现有代码
3. `tdd.md` / `test-driven-development.md`

## 任务步骤

1. 列出有序步骤（每步最好对应一次可运行验证）
2. 每步注明：文件、意图、验证命令/断言
3. 标出依赖与可并行点
4. 计划过长则再拆 TASK，不硬写

## 产出路径

- TASK 内「执行计划」节，或临时 `PLAN` 片段

## 门禁检查表

- [ ] 步骤可独立验证
- [ ] 含测试/验证动作，而非只有「实现 xxx」
- [ ] 未超出 TASK 边界

## 禁止事项

- 禁止「一步：把功能做完」
- 禁止计划与规格/TASK 验收脱节

## 下一步

`skills/test-driven-development.md`（按步执行）或 `4p12s-implementation-execution.md`
