# 4p12s · ④ 生成用户故事（user-stories）

## 一句话

用 Given/When/Then 拆解主流程、异常、空态、边界；建立与验收场景的覆盖关系。

## 触发条件

- ③ PRD 已确认
- `delivery-state` 焦点为④

## 必读输入

1. `designdoc/specs/prd.md`（或已确认的等价规格）
2. `designdoc/specs/requirements-register.md`
3. `designdoc/delivery/delivery-state.md`

## 任务步骤

1. 按功能域拆用户故事（认证、タスク、打刻等）
2. 每条故事含：角色、目的、GWT 验收、关联登记表/PRD 编号
3. 补齐异常 / 空态 / 边界；标出需 UI 设计覆盖的项（本项目可简化为页面要点）
4. 产出验收场景矩阵（故事 × 场景类型）
5. 更新 `delivery-state` ④

## 产出路径

| 产物 | 路径 |
|------|------|
| 用户故事 | `designdoc/specs/user-stories.md` |
| （可同文件附录）验收场景矩阵 | 同上或 `designdoc/specs/acceptance-matrix.md` |

模板：`designdoc/templates/user-stories.template.md`

## 门禁检查表

- [ ] 故事粒度可独立测试（不过大）
- [ ] 每条有明确验收（GWT 或等价）
- [ ] 含异常 / 边界 / 空态（或显式标明 N/A）
- [ ] 与 PRD 功能清单可映射
- [ ] **粒度过大或缺异常 → 不进⑤**

## 禁止事项

- 禁止只有「作为用户我想…」而无验收
- 禁止把技术实现细节写成故事主体（留给⑤）
- 禁止中英混用 UI 验收文案（本项目 UI 用日文）

## 下一步

故事门禁通过 → `skills/4p12s-technical-design.md`  
横切可参考：`skills/architect.md`
