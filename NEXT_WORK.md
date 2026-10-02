# NEXT_WORK.md

- Active Task: `PPL-FOUNDATION-001 — Web開発基礎講座`
- Status: `in_progress`（第6章まで21教材受入済み。第7章mini-project3教材は未実装）
- Completion: `88%`（21/24教材）。保存設計チェックポイント4/4は教材数へ加算しない。
- Branch: `work`
- Next Action: DESIGNのA native API中心/B明示した独自async API中心をownerが選択後、学習者API/成果物持ち出し/具体的consumer/受入を定義する。第7章を保存専用3教材へ改変しない。
- Ready: 選択後の具体的受入/consumer設計。
- Planned: 第7章mini-project3教材、正式共通形式/adapter、IndexedDB、実Pages/Safari/手動読み上げ。
- Blocking: A/B学習APIと成果物持ち出しのowner決定。
- Deferred: consumer未確定codec/facade/backend実装、基礎講座後の実践UI。別の次Task: 未設定。
- Evidence: 最新設計 `evidence/2026-10-02-storage-design/`（design245605f、独立レビュー阻害なし、src/docs/tests不変、verify:agent PASS）。実UIの最新受入は`evidence/2026-10-02-input-lesson/`（21教材×3幅/controller8/既存47誤答PASS）。Chapter5/js04/js05の過去証拠も保持。
- Verification: `npm run verify:agent`。この設計作業でnative storage/facade/codec/UIの受入を行ったとは扱わない。
- Native/resource boundary: native localStorageはWindow同期API。現Worker/opaque frameへsame-origin保存権限を渡さない。既存共有枠1/公開2秒期限/5秒予約を維持。native Worker終了遅延/硬いmemory quotaなし/Safari未確認は継続。
- Approval boundary: main merge/公開未実施。main mergeは実行直前のユーザー明示承認が必要。

詳細は`task-list.md`/`DESIGN.md`。GitHub Actionsは使用しない。
