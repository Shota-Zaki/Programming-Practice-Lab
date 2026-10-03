# CORE 共通採点adapter

Baseline: 89b1274b8c4583e97e2df91077e1d7f2694740f1。固定Product: ed50f3f8827ed353c87a64d5b7c49f6746b706ac。

## 実装と互換性

Foundation通常UIの4採点方式を、trusted登録と厳密なlessonId/code/runId要求、version1結果envelopeへ接続。登録はコピー/凍結し、未知/native modeを開始前に拒否する。結果行の件数/順序/ID/boolean/string表示値を検証し、保存直前にも要求とcontroller/lesson/codeの相関を確認する。取消は既存graderへのSignalとadapter待機の両方へ伝え、遅延成功/失敗を破棄する。HTMLの結果形は補完せず既存形を維持する。

既存21教材/4grader/progress.jsとv1保存key・version・行を変更しない。runId/envelopeは保存しない。教材全体共通形式/IndexedDB移行は未実装。第7章workspaceは既存独立系を維持する。今回AC5/5=100%、講座22/24=92%。native/project02/03全体受入へ加算しない。

## 固定候補の検証

- Windowsタスク専用checkout、Node24.19.0、既存Chromium153.0.8010.12、タスク専用Playwright1.63.0。新install/グローバル設定/sandbox無効化flag/新権限なし。一時profileとloopback静的serverはテスト終了時解放。
- 38unit/controller PASS（adapter10 + 既存28）。4dispatch/登録snapshot、不正registry/unknown-native mode/要求/envelope/行/sparse結果、取消/遅延成功・失敗/同コードretry、旧v1/単体入力/不一致結果/破損/保存拒否。
- adapter実UI375/768/1280 PASS。旧v1の正しい結果を深い比較で保持、古いcheckedCodeの結果は非表示、CSS旧直接graderの行と完全一致。入力/reset/教材/画面/reload途中取消、同コードの古いcallbackが新実行を上書きしないこと、synthetic trusted graderの異なる条件IDをadapter/save境界で拒否、復旧後retry、実DOM採点を確認。数値Workerは実停止/既存5秒予約後retry。v1のみ保存、nativekey/無関係key不変、横溢れ/errors/外部requestなし。
- synthetic dependency不一致はテストhookによるfault注入であり、実learnerからのnative結果transport受入ではない。前後の正常採点は変更なしの実graderを使用する。
- 旧21教材×3幅の開始/完成/再読込/reset PASS。HTML意味誤答22、CSS10+layout15意味誤答、同値・幅集約・途中取消/timeoutretry・旧v1/単体入力/破損/保存拒否もPASS。rawlegacy.logと代表9画面を保存する。
- workspace35観測/実download30（6束）とproject03 9ケース/実download15（3束）/3幅/遅延6race PASS。選択した保存済みファイルbytes/hashと編集snapshotの照合は維持。
- npm run verify:agent / source-docs同期 / diffcheck PASS。GitHub Actions不使用。required CIなしをPASS扱いしない。

## 独立レビュー

別agentがexact ed50f3f8827ed353c87a64d5b7c49f6746b706acの設計/製品と10unit/Pages/scoped diffを確認し阻害なし。mobile実CSSで旧保存結果のdeepEqual、同コード旧callback、新結果だけのattempt増加、異なるID拒否、QuotaException後のメモリ結果と既存保存bytes不変、v1/no-envelope/nativekey/unrelated/error-networkなしを独立確認した。review JSON/画像を保存する。

最初のrawJSONのlegacy identical:falseはJSON.stringifyのproperty順序差のみだった。追加のed50f3f-legacy-deep-check.jsonで同じ保存値をassert.deepEqualして一致を確認し、元rawも保持した。implementationの3幅/full21回帰と独立mobile検証は別の観測である。

## 境界・残件・公開

Worker1枠/2秒結果期限/5秒停止予約/opaque frameと既存network/storage境界は不変。任意native実行のOS通信拒否/ファイル・プロセス分離/CPU-memory上限/停止確認/専用origin-profile/信頼できる外部controller transportは未受入。通常ブラウザーfallbackや権限緩和を追加していない。実Pages/Safari/手動読み上げはDeferred。

前工程project03は親policy13:06:41UTC r8selection6applied6許可後、expected parent3f9fc9e/Pages legacy main/docs/work workflowなし/rulesetsなしを再確認し89b1274b8c4583e97e2df91077e1d7f2694740f1/tree272044be0bbd4fa22051772aee36f84d0ddf9335を通常push、connected GitHub readback一致。今回はローカル候補のみ、次公開は親の新policy/remote/trigger gate待ち。main merge/deploy/サービス再起動/設定変更/新persistent accessなし。

Active: Foundation。Ready: レビュー済みCORE adapter候補。Planned: 承認済み共通教材形式/IndexedDBと残native動作/成果物。Blocked: native専用環境/transport。Deferred: 実Pages/Safari/読み上げ/実践UI。別Task未設定。main mergeは直前のユーザー明示承認が必要。
