# CORE 共通教材形式v1

Baseline: b988b66cc5dc04a1e03591bb921feeee87628da1。固定Product: 53cd3a8f5afbd9120e886278c544cdcf35d8f9e6。

## 実装・互換性

version1/id/course/chapter/language/title/learning/exercise/nextLessonIdの共通形式を定義し、既存21教材をcompileしたcatalogを通常UIのgrading-adapterへ接続した。旧UI/progress/grader/APIへ同じ定義からlegacy viewを生成する。root/本文/mode別payload/条件/graph、密array・plain JSON/descriptorを確認し、コピー/凍結する。未知版/field/native mode/混在payload/重複ID/不明・別course・循環nextを拒否する。

公開済みbaselineから作ったfixtureの21教材と、ID/順序/本文/例/開始code/期待値/条件/payload/nextを深い比較で照合した。旧CSS helperの任意requiredSelector=undefinedだけをJSONに存在しない省略形へ整える。値を持つfieldは不変で、一般の未知field/不正値の削除・修復はしない。canonical形式とlegacy adapter呼出し双方で同じ採点spec/resultを返す。

progress.js/4grader/旧21ID/v1 keysは変更しない。教材定義のversionは保存版ではなく、学習者code/checkedCode/result/attempts/completedを移行しない。common定義/envelope/runIdを保存しない。DB upgrade/IndexedDB/newkey書込なし。第7章3ファイルprojectは独立namespace/入力形式を維持し、single-code schemaへ混在させない。今回AC5/5=100%、講座22/24=92%を維持する。

## 固定候補の検証

- Windowsタスク専用checkout、Node24.19.0、既存Chromium153.0.8010.12、タスク専用Playwright1.63.0。一時profile/loopback静的serverを終了時解放。新install/グローバル設定/sandbox無効化flag/新権限なし。
- 50unit/controller PASS（format12 + 既存38）。21baseline/JSON往復/同値spec/コピー・凍結/schema・payload・graph・descriptor/疎array・未知field・循環・getter無呼出しを確認。旧v1/未完成code/古いcheckedCode/保存拒否と再読込の保存値も維持。
- 通常UI375/768/1280 PASS。実moduleでcommon21/version1/legacy viewsを確認し、旧保存/古いcheckedCode非表示/CSS旧grader行一致、同コードoldcallback破棄、編集/reset/教材/画面/reload中断、synthetic trusted依存の異なる結果ID拒否、正常retry、実DOM、数値Worker停止/既存5秒予約後retryを確認。v1のみ保存、native/unrelated key不変、横溢れ/errors/外部requestなし。
- 旧21教材×3幅の開始/完成/再読込/reset PASS。HTML意味誤答22、CSS10+layout15意味誤答・同値/幅集約/途中取消/timeoutretry、旧v1/単体入力/破損/保存拒否もPASS。rawlegacy.logと代表9画面を保存する。
- workspace35観測/実download30（6束）、project03 9ケース/実download15（3束）/3幅/遅延6race PASS。保存したFile bytes/hashと編集snapshotの照合を維持。
- npm run verify:agent / source-docs同期 / diffcheck PASS。GitHub Actions不使用、required CIなしをPASS扱いしない。

## 独立レビューと修正

初回2e50c53の独立レビューで、legacy CSSのmap/spreadが検証前に隠れた不正field/array propertyを落とすこと、common mode/test idやCSS selector getterを先に呼ぶ不備が再現された。これはtrusted教材定義APIのschema不備であり、learner sandbox escapeの証拠ではない。元の密array/object descriptor/keysを先に検証し、その後だけ任意undefinedを整えるよう53cd3a8で修正した。mode/testもpropertyを読む前にobjectを確認する。12番目のformat testで全再現を拒否しgetter呼出数0を確認する。

初回schema probe/mobile証拠はreview/へ保持した。修正後のexact53cd3a8独立レビューで12unitと9probe拒否/getter呼出数0、Git baseline21教材/JSON往復、固定Git bytesのmobile旧保存/reload/同コード取消/retry/quota拒否/namespaces/error-network-overflowなしを確認し阻害なし。独立mobileを、実装agentの3幅/full21回帰から区別する。初回独立mobile harnessのMIME設定失敗は修正後の正常結果と区別してrawを保持する。

## 境界・残件・公開

Worker1枠/2秒結果期限/5秒停止予約/opaque frame/network/storage境界を維持する。native任意実行のOS通信拒否/ファイル・プロセス分離/CPU-memory上限/停止確認/専用origin-profile/信頼できる外部controller transportは未受入。実Pages/Safari/手動読み上げはDeferred。DB transaction/途中DB upgrade受入は未実装で主張しない。

前工程CORE adapterは親policy13:39:42UTC r8selection6applied6許可後、expected parent89b/Pages legacy main/docs/work workflowなし/rulesetsなしを再確認しb988b66cc5dc04a1e03591bb921feeee87628da1/tree918075789781e6b145974e50888cd405db5b4452を通常push、connected GitHub readback一致。今回ローカル候補は親の新policy/remote/trigger gate待ち。main merge/deploy/サービス再起動/設定/新persistent accessなし。

Active: Foundation。Ready: レビュー済み共通形式候補。Planned: IndexedDBの移行/復帰契約と残native動作/成果物。Blocked: native専用環境/transport。Deferred: 実Pages/Safari/読み上げ/実践UI。別Task未設定。main mergeには実行直前のユーザー明示承認が必要。
