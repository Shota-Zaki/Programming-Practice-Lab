# NEXT_WORK.md

- Active Task: `PPL-FOUNDATION-001 — Web開発基礎講座`
- Status: `in_progress`（HTML第1〜2章、CSS第3〜4章、JavaScript第5章と第6章js06まで実装・検証済み）
- Completion: `88%`（講座全体21/24レッスン）。初期17/17、第2〜5章各7/7、第6章既存教材各7/7受入完了。
- Branch: `work`
- Next Role: 第7章保存境界/教材設計
- Next Action: 第7章のブラウザー保存教材を設計する。現ブリッジは保存APIを提供しないため、保存の実行境界/教育内容を先に定義し、未対応APIを使えると説明しない。既存ID/v1保存/プレビュー隔離を維持する。
- Ready: 第7章保存境界/教材設計。Planned: 残り3教材、正式共通形式/adapter、IndexedDB、実Pages/Safari/手動読み上げ。
- Blocking: 今回scopeなし。Deferred: 実践UI（基礎講座後）。別の次Task: 未設定。
- Verification: `npm run verify:agent`、`npm run test:execution`、`PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs LESSON_ID=js06 EVIDENCE_DIR=evidence/2026-10-02-input-lesson node tests/event-lesson-browser.mjs`、同環境で`node tests/foundation-browser.mjs`。
- Latest evidence: `evidence/2026-10-02-input-lesson/`。source/test `c30cdc2bceadefd47e1d5020e0775a48c818651b`。controller8/8、実UI×3幅、全21教材×3幅、旧保存/47誤答回帰PASS。固定SHA独立ソースレビュー阻害なし。
- Earlier evidence: `evidence/2026-10-02-javascript/`、`evidence/2026-10-02-dom-boundary/`、`evidence/2026-10-02-dom-lesson/`、`evidence/2026-10-02-click-lesson/`を保持。先行API consumer harness受入と通常UI受入を区別する。
- Result deadline vs cleanup: 公開2秒期限、共有枠1/待ち行列なし、解放後5秒予約を維持。native Worker終了に約2〜3秒遅延を観測。5秒は全ブラウザー終了や硬いmemory quotaを保証しない。再読込/実Pages/Safari/読み上げは未解消・未検証。
- Approval boundary: main merge/公開未実施。mainへのmergeは実行直前のユーザー明示承認が必要。

詳細なscope・残件・Evidenceは`task-list.md`。GitHub Actionsは使用しない。
