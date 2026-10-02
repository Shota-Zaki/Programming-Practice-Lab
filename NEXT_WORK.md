# NEXT_WORK.md

- Active Task: `PPL-FOUNDATION-001 — Web開発基礎講座`
- Status: `in_progress`（第6章まで21教材受入済み。第7章mini-project3教材は未実装）
- Completion: `88%`（21/24教材）。案A具体設計6/6=100%は教材数へ加算しない。
- Branch: `work`
- Next Action: 静的workspaceのローカル実装/検証・固定証跡f483f0aの独立レビューを完了。親のremote push保留解除後、canonical clean/work/既知baseline・originを再確認しguarded work反映を行う。native実行/新教材完了は接続しない。
- Ready: reviewed local静的workspace候補（owned clone ppl-export-work）。保留解除後の反映。3教材の教材/正式合格接続は今回とは別の受入単位。
- Planned: 第7章mini-project3教材、正式共通形式/adapter、IndexedDB、実Pages/Safari/手動読み上げ。
- Blocking: 親のremote push保留（動的Pages実行metadata確認待ち）。native任意実行向け専用環境の通信拒否/ファイル・プロセス/資源分離の実受入、合否連携transportは別Blocked。A/B選択は案A承認により解消。
- Deferred: native実行接続（環境受入前）、基礎講座後の実践UI。旧案B codec/facadeは不採用の履歴。別の次Task: 未設定。
- Evidence: 新しいローカル静的workspace `evidence/2026-10-03-project-workspace/`（product95f8604、QA f42971f、17unit/35native/30実download/旧21教材×3幅/verify PASS）。最新設計・旧比較設計/Chapter5/js04/js05/js06証拠は保持。新workspaceを第7章3教材の実受入として扱わない。
- Verification: `npm run verify:agent`。この設計作業でnative storage/facade/codec/UIの受入を行ったとは扱わない。
- Native/resource boundary: native localStorageはWindow同期API。現Worker/opaque frameへsame-origin保存権限を渡さない。既存共有枠1/公開2秒期限/5秒予約を維持。native Worker終了遅延/硬いmemory quotaなし/Safari未確認は継続。
- Approval boundary: main merge/公開未実施。main mergeは実行直前のユーザー明示承認が必要。

詳細は`task-list.md`/`DESIGN.md`。GitHub Actionsは使用しない。
