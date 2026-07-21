# 4p12s · ⑫ 测试环境部署（deployment-execution）

## 一句话

触发 CI/CD 到测试环境；记录构建、迁移、访问地址与验证结果，形成可追溯交付证据。

## 触发条件

- ⑪ 已完成（代码在约定分支）
- `delivery-state` 焦点为⑫
- 存在部署流水线或明确的手动部署规程；若无，记阻塞并指向 Phase 3 CI 补齐

## 必读输入

1. `.github/workflows/*` 或部署文档（`.gientech/wiki/部署与运维.md`）
2. `designdoc/verification/verification-result.md`
3. 环境变量/密钥获取方式（不把密钥写入仓库）
4. `designdoc/delivery/delivery-state.md`

## 任务步骤

1. 触发部署（workflow_dispatch / push 约定分支 / 文档中的命令）
2. 记录：构建号、镜像/产物、DB 迁移、配置差异、访问 URL
3. 部署后冒烟（可复用 E2E 指向测试环境或健康检查）
4. 写入 `deploy-log.md`；更新 `delivery-state` ⑫
5. 若失败：保留日志链接，阻塞项归因，禁止标 `done`

## 产出路径

| 产物 | 路径 |
|------|------|
| 部署日志 | `designdoc/delivery/deploy-log.md` |

模板：`designdoc/templates/deploy-log.template.md`

## 门禁检查表

- [ ] 有流水线或等价触发记录
- [ ] 环境可访问
- [ ] 迁移与配置已记录
- [ ] 冒烟/验证结果已附
- [ ] 回滚方案已写
- [ ] **无记录或不可访问 → 交付未完成**

## 禁止事项

- 禁止「在我机器上能跑」代替测试环境部署证据
- 禁止把生产密钥写入 `deploy-log.md`
- 禁止 Mock 掉后端仍声称测试环境验收通过

## 下一步

⑫ `done` → 本迭代交付闭环；新需求从①或②重新开状态行/新表。
