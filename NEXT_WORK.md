# NEXT_WORK.md

- Active Task: `PPL-FOUNDATION-001 — Web開発基礎講座`
- Status: `in_progress`（HTML第1〜2章、CSS第3〜4章は実装・検証済み）
- Completion: `63%`（講座全体15/24レッスン）。初期カリキュラム17/17、第2〜4章は各7/7受入項目完了。
- Branch: `work`
- Next Role: 実行基盤・教材設計と実装
- Next Action: 第5章3教材の目標/代表値と実行ライフサイクルは設計・検証済み。教材接続前に通信/保存/出力量/メモリ制約を扱う実行ホストを設計・検証する。Worker単体を権限隔離とみなさない。学習者JavaScriptをメイン画面で実行しない。既存ID・保存・プレビュー隔離を維持する。
- Blocking: なし。公開/main mergeは明示承認が必要。
- Verification: `npm run verify:agent`、`PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/foundation-browser.mjs`。
- Latest evidence: `evidence/2026-10-02-layout/`。source/test `ff52a5e347edb9849b1cfd5b1c10474318c0ef74`。全15教材×3幅、誤答47ケース、境界/幅切替/全幅集約/途中取消/保存回帰PASS。

詳細なscope・残件・Evidenceは`task-list.md`。GitHub Actionsは使用しない。次の別Taskは未設定。

- Lifecycle evidence: `evidence/2026-10-02-execution/`。fixed source/test `f21a2f0023d965944ba7f6d17bb3574d7f15918c`、7/7 testsとverify:agent、独立レビューPASS。ブラウザ実行ホスト・教材接続は未完。
