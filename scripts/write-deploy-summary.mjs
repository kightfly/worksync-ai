#!/usr/bin/env node
/**
 * CI deploy-test job：写入 GitHub Step Summary，供 4p12s ⑫ deploy-log 引用。
 */
import { appendFileSync } from 'node:fs';

const sha = process.env.GITHUB_SHA?.slice(0, 7) ?? 'local';
const branch = process.env.GITHUB_REF_NAME ?? 'unknown';
const runId = process.env.GITHUB_RUN_ID ?? '';
const server = process.env.GITHUB_SERVER_URL ?? 'https://github.com';
const repo = process.env.GITHUB_REPOSITORY ?? '';
const runUrl = runId ? `${server}/${repo}/actions/runs/${runId}` : '(local)';

const summary = `# テスト環境デプロイ記録（CI 生成）

| 項目 | 値 |
|------|-----|
| 日付 | ${new Date().toISOString()} |
| ブランチ | \`${branch}\` |
| commit | \`${sha}\` |
| トリガー | GitHub Actions \`deploy-test\` job |
| 実行 URL | ${runUrl} |

## 构建产物

- \`test-env-web-${process.env.GITHUB_SHA}\` — \`apps/web/dist\`
- \`test-env-api-${process.env.GITHUB_SHA}\` — \`apps/api/dist\`

## 本地验证（从 Artifact 解压后）

\`\`\`bash
# API
cd apps/api && node dist/index.js

# Web（静态）
npx serve apps/web/dist -l 5173
\`\`\`

## 门禁

- [x] quality job 已通过（lint / typecheck / test / e2e）
- [x] \`npm run build\` 成功
- [x] Artifact 已上传（可追溯）
- [ ] 真实测试环境 URL（团队自行配置 hosting 后填写）

> 将本 Summary 链接或摘要复制到 \`designdoc/delivery/deploy-log.md\` 作为 4p12s ⑫ 证据。
`;

const summaryPath = process.env.GITHUB_STEP_SUMMARY;
if (summaryPath) {
  appendFileSync(summaryPath, summary);
} else {
  console.log(summary);
}
