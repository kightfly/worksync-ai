# TASK-W102

## 元信息

| 项 | 值 |
|----|-----|
| **标题** | タスク管理 UI |
| **状态** | done |
| **依赖** | A102、W101 |
| **契约版本** | design.md `0.1.0-replay` §2.2 |
| **对应 US / V** | US-010～013；V-008、V-010、V-017、V-018；E2E-004～006 |

## 目标

实现 `/tasks`：表格式一覧、新規ポップアップ、状态变更、削除確認ダイアログ；空态「タスクはありません」；空标题前端阻止。

## 边界（做 / 不做）

- **做**：TasksPage 全流程对接 API
- **不做**：打刻页；绕过 API 直连 DB

## 涉及文件

- `apps/web/src/pages/TasksPage.tsx`
- `apps/web/src/pages/TasksPage.empty.test.tsx`

## 失败测试（红灯意图）

- 空标题提交被阻止（AC-017）
- 空列表渲染「タスクはありません」

## 验收标准

- [x] 一覧与 status 可见；空态日文
- [x] 合法状态可操作；非法时展示 API 日文错误
- [x] 確認削除 / キャンセル行为已实现

## 证据（⑧ 回写）

```bash
npm run test -w @gienharness/web
# TasksPage.empty.test passed
```

- 红灯次数：—
- 升级给人：否

## 门禁

- [x] 可独立验证
- [x] 测试证据齐全 → ⑩ E2E-004～006
