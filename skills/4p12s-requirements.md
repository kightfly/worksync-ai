# 4p12s · ② 业务需求确认（requirements）

## 一句话

读原始需求 → 生成需求登记表：范围、约束、验收场景可追溯。

## 触发条件

- ① 已完成或 `delivery-state` 焦点为②
- 用户提供口头/文档/截图需求，需结构化登记
- 可叠加：`gienspec-specify` / `gienspec-clarify`（Phase 4 落地后）

## 必读输入

1. `designdoc/delivery/delivery-state.md`
2. 原始需求（`raw-input.md` 或用户消息）
3. 现有 `designdoc/specs/requirements.md`（过渡期对照，避免重复矛盾）
4. `.cursor/rules/4p12s-gates.mdc`

## 任务步骤

1. 提取：角色、目标、范围内/外、业务规则、约束（技术栈不可改等）
2. 列出验收场景（主流程 / 异常 / 空态 / 边界），每条可追溯到原文
3. 列出待澄清问题（模糊词：适当、快速、友好…）
4. 写入登记表；阻塞项写入 `delivery-state` ②
5. **边界不清则停**，请求人确认后再进③

## 产出路径

| 产物 | 路径 |
|------|------|
| 需求登记表 | `designdoc/specs/requirements-register.md` |

模板：`designdoc/templates/requirements-register.template.md`

## 门禁检查表

- [ ] 范围清单（含明确「不做」）
- [ ] 业务规则列表
- [ ] 验收场景可追溯（有编号）
- [ ] 边界与约束已记录
- [ ] 模糊点已列出或已关闭
- [ ] 前后端共享同一套验收语言（日文 UI 文案要点可备注）

## 禁止事项

- 禁止把登记表写成完整 PRD（那是③）
- 禁止臆造未确认的业务规则并标为已确认
- 禁止跳过验收场景直接进设计

## 下一步

人确认登记表 → `skills/4p12s-prd.md`
