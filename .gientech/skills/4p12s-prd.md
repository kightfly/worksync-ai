# 4p12s · ③ 生成 PRD（prd）

## 一句话

把业务语言转成产品/技术可理解的结构化 PRD（功能、非功能、验收口径）。

## 触发条件

- ② 登记表门禁通过（`gate_pending` 已经人确认或等价）
- `delivery-state` 焦点为③

## 必读输入

1. `designdoc/specs/requirements-register.md`
2. `designdoc/delivery/delivery-state.md`
3. （过渡）`designdoc/specs/requirements.md` — 可迁移内容，避免双源长期并存

## 任务步骤

1. 从登记表生成：产品概述、角色、功能清单（优先级）、非功能、验收口径、协作前提、风险
2. 标明本期范围 vs 后续
3. 写入 `prd.md`；若仍使用旧 `requirements.md`，在文件头注明「过渡，以 prd 为准」或执行拆分
4. 更新 `delivery-state` ③；请求人确认规格

## 产出路径

| 产物 | 路径 |
|------|------|
| PRD | `designdoc/specs/prd.md` |
| （可选别名） | `designdoc/specs/software-requirements.md` |

模板：`designdoc/templates/prd.template.md`

## 门禁检查表

- [ ] 功能清单有优先级
- [ ] 验收口径可测试、无「适当」等模糊词（或已标注待澄清）
- [ ] 非功能：安全、时区、性能基线有条目
- [ ] 风险与依赖已写
- [ ] **规格未经确认不得进入④**

## 禁止事项

- 禁止仅靠对话记忆推进而不落盘 PRD
- 禁止在 PRD 中规定可更换的固定技术栈之外的新框架
- 禁止把用户故事 Given/When/Then 全集塞进 PRD（留给④）

## 下一步

PRD 确认 → `.gientech/skills/4p12s-user-stories.md`
