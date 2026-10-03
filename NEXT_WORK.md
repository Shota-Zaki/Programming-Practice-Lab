# NEXT_WORK.md

- Active Task: `PPL-FOUNDATION-001 — Web開発基礎講座`
- Status: `in_progress`。project01の教材・静的構造採点を実装し、固定候補の独立レビュー待ち。
- Completion: `88%`（既存21/24受入済み）。project01はレビュー完了後に22/24=`92%`へ更新する。native未受入を加算しない。
- Branch: `work`。Windowsのタスク専用checkout `task-2/ppl`。公開は親指示により保留。
- Next Action: 固定候補の独立レビューと最終局所チェック。親の最新policy、remote-head、push trigger確認前にはpushしない。
- Ready: project01のレビュー・候補受渡し。案Aは承認済みで再選択不要。
- Planned: project02の見た目/動作、project03の確認/成果物、正式共通形式/adapter、IndexedDB。
- Blocked: 任意native実行の専用環境（通信拒否/ファイル・プロセス分離/資源上限）と信頼できる結果transport。通常UIのnative実行・保存採点は無効。
- Deferred: 実Pages/Safari/手動読み上げ、基礎講座後の実践UI。別Task未設定。案B codec/facadeは不採用履歴。
- Evidence: `evidence/2026-10-03-project01/`。21 unit、project01 3幅/27意味誤答/Tab-label/履歴/保存fault、workspace35観測、旧21教材×3幅。最終SHAとレビュー結果はtask-listの最新節を参照。
- Verification: `npm run verify:agent`と局所ブラウザー検証。Windowsの既存Chromiumを使用。Playwrightをタスク専用test-toolsに取得し、browser sandbox無効化flagや設定変更なし。
- Boundary: learner JS未評価。既存scriptなしpreview/opaque parser、旧21ID/v1、既存Worker1枠/2秒結果期限/5秒予約、同一snapshot export契約を維持。native localStorage動作をfixtureで代用しない。
- Approval: main merge/公開は未実施。main mergeには実行直前のユーザー明示承認が必要。

正本は`task-list.md`。設計は`DESIGN.md`と`design/chapter7-native-export.md`。GitHub Actionsは使用しない。
