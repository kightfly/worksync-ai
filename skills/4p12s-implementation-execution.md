# 4p12s · ⑧ 执行开发（implementation-execution）

## 一句话

红灯先行 → 最小实现 → 重构；按 TASK 依赖推进，并回写证据。

## 触发条件

- ⑦ 任务清单门禁通过
- 正在执行某个 `TASK-xxx`
- Superpower 最小纪律适用（见下）

## 必读输入

1. 当前 `designdoc/specs/tasks/TASK-xxx.md`（或 `tasks.md` 中条目）
2. 相关设计与验证计划条目
3. `.cursor/rules/tdd.mdc`、`skills/tdd.md`
4. 横切：`react-doctor.md` / `database.md` / `security.mdc` / `timezone.mdc`

## Superpower 最小纪律（本步强制）

```
必要时 brainstorming（边界不清时）
  → writing-plans（TASK 内小步骤）
  → test-driven-development（红 → 绿 → 重构）
  → systematic-debugging（失败时）
  → verification-before-completion（收尾）
```

（Superpower 最小集已落地：见 `brainstorming.md` 等。）

## 任务步骤

1. 读 TASK 验收与失败测试意图
2. **先写失败测试并运行（红）**
3. 写最小实现使测试通过（绿）
4. 重构；保持测试绿
5. 跑相关套件；回写 TASK 证据（命令、结果摘要）
6. 更新 `delivery-state` ⑧ 进度
7. **同一 TASK 连续 5 次红灯仍失败 → 停止，升级给人**（判定：测试错 / 设计错 / 策略错）

## 产出路径

| 产物 | 路径 |
|------|------|
| 实现代码 | `apps/*`、`packages/*` |
| 测试 | 与 TASK 绑定的 `*.test.ts(x)` |
| 证据回写 | TASK 文件「证据」节 / `delivery-state` |

## 门禁检查表

- [ ] 有红灯记录再写生产代码
- [ ] 相关测试通过
- [ ] 未超出设计边界与技术栈
- [ ] 日文 UI/错误文案符合需求
- [ ] 安全与时区规则未违反
- [ ] TASK 验收项勾选完成

## 禁止事项

- 禁止无失败测试写生产逻辑
- 禁止一次改多个无关 TASK 而不隔离证据
- 禁止连续红灯硬猜超过 5 次
- 禁止宣称「完成」却无测试输出证据

## 下一步

计划内 TASK 均完成 → `skills/4p12s-integration-test.md`
