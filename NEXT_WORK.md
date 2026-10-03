# NEXT_WORK.md

- Active Task: `PPL-FOUNDATION-001 — Web開発基礎講座`
- Status: `in_progress`。project01の教材・静的構造採点は7/7=`100%`のローカル受入完了。product `7fa8c0a`独立レビュー阻害なし。
- Completion: `92%`（旧21+project01=22/24）。project02/03/native未受入を加算しない。
- Branch: `work`。Windowsのタスク専用checkout `task-2/ppl`。公開は親指示により保留。
- Next Action: 親へレビュー済み候補を渡す。親の最新policy、remote-head、push trigger確認前にはpushしない。後続は案Aのproject02/03教材/CSS確認を独立工程として進める。
- Ready: レビュー済みproject01候補の受渡し/guarded work反映。案Aは承認済みで再選択不要。
- Planned: project02の見た目/動作、project03の確認/成果物、正式共通形式/adapter、IndexedDB。
- Blocked: 任意native実行の専用環境（通信拒否/ファイル・プロセス分離/資源上限）と信頼できる結果transport。通常UIのnative実行・保存採点は無効。
- Deferred: 実Pages/Safari/手動読み上げ、基礎講座後の実践UI。別Task未設定。案B codec/facadeは不採用履歴。
- Evidence: `evidence/2026-10-03-project01/`。21 unit、project01 3幅/40意味誤答/同値fieldset/Tab-label/履歴/保存fault、workspace35観測/実download30、旧21教材×3幅。product `7fa8c0a`の独立レビュー阻害なし。最終checkpointはsrc/docs/tests不変。
- Verification: `npm run verify:agent`と局所ブラウザー検証。Windowsの既存Chromiumを使用。Playwrightをタスク専用test-toolsに取得し、browser sandbox無効化flagや設定変更なし。
- Boundary: learner JS未評価。既存scriptなしpreview/opaque parser、旧21ID/v1、既存Worker1枠/2秒結果期限/5秒予約、同一snapshot export契約を維持。native localStorage動作をfixtureで代用しない。
- Approval: main merge/公開は未実施。main mergeには実行直前のユーザー明示承認が必要。

正本は`task-list.md`。設計は`DESIGN.md`と`design/chapter7-native-export.md`。GitHub Actionsは使用しない。
