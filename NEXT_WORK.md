# NEXT_WORK.md

- Active Task: `PPL-FOUNDATION-001 — Web開発基礎講座`
- Status: `in_progress`（第6章まで21教材受入済み。第7章mini-project3教材は未実装）
- Completion: `88%`（21/24教材）。案A具体設計6/6=100%は教材数へ加算しない。
- Branch: `work`
- Next Action: 承認済み静的workspaceを実装中。3ファイルmodel/schema/保存/exportをテスト先行し、隔離静的確認と通常UI、3幅実ブラウザー・既存21教材回帰、固定SHAレビューを一つの受入単位として完了する。native実行/新教材完了は接続しない。
- Ready: 3ファイルモデル/静的編集/export+manifest実装（設計受入済み）。
- Planned: 第7章mini-project3教材、正式共通形式/adapter、IndexedDB、実Pages/Safari/手動読み上げ。
- Blocking: native任意実行向け専用環境の通信拒否/ファイル・プロセス/資源分離の実受入、合否連携transport。A/B選択は案A承認により解消。
- Deferred: native実行接続（環境受入前）、基礎講座後の実践UI。旧案B codec/facadeは不採用の履歴。別の次Task: 未設定。
- Evidence: 最新設計 `evidence/2026-10-03-native-export-design/`（design e9ee4ae、独立レビュー阻害なし、src/docs/tests38ファイル不変、verify:agent PASS）。旧比較設計/Chapter5/js04/js05/js06証拠は保持。実UIの最新受入は`evidence/2026-10-02-input-lesson/`（21教材×3幅/controller8/既存47誤答PASS）。
- Verification: `npm run verify:agent`。この設計作業でnative storage/facade/codec/UIの受入を行ったとは扱わない。
- Native/resource boundary: native localStorageはWindow同期API。現Worker/opaque frameへsame-origin保存権限を渡さない。既存共有枠1/公開2秒期限/5秒予約を維持。native Worker終了遅延/硬いmemory quotaなし/Safari未確認は継続。
- Approval boundary: main merge/公開未実施。main mergeは実行直前のユーザー明示承認が必要。

詳細は`task-list.md`/`DESIGN.md`。GitHub Actionsは使用しない。
