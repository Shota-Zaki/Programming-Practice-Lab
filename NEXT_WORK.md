# NEXT_WORK.md

- Active Task: `PPL-FOUNDATION-001 — Web開発基礎講座`
- Status: `in_progress`（HTML第1〜2章、CSS第3〜4章、JavaScript第5章は実装・検証済み）
- Completion: `75%`（講座全体18/24レッスン）。初期17/17、第2〜5章各7/7受入項目完了。
- Branch: `work`
- Next Role: 教材/実行境界の設計
- Next Action: 既存第6章DOM・イベントの3教材と実行/表示/採点境界を設計する。数値処理WorkerにDOMはない。既存ID/v1保存/プレビュー隔離を維持し、main画面で学習者コードを評価しない。
- Ready: 第6章設計。Planned: 第6〜7章6教材、正式共通形式/アダプター、IndexedDB、実Pages/Safari/手動読み上げ確認。
- Blocking: 今回scopeなし。Deferred: 実践UI（基礎講座後）。別の次Task: 未設定。
- Verification: `npm run verify:agent`、`npm run test:execution`、`PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/javascript-browser.mjs`、同環境で`node tests/foundation-browser.mjs`。
- Latest evidence: `evidence/2026-10-02-javascript/`。source/test `7e7e8fb9ca18a9dbfd04e86366b33e14c8452b14`。controller8/8・3JS教材×3幅・全18教材×3幅・旧保存/既存採点回帰PASS。独立固定SHAソースレビューでblocking findingなし。
- Result deadline vs cleanup: 公開2秒期限と取消応答を維持。native Worker終了には今回Chromiumで約2〜3秒の遅延を観測。枠1/待ち行列なし、解放後5秒の予約で追加作成を拒否。5秒は環境実測の余裕であり、全ブラウザーの終了や硬いメモリquotaを保証しない。
- Approval boundary: main merge/公開は未実施。mainへのmergeは実行直前のユーザー明示承認が必要。

詳細なscope・残件・Evidenceは`task-list.md`。GitHub Actionsは使用しない。
