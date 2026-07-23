# TASK-A103

## 元信息

| 项 | 值 |
|----|-----|
| **标题** | Attendance 只读 API |
| **状态** | todo |
| **依赖** | I101、B102、A101（JWT） |
| **契约版本** | design.md `0.1.0-replay` §4、§6.3 |
| **对应 US / V** | US-020～021；V-019～022；BR-010 |

## 目标

实现 `GET /api/attendance`、`GET /api/attendance/statistics`；时间输出带 Tokyo 偏移；集計按 `work_date`；**无写接口**。

## 边界（做 / 不做）

- **做**：只读查询 + 集計算法
- **不做**：`POST /api/attendance`；出勤退勤 UI 录入

## 涉及文件

- `apps/api/src/routes/attendance.ts`
- Attendance service / repository
- 集成测试（对照 seed）

## 失败测试（红灯意图）

- 一覧返回 ISO `+09:00`（或契约约定格式）
- statistics 与 seed 预期分钟数一致
- 跨日记录归入出勤 `work_date`
- 无 POST 路由（或 404/405）

## 验收标准

- [ ] BR-010 只读成立
- [ ] V-019～022 有测试意图
- [ ] 需登录（401 无 token）

## 证据（⑧ 回写）

```bash
# ...
```

- 红灯次数：
- 升级给人：是 / 否

## 门禁

- [ ] 可独立验证
- [ ] 测试证据齐全 → 可供 W103 / ⑨
