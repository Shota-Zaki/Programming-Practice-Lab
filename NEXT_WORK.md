# NEXT_WORK.md

- Active Task: `PPL-FOUNDATION-001 — Web開発基礎講座`
- Status: `in_progress`（HTML第1〜2章、CSS第3章は実装・検証済み）
- Completion: `46%`（講座全体11/24レッスン）。初期カリキュラム17/17、第2章7/7、第3章7/7受入項目完了。
- Branch: `work`
- Next Role: 教材設計・実装
- Next Action: 既存第4章「レイアウトとレスポンシブ」の4教材についてDESIGN.mdに目標・入力演習・幅別採点条件を定義し、Flexbox・Grid・画面幅への対応を実装する。既存教材のID・保存データ・隔離境界を維持する。
- Blocking: なし。公開/main mergeは明示承認が必要。
- Verification: `npm run verify:agent`、`PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/foundation-browser.mjs`。
- Latest evidence: `evidence/2026-10-02-css/`。source/test `e2627b652dec6ddde31de6de7be278da7a16b77d`。全11教材×3幅、HTML誤答22/CSS誤答10、保存互換性・非同期取消・タイムアウト再試行PASS。

詳細なscope・残件・Evidenceは`task-list.md`。GitHub Actionsは使用しない。次の別Taskは未設定。
