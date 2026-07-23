# TASK-A102

## 元信息

| 项 | 值 |
|----|-----|
| **标题** | Tasks REST API |
| **状态** | todo |
| **依赖** | I101、B101、A101（JWT 插件） |
| **契约版本** | design.md `0.1.0-replay` §4 |
| **对应 US / V** | US-010～013；V-007～016、V-024 |

## 目标

实现 `GET/POST /api/tasks`、`PATCH/DELETE /api/tasks/:id`；一覧降序；状态/内容更新走 Domain；越权返回 404/403；空标题 400。

## 边界（做 / 不做）

- **做**：API + Application + TaskRepository；错误码 `INVALID_STATE_TRANSITION`
- **不做**：前端 UI（W102）；打刻 API

## 涉及文件

- `apps/api/src/routes/tasks.ts`
- Task application service
- 集成测试

## 失败测试（红灯意图）

- 创建默认 `todo`；空标题 400
- 一覧降序
- 合法三迁移成功；`todo`→`done` → 400 + 日文
- `done` PATCH 拒绝
- 用户 A 操作 B 的 id → 404/403（V-024）

## 验收标准

- [ ] 与 design 契约一致
- [ ] Domain 状态机未被路由绕过
- [ ] V-007～016、024 有对应测试意图

## 证据（⑧ 回写）

```bash
# ...
```

- 红灯次数：
- 升级给人：是 / 否

## 门禁

- [ ] 可独立验证
- [ ] 测试证据齐全 → 可供 W102 / ⑨
