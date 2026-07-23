# TASK-W103

## 元信息

| 项 | 值 |
|----|-----|
| **标题** | 打刻 + ダッシュボード UI |
| **状态** | todo |
| **依赖** | A103、W101 |
| **契约版本** | design.md `0.1.0-replay` §2 |
| **对应 US / V** | US-020～021、F-004；V-019、V-020；E2E-001、E2E-008、E2E-009 |

## 目标

实现 `/dashboard` 概览/快捷入口，以及 `/attendance` 打刻一覧（Tokyo 展示）与日次集計只读区；空态「打刻記録はありません」；无录入按钮。

## 边界（做 / 不做）

- **做**：只读展示；侧栏导航完整
- **不做**：出勤/退勤提交；统计写操作

## 涉及文件

- `apps/web/src/pages/DashboardPage.tsx`
- `apps/web/src/pages/AttendancePage.tsx`
- AttendanceTable / DailyStatisticsTable

## 失败测试（红灯意图）

- 时刻格式化为 Tokyo（工具单测或组件测）
- 空数据时日文空态
- 页面无「打刻する」类写入口

## 验收标准

- [ ] 与 A103 契约字段对齐
- [ ] 登录后默认可进 dashboard
- [ ] BR-010 UI 层无写操作

## 证据（⑧ 回写）

```bash
# ...
```

- 红灯次数：
- 升级给人：是 / 否

## 门禁

- [ ] 可独立验证
- [ ] 测试证据齐全 → ⑩ E2E-008/009
