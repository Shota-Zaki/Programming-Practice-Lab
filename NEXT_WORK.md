# NEXT_WORK.md

- Active Task: PPL-FOUNDATION-001 — Web開発基礎講座
- Status: in_progress。今回はproject02 CSS先行教材・静的確認。専用native実行の受入に依存しない単位を実装・検証中。
- Completion: 92%（旧21+project01=22/24）。project02 CSS条件を満たしてもproject02全体の完了へ加算しない。
- Branch: work。Windowsタスク専用checkout task-2/ppl。project01は親のpolicy/remote/trigger再確認後に通常push済み。remote SHA d9307c29f7724f524f45979f4f7a49c5dfbfa7b7 / tree dd3991f621580128196b2053aa044ad3de0fed63 を読取照合済み。Pagesはmain/docs、work workflowなし、required CIなし（PASS扱いしない）。
- Next Action: project02 CSSの回帰検証・固定候補独立レビュー・証拠を完了し、親へ次の公開gateを依頼する。最新policy/remote/trigger確認前にはpushしない。
- Ready: 共有3ファイルを保つproject01/CSS教材切替、3幅の余白・文字・カード・操作欄・横溢れ静的確認。
- Planned: project02の選択変更/標準localStorage動作、project03の確認/成果物、共通形式/adapter、IndexedDB。
- Blocked: 任意native実行の専用環境（通信拒否/ファイル・プロセス分離/資源上限）と信頼できる結果transport。通常UIのnative実行・保存採点は無効。
- Deferred: 実Pages/Safari/手動読み上げ、基礎講座後の実践UI。別Task未設定。案B codec/facadeは不採用。
- Evidence: project01は evidence/2026-10-03-project01/。今回は evidence/2026-10-03-project02-css/ へ3幅の実UI・CSS意味誤答と同値例・履歴不変・保存fault・影響範囲の回帰を保存する。
- Verification: Windows既存Chromium、タスク専用Playwrightを使用。browser sandbox無効化flagや設定変更なし。
- Boundary: learner JS未評価。scriptなしpreview/opaque parser、旧21ID/v1、既存Worker1枠/2秒結果期限/5秒予約、同一snapshot export契約を維持。CSS確認結果は履歴として保存しない。
- Approval: main merge/公開未実施。main mergeには実行直前のユーザー明示承認が必要。

正本は task-list.md。設計は DESIGN.md と design/chapter7-native-export.md。GitHub Actionsは使用しない。
