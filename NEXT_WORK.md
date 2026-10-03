# NEXT_WORK.md

- Active Task: PPL-FOUNDATION-001 — Web開発基礎講座 / 統合CORE共通採点adapter。
- Status: adapter実装済み、検証/独立レビュー中。旧21教材の実UI採点を共通要求/envelopeへ接続する。
- Completion: 講座92%（22/24）、教材数/native受入へ加算しない。今回AC進捗はtask-list.mdを参照。
- Branch: work。Windowsタスク専用checkout task-2/ppl。
- Last Publication: project03 89b1274b8c4583e97e2df91077e1d7f2694740f1/tree272044be0bbd4fa22051772aee36f84d0ddf9335。親policy13:06:41UTC r8/selection6/applied6許可後、remote親3f9fc9e/trigger再確認、通常push、connected GitHub SHA/tree一致。Pages legacy main/docs、work workflowなし/rulesetsなし/required CIなし（PASS扱いしない）。
- Next Action: exact製品候補でunit/実UI3幅/旧21回帰/同期検証と独立レビュー。次公開は親の最新policy/remote/trigger gate後のみ通常work反映する。
- Ready: 既存4方式のdispatch/要求/結果行相関、未知/native modeの実行前拒否。
- Planned: 教材全体共通形式、IndexedDB移行、project02 native動作/Storage、project03成果物の実行受入。
- Blocked: 任意native実行のOS通信/ファイル・プロセス分離/資源上限・停止確認/専用origin-profileと信頼できる結果transport。
- Deferred: 実Pages/Safari/手動読み上げ、基礎講座後の実践UI。別Task未設定。案B codec/facadeは不採用。
- Boundary: 既存grader/旧21ID/progress.js/v1 keys・result行/Worker1枠/2秒結果期限/5秒停止予約/opaque sandbox維持。runId/envelopeを保存しない。共通教材全体形式/IndexedDB/native実行/新権限は追加しない。第7章静的workspaceは独立系を維持。
- Approval: main merge/deploy/サービス再起動/設定変更/新persistent accessなし。main mergeには実行直前のユーザー明示承認が必要。

正本はtask-list.md。設計はDESIGN.mdとdesign/common-grading-adapter.md。GitHub Actionsは使用しない。
