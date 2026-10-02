# 第6章 js04 DOM更新教材の実UI受入 — 2026-10-02

Baseline: `6243aff0652f3734d5882dee01f781bd9d1d320a`。検証したsource/test: `00821bbaea1b8b0f632e51d802b0c3e9a5c63dcc`。

js04だけを追加した。ID選択とtextContent更新を教え、固定HTML・対応API・nativeとの差を説明する。イベント/入力の残り2教材は未実装。既存IDとv1保存形式を維持する。Chapter6は予定3教材を分母にして1/3=33%、講座実装・検証済み19/24=79%とする。

## 実UI検証

`tests/dom-lesson-browser.mjs`をChromium151.0.7922.34で実行。375/768/1280pxすべてPASS。実際の教材選択・演習画面から完成例/開始コード/未対応API、親による採点、復元、停止、実行中初期化、入力による取消、素早い教材移動、2秒期限後再試行、進捗分母、横溢れ/pageerrorなしを確認。375pxで成功した同一コードを再実行して停止する境界も確認し、結果は未確認へ戻り固定HTMLへ復帰、既存完了履歴は保持する。これはAPI consumer harnessではなく通常UIの操作である。

375pxで偽postMessage、HTMLに見える文字列の安全表示（img/scriptノードなし）、禁止通信0件も確認。旧v1のjs03履歴を保持し、js04は新規状態から開始。`ui-results.json`と`ui.log`参照。practice-1280.pngとpreview-375.pngを目視確認した。

## 回帰と検証

`tests/foundation-browser.mjs`: 全19教材×3幅で完成例、復元、初期化、横溢れなし、pageerror0。既存HTML22/CSS10/layout15誤答、旧v1/旧入力移行、破損・保存拒否、CSS取消/期限後再試行もPASS。`regression/browser-results.json`参照。

`node --test tests/javascript-execution.mjs`: 8/8 PASS。`npm run verify:agent`: build/check:pages/生成物同期PASS。各raw logを保存。第5章数値JSの対象をDOM教材から明示分離した。DOM実行境界はbaselineと同一（source-manifest.txt）。固定SHA独立レビューで同一コード再実行停止時の表示残存を修正し、source candidateに阻害指摘なし。

再実行: `PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/dom-lesson-browser.mjs`、同環境で`node tests/foundation-browser.mjs`。Node24でverifyを実行した。

## 残件と限界

第6章2教材、第7章3教材、正式共通形式/adapter、IndexedDB、実Pages/Safari/手動読み上げは未完了。境界の公開2秒期限、単一共有枠、解放後5秒予約を維持。native Workerの終了遅延、OSの硬いメモリquotaなし、再読込による枠寿命、Safari未検証という既存制約は解消していない。5秒は全環境の終了保証ではない。main merge/公開は未実施。
