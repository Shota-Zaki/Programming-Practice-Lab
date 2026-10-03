# 第7章 — native localStorageと持ち出せる自己紹介サイト

## 採択と範囲

2026-10-03、ownerは案A「標準localStorageを使い、書き出した成果物でも同じ学習者コードが動く」を承認。第7章は既存MINI PROJECT / 3 LESSONS「自己紹介サイトを完成させる」「設計、実装、確認、公開用ビルド」を維持する。実装・教材受入前の21/24=88%は変えない。本書は具体的な実装契約であり、実環境が準備済み・新教材合格済みという宣言ではない。

標準の同期getItem/setItem/removeItem、通常のDOM/eventを成果物のWindowで使う。独自Promise API、localStorage polyfill、Worker向け同期風snapshotへ置換しない。第5/6章の限定APIとの違いを教材冒頭で説明する。案Bの旧codec/facade候補は不採用の履歴としてDESIGNに残し、この成果物には接続しない。

## 3教材と一つのconsumer

consumerは一つの小さな自己紹介サイト。架空の表示名、紹介文、学習テーマを表示し、テーマの選択だけをnative localStorageへ保存する。個人情報、秘密、外部画像/フォント/ライブラリ、送信フォームを求めない。画像は今回不要。HTML/CSS/JSの組合せを教え、保存専用3教材にはしない。

|教材ID（実装時に登録）|内容|到達条件|
|---|---|---|
|project01|設計と構造|title/lang、h1、紹介文、学習内容リスト、label付きselect#topic、p#topic-message、button#forget(type=button)の構造を作り、tab/labelで操作できる|
|project02|見た目と動作|375/768/1280で読みやすいCSS、selectのchangeで現在の選択をtextContentへ反映し、native setItem/getItemで再読込復元、removeItemで「保存を忘れる」を実装する|
|project03|確認と成果物|3ファイルの同じbytesを出力し、専用実行環境で初回・選択・再読込・閉じて再open・忘れる・保存失敗を確認、最終snapshotに対応した確認結果と持ち出し手順を示す|

学習テーマは固定値html/css/javascript。保存keyは`ppl.profile.v1.topic`、valueは上記文字列だけ。getItemがnullなら未選択、その他の値は「保存内容を確認できません」とし自動削除/上書きせず、忘れる操作でこのkeyだけremoveItemする。読み書きのSecurityError/QuotaExceededErrorは「この端末では保存できません」と表示し、選択/表示自体は操作可能、保存成功とは表示しない。保存が成功した後の例外や停止はrollbackされない。clear()を完成例・通常resetへ使わない。

「許可key」は教材の到達条件でありnative Storageの権限制限ではない。任意学習者JSは専用origin内の全keyへアクセスできる。許可keyの検証だけで権限境界を作ったとは扱わない。専用origin/profileに講座進捗や他project、実ユーザーデータを置かないことが実際の分離条件。

## 編集・確認・exportのUX

既存教材ページ/見た目を使い、第7章だけindex.html / styles.css / app.jsの3タブを追加。タブ切替は入力を消さず、label/keyboard操作が可能。HTMLは文書全文、CSS/JSは各ファイルの全文。HTMLの末尾は`<script src="./app.js" defer></script>`、headは`<link rel="stylesheet" href="./styles.css">`。同じコードを演習・持ち出しに使い、JSを書換え/ラップ/別APIへ翻訳しない。JSはmoduleにせず今回の初学者範囲で通常defer scriptとする。

「静的プレビュー」は現在同様scriptなしsandbox。外部通信を禁止し、学習者HTMLからscript/event属性/外部resourceを除いた表示専用コピーを使う。これは動作確認・保存確認ではないと表示。除去は表示コピーだけで、入力/成果物を書換えない。HTMLを親へ挿入せず、CSPやsandboxを学習者入力で置換できないtrusted外枠を維持。第7章に現Workerの「コード実行」を流用しない。

「ファイルを書き出す」は一つの編集snapshotを固定し、index.html/styles.css/app.jsを個別ダウンロード、操作手順README.txtとmanifest.jsonも提供。zip依存は追加しない。3ファイルを同じ空フォルダに保存する手順を示し、各ファイルの取得済み表示はダウンロード開始だけを意味する。OSの保存完了を検出できるとは説明しない。manifestは固定projectId/schemaVersion、ファイル名/UTF-8長/SHA-256を持ち、検証・local実行は全ファイルのhash一致を要求する。書き出すJS/CSS/HTMLは編集snapshotのUTF-8 bytesと一致し、文字列連結でJSをHTMLへ埋め込まない。`</script>`やHTML風文字を修正しない。READMEとmanifestへ進捗/採点履歴/端末の保存値を含めない。

固定名以外のパス、absolute path/..、symlink経由のファイル、外部import/CDN、任意filenameをlocal runnerへ渡さない。HTML/CSS内の禁止resource/追加scriptは意味解析で事前診断するが、診断はsandboxの代わりにしない。コード上限はファイルごと32KiB UTF-8、3ファイル合計96KiB。限度超過は切捨てずexport拒否、編集は保持。既存JS32KiBのUTF-16等の契約は変更せず第7章exportのbytes上限と区別する。

途中で入力変更/教材移動/初期化したら未取得ファイルのexportを取消し、既に取得したファイルは回収できないと伝える。再exportは全snapshotを作り直し、混在bundleはmanifest不一致で実行拒否。初期化は確認付きで編集を開始コードへ戻し、第7章の合否を未確認にする。成果物のnative保存を消したことにしない。既存21ID/v1のデータや完了履歴を変更しない。新projectの編集保存は登録と新schema adapterの検証後に専用prefixへ保存し、既存v1へ3ファイルを無理に詰めず、移行/IndexedDB変更をこのscopeへ含めない。

## 専用originと保存ライフサイクル

native実行は親アプリとつながらない別のローカル実行ホストで行う。通常のユーザーブラウザー・講座origin・既存profile・srcdoc/blob/file:へ任意nativeコードを実行しない。file:永続性は保証しない。画面から自動open/localhost通信/credential/コード転送をしない。取得ファイルを利用者が専用実行ホストに渡す明示操作だけとする。

実行ホスト案はproject単位の専用ブラウザーprofileと専用HTTP origin。URLは`http://127.0.0.1:<専用ポート>/index.html`、loopback bindのみで、ポートは初回に未使用をOSで確認して割当/予約しprofile metadataへ保存する。同一projectの再openは同一originとprofileを使う。ポートが他プロセスで使用中なら接続/自動port変更せず起動拒否。別projectは別profile＋別予約port。path/queryだけの区別は保存分離にならない。秘密のtokenをURLへ置かない。親とopener/postMessage/exposed-functionで接続しない。起動前に既存profileではないこと、origin metadata/hashを検証する。

local実行中は一つのpage/project、同時host一つ、待ち行列なし。独立controllerがページ起動を2秒以内に応答させ、超過時/停止時はブラウザープロセス群を停止し、プロセス終了を確認できるまで次runを拒否。responsiveになったら利用者のイベント操作を受け付けるが、無限handlerに備える外部heartbeat監視を継続し、外部停止UI/terminalを用意する。HTTP originを持つWindowのJSはmain threadで動くため親timer/iframe.removeを停止保証としない。既存Workerの2秒結果期限/5秒予約を流用・緩和しない。

正常終了はブラウザーをgraceful closeしprofileを保持、再openでnative復元を実測する。強制停止/電源断では最後の書込のdisk永続性を保証せず、次回実際にgetItemした値を示す。runごとにsnapshot/resultは分け、停止・error・旧bundleの合格を現snapshotへ流用しない。同一projectの二重起動はcontroller lockで拒否し、native Storage自体にtransaction/lockがあるとは教えない。

「保存を忘れる」は学習者サイト内の一key削除。runnerの「実行データを削除」は停止完了後、確認付きで当該専用profileの保存とorigin metadataを削除。起動中/他project/ユーザーブラウザーのprofileを削除しない。次回は初回扱い、新originで旧値がないことを確認。「教材初期化」「ファイル再export」「講座進捗初期化」と別操作として説明する。書き出したファイルや講座進捗は保持。

## 任意native実行の成立条件と現在のblocker

別originは親のStorage/DOMを分離するが、任意nativeコードの通信・CPU/memoryを制限し切るものではない。CSPのconnect-src/default-srcは主にfetch/resourceを制限し、Window自身の外部navigationまで全面禁止する保証ではない。通常ブラウザーでexport HTMLを開くことを隔離実行として案内しない。JS API隠蔽、文字列検査、localhost専用port、CSP metaだけでは安全境界にならない。

必要な実行ホストは、既存の隔離環境内に専用ブラウザープロセスを起動し、OS/container側で外部通信・ホストlocalサービス到達を拒否、controllerから固定bundleだけを配信できること。CSP HTTP header（default/connect/frame/object/worker/form-action/base-uriを制限、固定JS/CSSだけ許可）、browser request interception、popup/download/新page/permission/service-worker拒否は補助境界として併用。WebSocket/WebRTC/STUN/DNS/外部navigation/custom scheme、loopback他port/ユーザーoriginへの到達まで実環境で負検証する。HTTP sandbox headerのallow-scripts/allow-same-originが必要なnativeホストは既存iframeとは別の最外実行境界とし、既存opaque frame属性は変更しない。ブラウザーprofileにcookies/ログイン/拡張/秘密をコピーせず、browser sandboxを無効化する起動flagを使わない。

固定bundle配信はindex.html/styles.css/app.jsの三つだけをGET/HEADで提供し、任意path/query、directory listing、書込endpoint、progress/result/profile APIを持たない。ブラウザーからcontrollerの管理APIへ到達させない。bundleはread-only、専用profileだけwrite可能とし、実行プロセスへユーザーHOME/Repository/credentials/socketをmountせず、ブラウザーと配信以外の子プロセス生成を環境側で制限する。ここで列挙した分離は必要条件であり、未構築の環境を確定済みとして扱わない。

設計時の旧Macには、この任意native Window実行向けOS通信拒否・プロセス資源境界の受入証拠がなかった。これは接続Windowsの機能不在を意味しない。2026-10-03のWindows読み取り専用調査はdesign/windows-native-inventory.mdを参照。OS primitiveは存在するが必要制御を満たす既承認hostは未確認で、native受入は未完。今回新規インストール/設定変更/container構築/サービス再起動をしない。Playwrightのoffline/route abortやCSPだけをOS境界の証拠にしない。OS級memory上限がなくても安全と言い換えず、どの上限を採用できるか実環境の工程で確認する。**通常UIのnative実行・採点接続はBlocked。設計と静的編集/exportの実装はこのblockerから独立してReady。** 管理ホストがない場合、native実行ボタン/完了判定は利用不可の理由を表示し、通常ブラウザーでのfallbackをしない。

持ち出し成果物は通常のnative DOM/Storageコードであり専用ランタイム/async APIを必要としない。ただし成果物を自分の通常ブラウザーや公開先で動かす場合はこの隔離境界の外であり、この講座からその安全性/永続性を保証しない。公開手順・deployは別承認。本書のexportはファイル生成のみ。

## 実装順序・合格の取得

1. この設計を固定SHAで独立レビューし、矛盾・実装不能な保証を解消する。
2. 3ファイルモデル/静的プレビュー/export+manifest/編集復帰を実装、まず静的部分だけ独立受入。未受講projectを合格/全24教材完了としない。trusted固定コードのnative観察はnativeAPIの説明用に限り、学習者コード実行の証拠にしない。
3. 既存・承認された専用実行環境がある時だけnative hostを実装・検証。必要なインストール/ネットワーク隔離設定/課金等は別途承認し、設計承認をその承認へ拡張しない。
4. 同じ固定bundleをnative hostとexportファイルから実行し、3教材全体の受入を終える。runner結果はcode/hash/profileId/projectId/runIdと親controller側観察結果を持つ。学習者が書く合否/console/postMessageを信用せず、固定シナリオを外部controllerで実際に操作しDOMとnative保存を読む。結果だけの任意JSON importや自己申告で完了を付けない。結果の講座連携transport/信頼性はhost工程で定義・負検証してから接続し、ここではpostMessage bridgeを新設しない。

検証・合格の詳細と状態はtask-list.mdの実装受入条件を正本とする。各教材で未実装開始例/完成例/意味誤答を実測し、project01は静的構造合格、project02はnative動作合格、project03は同一artifact実行と復帰合格の取得後にのみ教材数を22/23/24へ進める。設計やexportだけでproject02/03を合格扱いにしない。

## 仕様の根拠（2026-10-03確認）

- [HTML Standard Web storage](https://html.spec.whatwg.org/multipage/webstorage.html): Window API、origin別保存、opaque origin/policyのSecurityError、同期Storage、quota拒否、複数Windowのlock不保証。
- [HTML Standard iframe sandbox](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox): same-origin権限、同origin scripts+same-originのescape、hostile内容の専用domain。
- [CSP Level 3](https://w3c.github.io/webappsec-csp/#directive-connect-src): script通信とresource制約。OS通信拒否やプロセス停止への推論は本設計の工学上の判断でありCSPがそれを実装する主張ではない。
