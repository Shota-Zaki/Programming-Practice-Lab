# NEXT_WORK.md

- Active Task: PPL-FOUNDATION-001 — Web開発基礎講座
- Status: in_progress。project03ファイル照合先行単位5/5=100%をローカル受入済み。project03全体は未完了。
- Completion: 92%（旧21+project01=22/24）。project02 CSS条件を満たしてもproject02全体の完了へ加算しない。
- Branch: work。Windowsタスク専用checkout task-2/ppl。CSS候補3f9fc9e22a0cfa323899eefed0652e4424a84544/tree b6c584b390951ea8f2e5440b0e32ec4c29d5e11dは親policy再確認/remote/trigger確認後に通常push・connected GitHub照合済み。Pages main/docs、work workflowなし、required CIなし（PASS扱いしない）。
- Next Action: 固定product9150c6db9a91cd14b558833917df3bbea8003ff7と証拠の独立レビュー阻害なし。親へ次公開gateを依頼し、最新policy/remote/trigger確認後のみ通常work反映する。後続は承認済みCOREの既存4方式共通採点adapter契約（unknown/native modeを実行前拒否）、native依存なしとread-only確認済み。
- Ready: 固定ファイルのbytes/hash照合と現編集snapshot比較（実行/上書き/外部送信/履歴更新なし）。
- Planned: project02の選択変更/標準localStorage動作、project03の確認/成果物、共通形式/adapter、IndexedDB。
- Blocked: 任意native実行の専用環境（通信拒否/ファイル・プロセス分離/資源上限）と信頼できる結果transport。通常UIのnative実行・保存採点は無効。
- Deferred: 実Pages/Safari/手動読み上げ、基礎講座後の実践UI。別Task未設定。案B codec/facadeは不採用。
- Evidence: evidence/2026-10-03-project03-export/。28unit、3幅/実download15/遅延6race、CSS/project01/workspace/旧21回帰、rawlogs、独立JSON/mobile最下行画像。
- Verification: Windows既存Chromium、タスク専用Playwrightを使用。browser sandbox無効化flagや設定変更なし。
- Boundary: 選択した4ファイルのUTF-8/bytes/hashを照合するのみ。README内容は対象外。コード未実行/上書き/保存/外部送信なし、完了結果importなし。既存Worker1枠/2秒結果期限/5秒予約/opaqueframe、旧21v1、同snapshot exportを維持。OS path/symlink/save完了の保証なし。
- Approval: main merge/公開未実施。main mergeには実行直前のユーザー明示承認が必要。

正本は task-list.md。設計は DESIGN.md と design/chapter7-native-export.md。GitHub Actionsは使用しない。
