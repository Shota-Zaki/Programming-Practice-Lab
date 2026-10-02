# 第7章静的workspace — 2026-10-03

Baseline `bc54a90632242e373d683c1bffd29a3ec886db6d`。
Product source `95f860447f9272f2c009e303a7ebd1bd298cb3dc`、final Native QA source `f42971f91e8aaac652b508c55536b178f3ebf2fa`。
Existing course regression source `c67e532ae297ed9fa5762eb037e953cc70089bd4`。

承認済み案A設計に沿い、通常講座から開く3ファイル編集workspace、独立保存schema/key、隔離静的構造確認、scriptなしプレビュー、同一snapshotのファイルexportを実装した。chapter7の3教材は登録/完了判定へ追加せず、既存21教材・24の計画分母を維持。native Window実行・採点結果relay・通常ブラウザーfallbackは有効にしていない。

## 実装の境界

- index.html/styles.css/app.jsの入力は書き出し時にUTF-8 bytesを維持。各32KiB/合計96KiBを拒否で扱い、切捨て・Unicode変換・JSラップをしない。不正surrogateは明示拒否。
- manifestの3ファイルSHA-256とbytes、READMEを同じsnapshotから準備。5ファイルを個別取得し、「ダウンロード開始」を端末保存完了とは扱わない。変更/移動/取消/resetで旧pending結果とURLを破棄。既に取得したファイルを回収できない説明を付ける。
- 編集保存は`ppl.foundation.project.v1.profile`だけ。破損rawを自動上書きせず、確認付きresetまで保持。保存拒否/limits/crypto障害でもメモリの編集を保持。旧v1のlesson/code/履歴を変更しない。
- learner HTML/CSSは通信禁止のopaque iframe内の固定parserへデータとして渡す。learner JSは解析・評価せず、表示コピーはsafe HTML要素/属性とCSSOMに限定。表示frameはsandbox空/CSP script-noneを維持。CSSOMのresource関数tokenをescape/コメント/文字列込みで確認し、resource宣言・未対応CSS ruleを表示コピーから省く。CSPは通信の境界でありtoken検査をOS通信隔離の代わりにしない。

## 検証

- モデル/保存/exportのtestsを先行しmodule未実装で失敗、getterのunavailable/corrupt区別を追加して失敗確認後に修正。CSS token testsも先行。最終 **17 tests PASS**（project model7、CSS token2、既存execution controller8）。
- **35 nativeシナリオ PASS**、Chromium151.0.7922.34、375/768/1280。ファイルtabの矢印/End/通常Tab、CtrlとCommand+Enter、3ファイルreload復元、scriptなし実DOM/CSS描画、nativeボタン無効、繰返しexport、実download30件、各bytes/hash照合、限度エラーの入力保持、悪性markup/CSS、parser即時abort解放、digest保留中のedit/cancel/move/reset、reset取消/確認、readyリンクの取消を確認。
- 375幅のcontrolled SecurityError/QuotaExceededError/破損保存/digest障害と回復・再試行を確認。quota注入はブラウザー実quota枯渇の証拠ではない。
- 使い捨てpersistent profileを実際に閉じ、新しいブラウザープロセスで同じoriginへ再open。app側のnative localStorageから3ファイル/active tabを復元。learner JS/native成果物実行の証拠ではない。profileはfinallyで削除。
- 新action buttonの実computed color比4.5以上・高さ44px以上を検証。最初の静的確認ボタンは比1.20で失敗し、dark editorから継承した文字色を限定修正。全体のa11y/zoom/読み上げを受入済みとしない。
- 3通常幅contextでpageerror0、観測した外部/漏洩request0、正規入力console error0。悪性入力でCSP拒否メッセージ6件を別記録。fault/persistent phaseは復帰状態のassertionを行い、追加のconsole/pageerror収集をしていない。
- **既存21教材×3幅 PASS**。開始例/完成例、reload/reset/no overflow、HTML誤答22、CSS誤答10と第4章layout誤答15、取消/timeout retry、旧v1/旧入力移行、破損/保存拒否を回帰確認。元の教材/採点/進捗/実行module9本はbaseline bytes/hash不変。回帰後の修正は新workspaceのCSS resource検査とproject用ボタンCSSだけで、foundation.js/index.htmlは回帰SHAと同一、旧CSSはprefixとして不変。
- `npm run verify:agent` PASS（build/check:pages/docs同期）、baseline diffチェックPASS。

## 独立レビューでの修正

最初のplain image-set文字列URL指摘は、選択ChromiumのCSSOMがurl()へ正規化する実測により撤回した（`imageset-red.log`は名前にredがあるがこの反証runはPASS）。実証された欠陥はcustom property内のescaped image-setをvar()で参照するとresource診断が確認済みになるもの。`css-variable-red.log`が失敗証拠。token検査で修正し、plain/prefixed/escaped/var経由の4例×3幅をnative検証。修正後product95f8604の独立ソースレビューは阻害指摘なし。証跡全体の固定checkpointレビューは別記録する。

## 証拠・状態

`manifest.json`にproduct/旧module/全artifact hashes、実行SHAを保存。`native/`はfinal35シナリオ・30実取得ファイル・全体3枚とfocusedプレビュー3枚。full-page captureでoffscreen iframeが空に写る場合があるため、実描画はfocusedプレビュー画像とDOM/computed CSS assertionで確認する。`regression/`は既存教材の実画面。可読logとgzip exact rawはCR/末尾空白/末尾空行のみ正規化する。

講座21/24=88%のまま。native runner環境と信頼できる結果transport、3教材の実受入は未完了。2026-10-03の親指示でremote pushは保留中。workflow/settings/run/deployを変更・実行せず、main merge/公開も未実施。静的workspaceのローカル実装・検証とリモート反映を区別する。

固定証跡checkpoint `f483f0aba284789a65ff9b432954a0c77e0663c0` の独立レビューは阻害指摘なし。製品不変、134artifact hashes、raw/可読log、35シナリオ/30取得ファイル/6画像、旧module9本、限定した受入主張を確認済み。反映を含む最終条件が保留のためworkspace5/6を維持。この後の更新は管理文書・本review記録だけ。
