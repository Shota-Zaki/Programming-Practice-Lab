# NEXT_WORK.md

- Active Task: PPL-FOUNDATION-001 — Web開発基礎講座
- Status: in_progress。今回はproject03ファイル照合先行教材。3幅実UI/実download15と遅延結果6ケースまでPASS、固定候補レビューと回帰確認を進める。
- Completion: 92%（旧21+project01=22/24）。project02 CSS条件を満たしてもproject02全体の完了へ加算しない。
- Branch: work。Windowsタスク専用checkout task-2/ppl。CSS候補3f9fc9e22a0cfa323899eefed0652e4424a84544/tree b6c584b390951ea8f2e5440b0e32ec4c29d5e11dは親policy再確認/remote/trigger確認後に通常push・connected GitHub照合済み。Pages main/docs、work workflowなし、required CIなし（PASS扱いしない）。
- Next Action: project03の固定候補を独立レビューし、検証/証拠/管理文書を完了して親へ次の公開gateを依頼する。親の最新policy/remote/trigger確認前にはpushしない。
- Ready: 固定ファイルのbytes/hash照合と現編集snapshot比較（実行/上書き/外部送信/履歴更新なし）。
- Planned: project02の選択変更/標準localStorage動作、project03の確認/成果物、共通形式/adapter、IndexedDB。
- Blocked: 任意native実行の専用環境（通信拒否/ファイル・プロセス分離/資源上限）と信頼できる結果transport。通常UIのnative実行・保存採点は無効。
- Deferred: 実Pages/Safari/手動読み上げ、基礎講座後の実践UI。別Task未設定。案B codec/facadeは不採用。
- Evidence: 先行CSSは evidence/2026-10-03-project02-css/。今回は evidence/2026-10-03-project03-export/ に3幅/実ファイル照合/負ケース/取消と影響回帰を保存する。
- Verification: Windows既存Chromium、タスク専用Playwrightを使用。browser sandbox無効化flagや設定変更なし。
- Boundary: learner JS未評価。scriptなしpreview/opaque parser、旧21ID/v1、既存Worker1枠/2秒結果期限/5秒予約、同一snapshot export契約を維持。CSS確認結果は履歴として保存しない。
- Approval: main merge/公開未実施。main mergeには実行直前のユーザー明示承認が必要。

正本は task-list.md。設計は DESIGN.md と design/chapter7-native-export.md。GitHub Actionsは使用しない。
