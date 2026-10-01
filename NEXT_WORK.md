# NEXT_WORK.md

- Active Task: `PPL-FOUNDATION-001 — Web開発基礎講座`
- Status: `in_progress`（HTML第1〜2章、CSS第3〜4章は実装・検証済み）
- Completion: `63%`（講座全体15/24レッスン）。初期カリキュラム17/17、第2〜4章は各7/7受入項目完了。
- Branch: `work`
- Next Role: 実行基盤・教材設計と実装
- Next Action: 既存第5章「値と処理の基本」の3教材について変数・条件分岐・繰り返し・関数の目標と期待値をDESIGN.mdに定義する。Worker実行・時間制限・停止・結果通知の境界を先に実装し、教材へ接続する。学習者JavaScriptをメイン画面で実行しない。既存ID・保存・プレビュー隔離を維持する。
- Blocking: なし。公開/main mergeは明示承認が必要。
- Verification: `npm run verify:agent`、`PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/foundation-browser.mjs`。
- Latest evidence: `evidence/2026-10-02-layout/`。source/test `ff52a5e347edb9849b1cfd5b1c10474318c0ef74`。全15教材×3幅、誤答47ケース、境界/幅切替/全幅集約/途中取消/保存回帰PASS。

詳細なscope・残件・Evidenceは`task-list.md`。GitHub Actionsは使用しない。次の別Taskは未設定。
