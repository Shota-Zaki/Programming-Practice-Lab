# 第6章 js05 クリックイベント教材受入 — 2026-10-02

Baseline: `2a62a2b91f4f2538e0b2fdfcbab15976dd6a2193`。検証source/test: `280a7626bb26a392eed9c2550e7d3895abccab58`。

開始0、native click3回後の1/2/3の4snapshotを親で採点する。5意味誤答を拒否した。既存ID/v1保存と既存証拠は保持。scriptなし結果表示は自動イベント終了後の最終snapshotであり、手操作でhandlerを再実行しない。教材に限定APIとnative DOMとの差を明記した。

## 実UI証拠

`tests/event-lesson-browser.mjs`、Chromium151.0.7922.34、375/768/1280pxすべてPASS。完成例/開始/未対応API、各イベント、保存復元、最終DOM表示、同一コード再実行停止、初期化、入力変更取消、実教材移動、handler無限loopの2秒期限と再試行、進捗分母、横溢れなし/pageerror0を確認。取消はtrusted実行iframeにhandler開始markerが現れたことを確認してから操作する。旧js03/js04履歴を維持し、新教材は新規状態。`ui-results.json`/`ui.log`/各画像参照。375px演習と375pxプレビューを目視確認した。

## 回帰・検証

全20教材×3幅PASS。既存HTML22/CSS10/layout15誤答、旧v1/旧入力/破損/保存拒否、CSS取消/期限後retryもPASS。`regression/browser-results.json`参照。controller8/8、`npm run verify:agent`でbuild/check:pages/生成物同期PASS。raw logs保存。guest実行・共有枠・controllerはbaseline同一（source-manifest.txt）。固定SHA独立ソースレビュー阻害なし。

再実行: `PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/event-lesson-browser.mjs`、同環境で`node tests/foundation-browser.mjs`。Node24使用。第5章/js04等の過去evidenceはそのまま残す。

## 状態と限界

この教材受入7/7。講座20/24=83%、第6章2/3=67%。残り第6章1教材と第7章3教材、正式共通adapter/形式、IndexedDB、実Pages/Safari/手動読み上げは未完。native Worker終了遅延、5秒予約が全環境終了保証ではないこと、硬いOS memory quotaなし、再読込時の枠寿命という制約を維持。main merge/公開未実施。
