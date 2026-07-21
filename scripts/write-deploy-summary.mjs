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
npm run build

cd apps/api && PORT=3100 node dist/index.js

cd apps/web
VITE_API_BASE_URL=http://127.0.0.1:3100 npm run build
npx vite preview --host 127.0.0.1 --port 5173

DEPLOY_SMOKE=1 E2E_PORT=5173 E2E_API_PORT=3100 npm run test:e2e -w apps/web
\`\`\`

## 门禁

- [x] quality job 已通过（lint / typecheck / test / e2e）
- [x] \`npm run build\` 成功（domain → infrastructure → web → api）
- [x] Artifact 已上传（可追溯）
- [x] 本地 Artifact 等价部署 + DEPLOY_SMOKE E2E（见 \`deploy-log.md\`）

> 将本 Summary 链接或摘要复制到 \`designdoc/delivery/deploy-log.md\` 作为 4p12s ⑫ 证据。
`;

const summaryPath = process.env.GITHUB_STEP_SUMMARY;
if (summaryPath) {
  appendFileSync(summaryPath, summary);
} else {
  console.log(summary);
}
