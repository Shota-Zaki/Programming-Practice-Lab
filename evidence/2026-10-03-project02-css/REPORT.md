# project02 CSS先行教材 — 検証記録

Baseline: d9307c29f7724f524f45979f4f7a49c5dfbfa7b7（通常work反映済みproject01）。Product: 352fa9d476a571509fbfec568d681adbaf8c3445。

実装単位はCSS教材と教材切替、共有3ファイルの静的3幅確認。project02全体の完了ではない。講座受入は22/24=92%のまま。教材切替は入力を保持し、確認結果/取得リンクを取り消す。再読込時はproject01教材に戻り、保存した3ファイルは復元する。確認付き初期化は常にproject01開始コード。CSS結果は履歴へ保存せずproject01/旧21進捗を変えない。

## 検証

- Node24.19.0 / Playwright1.63.0 / 既存Chromium153.0.8010.12。Windows専用checkoutと一時profile/loopback server。追加browser/setup/security設定なし。
- 21 unit/controller PASS。
- CSS実UI375/768/1280、7ケース、32意味誤答と5同値/長文例 PASS。16静的条件（構造10+CSS6）。Tab操作、3幅表示、履歴不変、同じ入力、再読込、確認初期化、取消/編集/教材切替/画面移動、exportリンク取消、getter拒否/quota制御fault/破損保持を確認。
- project01回帰3幅、7ケース、40意味誤答/同値fieldset1 PASS。旧ID/進捗の互換性を維持。
- workspace回帰35観測、実ダウンロード30ファイル（6束）/UTF-8 bytes/SHA-256 PASS。
- 旧21教材×3幅、既存HTML/CSS誤答/保存fault/停止・期限などfoundation回帰 PASS。
- npm run verify:agent / 生成物同期 PASS。required CIは設定なしでありPASS扱いしない。GitHub Actions未使用。

## 独立レビュー

初期c56028aの必須内容/親の切抜き、transparent文字、固定card外側余白の誤合格を再現し修正。85665dcで対比/geometry17ケース、教材切替途中の8race、21unit等を独立確認。再発見した上方退避/負text-indentも修正し、固定352fa9d476a571509fbfec568d681adbaf8c3445の独立再現で阻害指摘なし。review/に正/負ケースJSONと初期誤合格PNGを保存。前段レビューの制限・指摘と最終結果は別記録。

## 明確な限界

learner JS・標準localStorageは実行しない。専用native環境/OS分離・資源上限/信頼できるtransportはBlocked。CSS採点は計算済み単色背景・文字色/寸法/配置の条件に限定し、画像/gradient、opacity変更、blend、mask/clip/filter、負text-indentを使わない。native selectの行高/overflowはbrowser管理。任意CSSのfocus表示・重なりを含む全描画/アクセシビリティの保証ではなく、完成例のTab/focus/labelは実UIで確認した。実Pages/Safari/読み上げはDeferred。

## 公開状況

project01 remote work SHA d9307c29f7724f524f45979f4f7a49c5dfbfa7b7 / tree dd3991f621580128196b2053aa044ad3de0fed63 を2026-10-03 12:18UTCにもconnected GitHubで読取一致。work required checksなし。今回の候補はローカルworkのみ、親の最新policy/remote-head/trigger再確認待ち。main merge/deploy/サービス再起動/設定変更/永続アクセス追加なし。
