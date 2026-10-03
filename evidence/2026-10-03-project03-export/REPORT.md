# project03 ファイル照合先行教材

Baseline: 3f9fc9e22a0cfa323899eefed0652e4424a84544（work反映済みCSS教材）。Product: 9150c6db9a91cd14b558833917df3bbea8003ff7。

## 実装と受入範囲

同じ3ファイルを書き出し、利用者が選んだ3コード+manifest（README任意）を内容照合する教材/UI。固定名・重複/不足/余剰・サイズ・4対象のUTF-8・厳密manifest schemaを確認し、rawbytes/hash対manifestと、bytes対現編集snapshotを別々に表示する。READMEは内容もUTF-8も照合しない。コード各32KiB/合計96KiB、manifest4KiB、README16KiBまで。選択データを実行・編集へ反映・保存・外部送信しない。5秒全体期限/取消、編集/選択変更/教材切替/画面移動/初期化で旧結果を破棄する。

先行単位5/5=100%。project03全体/nativeの受入には加算しない。講座は旧21+project01=22/24=92%。新規結果保存key/進捗schema変更/結果JSON import/既存Worker/opaqueframe権限変更なし。

## 固定候補の検証

- Node24.19.0 / Playwright1.63.0 / 既存Chromium153.0.8010.12、Windowsタスク専用checkout。一時profile/静的loopbackserverで確認。追加インストール・sandbox無効flag・永続設定なし。
- 28unit/controller PASS（既存21+ファイル照合7）。UTF-8/Unicode/HTML風文字・現snapshot固定・改変/古いbundle/偽hash・未知名/重複/schema不正・上限前拒否/96KiB境界/空code・read/digest例外・取消/遅延/5秒期限。
- project03実UI375/768/1280、9ケース、実download15（3束） PASS。生成bytesを実際にOSへ保存したファイルからFile入力へ選び直す。正/改変/古い内容・不足・read-only・静的条件のみで未完了維持・reload再選択・旧履歴/nativekey不変・外部通信/コード未評価を確認。遅延digestの取消/編集/切替/移動/reset/選択変更6ケースも破棄。
- CSS回帰7ケース/32意味誤答/5同値、project01回帰7/40意味誤答/同値fieldset、workspace35観測/実download30（6束）、旧21教材×3幅 PASS。
- npm run verify:agent / src-docs同期 / CRLF対応diffcheck PASS。GitHub Actions不使用。required CIなしをPASS扱いしない。

## 独立レビュー

exact9150c6db9a91cd14b558833917df3bbea8003ff7を別agentがレビューし阻害指摘なし。7モデルtest/期限を独立実行し、mobileで正bundle・変更JS・不正rowfield/不足manifest・任意READMEが対象外であること・遅延hash後の切替取消・旧進捗/workspace不変・コード未実行/通信なしを確認。nativekey不変は実装agentの3幅テストによる別の観測で、独立browserチェックの確認項目へ含めない。最下行はmobile navより112px上でhit-test可能。review/のJSONとbottomPNGが証拠。実装agentの3幅/15download/6raceは別証拠。

## 未受入の境界と次の独立工程

照合成功は署名/出所/動作/OS保存完了/物理path/symlink検証を意味しない。FileAPIで利用者が選んだbytesを読むだけ。任意native Window向けOS通信拒否（外部/別loopback/DNS/WebRTC等）、read-only固定bundleと専用profile、HOME/credentials/他project非到達、プロセス群のCPU/memory上限・停止確認、同origin正常再open保存、外部controllerのDOM/Storage観察とsnapshot/hash/runに結び付く信頼できるtransportが未受入。通常ブラウザーfallbackやCSP/routeabortをOS境界に代用しない。

実Pages/Safari/手動読み上げはDeferred。残りproject02動作/project03実行受入はこの技術gateに依存する。承認済みPPL-CORE-001の共通採点adapter interfaceをread-onlyで確認した: gradeHtml(code,tests)、gradeCss(code,lesson,options)、gradeJavaScript(code,lesson,signal/timeout)、gradeDomLesson(code,lesson,options)。既存4方式のdispatch/入力/結果契約を統一し、未知/native modeを実行前に拒否する独立工程は新runtimeや権限追加を伴わず実装可能。新形式へのprogress移行やIndexedDBは今回変更していない。

## 公開

前工程CSSは親policy12:28:18UTC r8/selection6/applied6と許可後にremote親d930/Pages legacy-main/docs/work workflowなし/rulesetsなしを確認し通常push。remote SHA3f9fc9e22a0cfa323899eefed0652e4424a84544/tree b6c584b390951ea8f2e5440b0e32ec4c29d5e11d読取一致。requiredchecksなし。今回はlocalwork候補のみ、親の最新policy/remote/trigger再確認待ち。main merge/deploy/サービス再起動/設定変更/新persistent accessなし。
