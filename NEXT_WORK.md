# NEXT_WORK.md

- Active Task: `PPL-FOUNDATION-001 — Web開発基礎講座`
- Status: `in_progress`（HTML第1〜2章、CSS第3〜4章、JavaScript第5章と第6章js05まで実装・検証済み）
- Completion: `83%`（講座全体20/24レッスン）。初期17/17、第2〜5章各7/7、第6章既存教材各7/7受入完了。
- Branch: `work`
- Next Role: js06入力イベント教材
- Next Action: js06入力イベント教材を設計・接続し、各入力/消去の通常UI受入を行う。既存ID/v1保存/プレビュー隔離を維持する。
- Ready: js06入力教材接続/通常UI受入。Planned: 残り4教材、正式共通形式/adapter、IndexedDB、実Pages/Safari/手動読み上げ。
- Blocking: 今回scopeなし。Deferred: 実践UI（基礎講座後）。別の次Task: 未設定。
- Verification: `npm run verify:agent`、`npm run test:execution`、`PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/event-lesson-browser.mjs`、同環境で`node tests/foundation-browser.mjs`。
- Latest evidence: `evidence/2026-10-02-click-lesson/`。source/test `280a7626bb26a392eed9c2550e7d3895abccab58`。controller8/8、実UI×3幅、全20教材×3幅、旧保存/47誤答回帰PASS。固定SHA独立ソースレビュー阻害なし。
- Earlier evidence: `evidence/2026-10-02-javascript/`、`evidence/2026-10-02-dom-boundary/`、`evidence/2026-10-02-dom-lesson/`を保持。先行API consumer harness受入と通常UI受入を区別する。
- Result deadline vs cleanup: 公開2秒期限、共有枠1/待ち行列なし、解放後5秒予約を維持。native Worker終了に約2〜3秒遅延を観測。5秒は全ブラウザー終了や硬いmemory quotaを保証しない。再読込/実Pages/Safari/読み上げは未解消・未検証。
- Approval boundary: main merge/公開未実施。mainへのmergeは実行直前のユーザー明示承認が必要。

詳細なscope・残件・Evidenceは`task-list.md`。GitHub Actionsは使用しない。
