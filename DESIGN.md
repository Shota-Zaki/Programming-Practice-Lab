# DESIGN.md

## 状態

`確定・継続改善中`

Programming Practice Labは、**基礎講座を先に完了し、その知識を実践プロジェクトで定着させる学習サイト**として設計する。

2026-08-06の決定により、最初の完成単位を「タスク管理画面プロジェクト」から「Web開発基礎講座」へ変更した。プロジェクト型の方向性は維持するが、初学者がHTML・CSS・JavaScriptの前提知識を持たない状態で実践プロジェクトへ入る構成は採用しない。

## 学習順序

```text
Web開発基礎
├─ HTML
├─ CSS
└─ JavaScript
↓
Git・GitHub基礎
↓
TypeScript・React基礎
↓
実践プロジェクト
├─ 画面設計
├─ 実装
├─ テスト
└─ 公開
↓
バックエンド・データベース・クラウド
```

## 初期リリースの中心

### Web開発基礎講座

対象:
- プログラミング未経験者
- Webページの仕組みを基礎から学びたい利用者
- Reactへ進む前にJavaScriptの前提を固めたい利用者

学習内容:
1. HTML文書の基本構造
2. 見出し、文章、リスト、リンク、画像
3. 意味のあるHTML構造
4. CSSの選択子、色、文字、余白
5. ボックスモデル
6. FlexboxとGrid
7. レスポンシブ対応
8. JavaScriptの変数と型
9. 条件分岐と繰り返し
10. 関数
11. DOM操作
12. イベント
13. 入力値の取得
14. ブラウザ保存
15. ミニ成果物の完成

構成:
- 7章
- 24レッスン
- 18入力演習
- 1ミニ成果物
- 目安12〜16時間

## 1レッスンの学習循環

```text
今回の目標
↓
短い概念説明
↓
コード例を確認
↓
理解確認
↓
自分でコードを入力
↓
ブラウザで表示
↓
完了条件を確認
↓
次のレッスン
```

説明を読んだだけでは完了としない。入力演習または確認問題を必ず含める。

## 画面構成

### 1. ホーム

目的:
- 最初に受講する基礎講座を明示する。
- 現在のレッスンと次の操作を確認する。
- 基礎の後に実践プロジェクトへ進む関係を示す。

主要要素:
- Web開発基礎への開始導線
- HTML → CSS → JavaScript → TypeScript・React → 実践の順序
- 最初の成果物プレビュー
- 基礎講座の進捗
- 後続プロジェクトへの補助導線

### 2. 基礎講座一覧

目的:
- 基礎分野の前後関係と受講可能状態を確認する。

初期講座:
1. Web開発基礎
2. Git・GitHub基礎
3. TypeScript・React基礎
4. Java・オブジェクト指向
5. SQL・データベース
6. コンテナ・Linux
7. AWS・クラウド基礎

### 3. 基礎講座詳細

目的:
- 完成目標、章構成、所要時間、前提条件を受講前に確認する。

主要要素:
- 最終成果物
- 章別カリキュラム
- レッスン数と演習数
- 推定所要時間
- 前提条件
- 1レッスンの進め方

### 4. 基礎教材

目的:
- 演習に必要な概念を短い単位で理解する。

主要要素:
- 教材内目次
- 今回の目標
- 概念説明
- コード例
- タグや処理の役割
- 理解確認
- 入力演習への導線

### 5. 基礎入力演習

目的:
- 自分でコードを入力し、ブラウザ表示と完了条件を確認する。

初期対象:
- HTMLの基本構造
- title
- h1
- p
- ブラウザプレビュー

主要要素:
- 課題
- 完了条件
- HTML入力欄
- sandbox付きプレビュー
- 条件別判定
- ローカル保存
- 初期状態への復元

### 6. 実践プロジェクト一覧

基礎講座の後に、学んだ技術を複数ファイルの成果物へ組み込む。

初期候補:
- タスク管理画面
- 売上ダッシュボード
- 商品管理API
- 認証付き投稿アプリ
- クラウド公開パイプライン

### 7. プロジェクト詳細
### 8. プロジェクト工程
### 9. プロジェクト教材
### 10. プロジェクト演習
### 11. 演習結果
### 12. 復習
### 13. 学習履歴
### 14. 開発環境

既存のプロジェクト画面は削除せず、基礎講座完了後の実践領域として維持する。

## ナビゲーション

### PC

左サイドバー:
- ホーム
- 基礎講座
- 学習内容
- 入力演習
- 実践プロジェクトUIへの補助リンク

最優先導線は「基礎講座」とする。プロジェクト工程は実践プロジェクト内の下位画面として扱い、主要ナビゲーションから外す。

### スマートフォン

下部固定:
- ホーム
- 基礎
- 教材
- 演習

教材・演習中は、通常ナビゲーションより教材の前後移動と入力・結果確認を優先する。

## 教材設計

### 教材単位

1レッスンは5〜15分を目安とする。長い章を一画面に詰め込まない。

各レッスンに必須:
- `id`
- `courseId`
- `chapterId`
- `title`
- `objectives`
- `contentBlocks`
- `starterCode`
- `completionTests`
- `hints`
- `explanation`
- `nextLessonId`

### 説明の基準

- 用語を使う前に意味を説明する。
- コード例は、何が入力で何が結果かを明示する。
- 正解コードだけでなく、よくある誤りを示す。
- 初心者がコピーだけで進めないよう、必ず一部を自分で入力させる。
- 実務上の注意は基礎説明と分離する。

## 入力演習の技術方針

### HTML・CSS

- iframeの`srcdoc`でプレビューする。
- 初期段階では`script`実行を許可しないsandboxを使用する。
- HTML構造をDOMParserで解析して完了条件を確認する。

### JavaScript

- Web Workerへ分離する。
- 実行時間上限と停止処理を持たせる。
- メインUIスレッドで任意コードを直接実行しない。

### 保存

- 入力コード、試行回数、完了状態をRepositoryインターフェース経由で保存する。
- 初期はlocalStorageまたはIndexedDB。
- 将来は共通APIへ交換可能にする。

## ビジュアル方針

- 明るい背景と濃い文字を基本とする。
- 強調色は主要行動、進捗、成功状態へ限定する。
- コード入力とプレビューを視覚的に分離する。
- 初学者向け画面では情報密度を上げすぎない。
- カードを過剰に入れ子にしない。
- 学習順序は番号と状態を併用する。
- 本文は14〜16pxを基準にする。
- 長文の行長を制限する。
- 正否は色だけで表現しない。

## レスポンシブ方針

### 375px

- 1列構成。
- 基礎講座の順序を縦表示。
- 教材内目次は折りたたむ。
- 入力演習は課題、コード、プレビューを縦に配置する。
- 主要操作は横幅いっぱいにする。

### 768px

- 講座一覧は1〜2列。
- 教材は本文を優先し、目次は上部へ移動する。
- 入力演習は課題とコードを優先し、プレビューを下段へ置く。

### 1280px

- 講座一覧は3列まで。
- 教材は目次と本文を2列表示する。
- 入力演習は課題、コード、プレビューを同時表示する。

## アクセシビリティ

- 主要操作はキーボードで実行可能にする。
- フォーカス表示を維持する。
- コード入力欄でもTabで次の操作へ移動できる。インデントは空白入力、プレビューのショートカットはCtrl/Command+Enterとする。
- 状態変化を`aria-live`で通知する。
- 正否は記号、文言、色を併用する。
- iframeには内容を示すtitleを付ける。
- 動きを減らす設定を尊重する。

## 実装優先順位

1. Web開発基礎の教材データモデル
2. HTML第1章の4レッスン
3. HTML入力演習とプレビュー
4. 進捗保存と再読込復元
5. CSS章
6. JavaScript章
7. ミニ成果物
8. Git・GitHub基礎
9. TypeScript・React基礎
10. 実践プロジェクト本実装

## HTML第1章の実装仕様（2026-10-01）

4レッスンを基本構造 → タグと属性 → 見出しと段落 → 章のまとめの順に提供する。
教材は `lessons.js`、DOM採点は `grading.js`、保存は `progress.js` に分離する。
教材一覧から復習でき、合格後は次の教材へ移動する。章進捗は合格した教材数 / 4。
各教材の入力・試行数・直近採点対象コードと結果・完了履歴を保存し、入力変更時は古い採点を表示しない。
初期化は現在教材の入力と直近結果のみを戻し、完了履歴と試行数を保持する。
旧HTML01入力と表示位置を移行する。保存不能時もメモリ上で操作を継続し、その旨を表示する。
HTMLプレビューはscriptを許可しないsandboxを維持し、CSPで外部通信とフォーム送信を制限する。

## HTML第2章の実装仕様（2026-10-02）

既存HTML第1章のID・保存形式を維持し、章情報を教材データに持たせる。
第2章はhtml05〜html07の3教材。第1章末尾から第2章へ進み、章一覧から各章の先頭へ移動できる。
章進捗は選択中の章の完了数/教材数、講座進捗は全完了数/24とする。

- html05「意味のあるページ構造」: header、main、footerの役割とsectionの見出しを学ぶ。本文直下のmainを一つにし、その中に内容のあるh1、見出しh2と段落pを持つsectionを作る。ページ直下のheader/footerにも内容を入れる。
- html06「リスト・リンク・画像」: 順序なしulと順序ありolの違い、li、リンク先とリンク文、画像の代替文を学ぶ。二つ以上の直下liを持つulとol、実在する一意のIDへのページ内リンク、教材同梱data画像と非空altを条件とする。外部URLや実名は不要。装飾画像では空altが適切な場合もあるが、この演習は情報を伝える画像を扱う。
- html07「入力しやすいフォーム」: form、label/forとidの対応、name、type、required、送信ボタンを学ぶ。form内に一意のIDと明示labelを持つ名前text入力・メールemail入力を置き、両方にnameとrequired、内容のあるsubmitボタンを付ける。placeholderだけではlabelの代わりにならない。実際の送信や個人情報入力は求めず、sandbox/CSPの送信禁止を維持する。

全教材に説明・例・未完成の開始コード・採点条件・ヒントを用意する。採点は独立したDOM構造の関係を確認し、無関係な場所にタグだけを置いたコードは合格にしない。data画像以外の通信を許可せず、フォームも実行アダプターの権限を増やさない。
受入: 三教材の初期コード不合格/完成例合格、誤構造・壊れたリンク・空alt・label欠落の不合格、全7教材の通し操作、章別進捗、旧v1保存の維持、375/768/1280pxの操作と横溢れ確認。

## CSS第3章の実装仕様（2026-10-02）

第3章はcss01〜css04の4教材。入力はCSSのみ、教材が持つ固定HTMLへ適用する。HTML教材は既存の全文入力・保存IDを維持する。章見出し、エディター言語・ファイル名、演習の説明を教材種別に合わせる。

- css01: 要素h1、クラス.intro、ID#noteの選択子を学ぶ。h1を32px、.introを20px、#noteを太字700にし、比較用の通常段落は16pxのままとする。指定選択子の規則と実際の計算値を両方確認する。
- css02: .cardの背景#f0fdf4、文字#14532d、文字サイズ18px、行の高さ1.5を学ぶ。単位・色指定と継承を説明し、計算値rgb/pxで同値表現を受け入れる。
- css03: .cardの内側padding24px、外側margin16px、.introのmargin-bottom12px。余白の領域とショートハンドを説明する。四辺と段落の実値を確認する。
- css04: .cardのwidth240px、padding16px、border2px solid #166534、box-sizing:border-box。内容・内側余白・境界線・外側余白の違いと、外寸を幅に含める意味を説明する。計算値と実際の外寸240pxを確認する。

採点アダプターはCSSOM/getComputedStyleを使い、正規表現でCSSの意味を推測しない。専用の一時iframeはsandbox=allow-scriptsのみでopaque originを維持し、nonce付きの固定採点プログラムだけを実行する。学習者のCSSはMessageChannelでデータとして渡しstyle.textContentへ設定する。HTMLは教材の固定fixtureのみ。親DOM/localStorageへのアクセス・外部通信・フォーム送信・任意スクリプトを許可しない。既存プレビューのsandboxは空のまま維持する。2秒でタイムアウトし、完了/取消時はポートとiframeを破棄する。

非同期採点中の入力変更・初期化・教材移動で古い結果を破棄する。採点失敗は未完了のまま再試行でき、結果や試行数を誤った教材へ保存しない。受入は4教材×3幅の操作、完成例/初期コード、cascade/同値表現/誤選択子/四辺/box-sizing、隔離・外部通信禁止・取消・復元。CSS採点固定viewportは800×600。第4章の画面幅課題は別途明示サイズを設計する。

ブラウザAPIの参照: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe 、https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel 。sandboxのsame-origin許可は付けず、専用portを移譲する。

CSSの四辺条件は全辺を採点したうえで「内側余白」「外側余白」「境界線」のまとまりで表示し、同じ説明を繰り返さない。

## CSS第4章の実装仕様（2026-10-02）

css05〜css08の4教材を追加する。固定HTMLへのCSS入力、旧教材IDと保存、iframe隔離を維持する。

- css05「Flexboxで横に並べる」: .linksをflex/row、align-items:center、justify-content:space-between、gap16pxにする。3項目の可視性と横一列を800pxで確認。
- css06「Gridで列を作る」: .cardsをgrid、等幅2列、gap16pxにし、4カードを2行に配置。実際の各カード位置・幅・可視性を800pxで確認。
- css07「画面幅で列数を変える」: 600px未満は1列、600px以上は2列のGrid。375/599/600/768/1280pxで判定し、全幅でgap16px・可視性・横溢れなしを確認。
- css08「レスポンシブな学習ページ」: .pageをmax-width960px・padding16px・border-box、.page-headを狭幅column/600px以上rowのFlexbox、.cardsを1列/600px以上2列/900px以上3列のGridにする。gap16pxと可視性・横溢れなしを375/599/600/768/899/900/1280pxで確認する。

教材は選択子・軸・行列・fr・メディアクエリ・境界値を順に説明し、例・開始コード・ヒントを持つ。Grid/Flexbox採点は計算値だけでなく、正の幅高さを持つ全子要素の位置から列/行数を測定する。非表示やoverflowで誤配置を隠した答案は合格にしない。小数ピクセルの丸めを考慮し、列位置は0.5px、等幅は1pxの許容差を使う。

採点は教材指定の各viewportに個別の隔離フレームを作り、全幅の結果を同じ条件IDへ集約する。一幅だけの合格で進捗を完了しない。既存教材は800px判定のまま。キャンセルは次の幅へ進まず、各フレームを破棄する。表示用iframeは権限を増やさず、CSS教材のみ「表示領域に合わせる」または指定px幅を選べる。大きい幅はプレビュー枠内の横スクロールで表示し、アプリ全体を横溢れさせない。

受入: 新4教材と旧11教材を3画面幅で通し確認、境界599/600・899/900の誤り、固定幅・非表示・不均等列・折返し・配置上書きの誤答、幅切替、集約結果/取消、保存/旧教材回帰、生成物同期。

## 第5章の教材目標と実行ライフサイクル（2026-10-02）

既存の「値と処理の基本」3教材は次の順序で設計する。教材ID・保存互換性・章構成を維持し、UI方向性は既存方針を使う。

| 教材 | 目標 | 検査する代表値 |
| --- | --- | --- |
| 変数と値 | const/let、代入と式、数値と文字列を区別する | 単価100と個数3から数値300を返す。個数1で100、0で0。文字列「300」は数値300と区別する |
| 条件と繰り返し | 境界を含む条件分岐と反復で集計する | [40,60,80]の60以上だけ合計140。空配列0、[60]で60、[59]で0 |
| 関数 | 引数・戻り値と複数回呼び出しを扱う | priceAfterTax(100,0.1)で110、(200,0)で200、(0,0.1)で0。課題値は整数結果になる入力に限定する |

先行実装は`javascript-execution.js`のライフサイクル契約だけとする。実行ホストはfactoryで供給し、main側はコードを評価しない。1 controllerにつき同時実行1件、置換時は前回をcancelledで終了。runごとに新Worker、相関ID、既定2秒（1〜30000ms）、停止・timeout・結果・エラー時にタイマーとイベントを解放しterminateする。結果はsuccess/value、error、timeout、cancelledに区別し、旧Workerからの遅延応答を採用しない。不正な引数は現在の実行を取り消さず拒否する。

この段階では教材/UI接続、学習者コードを評価するWorker本体、採点器を追加しない。同一オリジンWorkerはDOMからの分離と停止を提供しても、ネットワークやIndexedDBなどの権限隔離を保証しない。実行ホストの通信・保存・メモリ/出力量制約を別途検証してから教材へ接続する。Node Workerのテスト用固定処理はブラウザーでの任意コード隔離証拠ではない。

## 第5章の実行ホスト/採点接続契約（2026-10-02）

先行controllerへ渡すホストを、allow-scriptsだけのopaque-origin iframeで生成するBlob Workerとする。iframeにはallow-same-origin/フォーム/ポップアップ/top-navigation権限を付けない。trusted frame bootstrapだけnonce許可し、default-src/connect-src none、worker-src blob、script-src nonce + unsafe-evalを設定する。unsafe-evalはWorker内の学習者関数コンパイルに必要で、親画面ではコードを評価しない。Blob WorkerへのCSP継承とorigin nullは実ブラウザーで検査する。利用できないブラウザーは失敗を表示し、同一オリジンWorkerへfallbackしない。

第5章はjs01/js02/js03を追加する（既存15IDとv1保存は維持）。js01は環境から渡すquantityを使い単価100のtotal、js02は環境から渡すscoresの60以上を集計するtotalを作る。js03はpriceAfterTax(price,rate)を定義する。教材の説明・例・開始コード・ヒントに環境提供値と戻り値を明示する。返り値がPromiseなら解決まで同じ時間上限内で待ち、3/4/3ケースを順次実行し、数値の型・有限性を確認、浮動小数点誤差1e-9以内で期待値比較する。文字列数値/NaN/Infinity/オブジェクトは合格しない。期待値は親で保持し、Workerへは入力とtrusted return式だけ渡す。

1回の採点は専用frame/Worker/port/blob URLを持ち、終了・停止・入力変更・教材/画面移動・初期化・2秒の計算上限で解放する。取消時はtrusted frameのterminate要求受付応答でframeを除去し、pagehideでも停止する。応答は実際のnative Worker終了保証ではない。停止応答が届かない場合は最大1秒の解放待機後にframeを除去する（計算上限と解放待機は別）。実ブラウザーで最終的なWorker target消失とCPU idleを別途確認する。Workerからframeへの結果にはランダム128bit capabilityを付け、学習者の素のpostMessageを結果として扱わない。別runの遅延応答はcontrollerの相関IDと専用portで破棄する。Worker生成APIと標準consoleを学習者へ公開せず、追加worker/共有workerと大量logを抑える。CSPとopaque originが通信/保存の主境界で、API隠蔽は補助である。

コード上限32KiB、採点ケース上限16、返却値はプリミティブを型タグ化し文字列160文字まで。Workerから未検査オブジェクトを親へ転送せず、親の出力はtextContentで表示する。DOM/親localStorage/IndexedDB/CacheStorage、fetch/WebSocket/importScripts、追加Worker、偽結果/HTML文字列、無限ループ/非同期後出しを実ブラウザーで検査する。Chromium151/148の実測ではbusy Workerはterminate要求から約3秒の遅延を経て計算が止まる。2秒の結果期限と取消応答を延ばさず、ホストは同時枠1つ・待ち行列なしとし、frame解放後5秒は枠を予約してAPI再実行を拒否、画面の再実行を無効化する。これは観測に基づく作成頻度/停止待ちbacklogの制約であり、あらゆるブラウザーで5秒以内のnative終了を保証しない。再読込によるJS実行環境の再作成も含むOS級資源上限ではない。Worker終了で計算は止められるが、ブラウザーには信頼できるWorker単位の硬いメモリ割当上限がない。任意の大量確保に対するOS級sandboxを保証しない。認証/秘密情報を実行ホストへ渡さず、Safari等の未検証環境は証拠を区別する。

既存演習レイアウトを維持し、JavaScriptではHTMLプレビューを隠して型/実際値/期待値と修正ヒントを表示する。「コードを実行」と「停止」を既存editor footerへ置く。表示や入力だけでは実行しない。実行中だけ停止を表示し、取消は不合格/完了扱いにせず入力を保持する。旧HTML/CSSのプレビュー・採点を維持する。

## 第6章のDOM/イベント境界・先行チェックポイント（2026-10-02）

本チェックポイントは教材/UIへ接続する前の独立ブリッジに限定する。第6章3教材はDOM更新、クリックイベント、入力値の順に設計予定だが、この段階では追加/完了扱いにしない（18/24、75%を維持）。新しいTaskやUI方向性は追加しない。

学習者コードは第5章同様、opaque-origin iframeが作る専用Blob Workerだけで評価する。DOMはtrusted frameが所有する実ブラウザーDOMであり、Workerへ公開するdocumentは限定APIのブリッジである。フルDOMやjsdomではない。document.querySelectorは教材指定の最大8個のID selectorだけを扱い、未登録IDはnull、ID以外のselector/未対応propertyはTypeErrorで拒否する。要素のtextContent/valueの読み書き（文字列/数値/booleanを文字列化、null/undefined/オブジェクトは拒否、160 UTF-16 code unitsで切り詰める）、addEventListenerのclick/inputだけを扱う（function callbackのみ、options/capture/once/removeEventListenerは未対応で拒否）。同じtype/callbackの重複登録は無視し、登録順にthis/currentTarget/targetを対象要素へ設定して呼ぶ。実行中に登録したlistenerは次イベントから呼ぶ。currentTargetはdispatch完了/失敗後nullへ戻す。例外は採点実行全体を失敗させ、後続callbackを実行しない（native DOMの例外継続とは異なる）。Event.target/currentTargetは同じ限定要素、typeはnativeイベントの種別。バブリング/キャンセル/default action/Trusted UI pointerは教える対象外。native Promiseを返す非同期handlerは教材の決定的採点のため登録順に完了を待ち（任意thenable/その他の戻り値は無視）、その間currentTargetを保持する（native DOMはPromiseを待たない）。同期callbackではmicrotaskを挟まずdispatchし、currentTargetを解除する。innerHTML、style、任意selector、DOM作成、親window、ブラウザー保存は提供しない。setterはWorkerのlocal cacheへ要求文字列を即時反映し、実DOMでのvalue正規化は次イベントの状態同期/採点snapshotで反映する。同期のブラウザーDOM getter全般は保証しない。通常DOMとの違いと対応APIを教材に明記してから接続する。

fixtureの指定要素は一意ID・初期値160 code units以内・互いに祖先/子孫にならないことを要求する。clickステップは有効なtype=buttonのbutton、inputステップは編集可能なtype=text input/textareaだけを対象とし、disabled/fieldset無効化/inert/readonly操作を拒否する。trusted fixture/selector/最大16ステップは親から専用MessageChannelでframeへ渡し、frameがnative DOMへ配置する。クリックはnative element.click、入力はvalue設定とnative input Eventを使用する。Workerは文更新・イベント購読の許可コマンドだけ返し、frameが検査して適用する。初期化/各イベントの処理完了後にframeが実DOMからtextContent/valueをスナップショット化する。親が期待値と比較し、期待値や合否をWorkerへ送らない。Workerから返る任意の採点結果を信用しない。非同期handlerは同じ実行期限内で待つ。値は160文字、購読16件、操作256件、selector8個、ステップ16件、コード32KiB、fixture32KiBまで。命令やスナップショットにDOM/Functionオブジェクトを転送しない。

権限境界はallow-scriptsのみのiframe、nonce trusted bootstrap、default-src/connect-src none、worker-src blob、form-action/base-uri none。trusted HTMLだけを置き、学習者文字列はtextContent/valueで適用する。Worker/frameの通信にはclosure内の128bit capability、親/frameには専用portを用い、guestの偽postMessageを無視する。任意HTML文字列からscript/image/formを作らない。

第5章と共有するホスト枠は同時1・待ち行列なし。結果期限は既定2秒、停止・タイムアウト・入力変更/移動/リセットをAbortSignalで取り消す。frameはnative terminate要求応答で除去し、応答不能時1秒後に除去、frame解放後5秒は共有枠を予約する。結果期限と実Worker終了/CPU停止は別で、5秒は既存Chromium実測の余裕であり普遍的保証ではない。硬いメモリquota/ページ再読込を跨ぐ枠は保証しない。第5章のIDs、保存、期限、操作数以外の既存機能は変更しない。

受入: 実ブラウザーでnative要素とクリック/inputを使ったDOM結果、境界誤答・複数イベント・fresh reset、限定API、親DOM/保存/通信/追加Worker拒否・偽結果/HTML安全性、無限loop/非同期遅延/取消/rapid navigationと共有枠のbacklog制限、native Worker終了/CPU idle、既存第5章実ブラウザー回帰・controller/生成物同期を検証する。jsdom/staticテストは隔離証拠としない。未接続なので教材・通常アプリUIの第6章完成は宣言しない。

## 第6章の最初のDOM更新教材（2026-10-02）

既存UIへjs04の1教材だけを接続する。既存18ID/v1保存を維持し、受入前は75%のまま。js04「DOMの文字を更新する」は固定HTMLの#heading（h1）と#message（p）をquerySelectorで選び、textContentをそれぞれ「学習メモ」「DOMの文字を更新できました」へ変更する。HTMLは環境が用意し、学習者はJavaScriptだけ入力する。開始コードは対象取得のみ、完成例は二つのtextContent更新。id/selector/文字列の意味、nullの可能性、textContentがHTMLを解釈しないことを説明する。

executionMode=domに限りparent graderを使う。初期状態と実行後状態をtrusted frame snapshotで比較する既存ブリッジを使用し、Workerの合否報告を採用しない。この教材はイベントステップなし、実行後のh1/pの文字列2件が採点条件。初期・入力変更・reset・取消・エラーでは固定HTMLへ戻し、採点結果が現在コードと一致するときだけ採点snapshotの実際値を表示する。

表示用iframeは既存sandbox空/通信禁止のまま、trusted fixtureを親のdetached DOMで解析し、親が検証した結果文字列をtextContentへ適用してserializeする。学習者コード/HTMLは評価・挿入しない。DOM表示180px以上と結果内訳を既存preview領域へ並べ、js01〜03の数値出力はそのまま維持する。教材に固定HTMLと限定API・nativeとの差を説明し、Workerで使用可能なAPIをfull DOMとして教えない。click/input/保存は後続教材とし、この1教材では提供しない。

実UIはコード実行/完了条件ボタン、Ctrl/Command+Enter、停止、入力変更、reset、教材/画面/hash移動、エラーと復元を確認する。実行枠1/5秒予約/2秒期限/32KiB等は先行契約を維持。取消/エラーから古い結果を保存せず、完了履歴と試行数は既存ルールを維持する。第6章の進捗は完了1/計画3を表示し、未実装2教材を完了/受講可能扱いにしない。講座全体は実教材受入後19/24=79%へ更新する。最終教材末尾は章進捗へ戻り、次教材を自動作成しない。

受入: js04例/開始/誤答・偽合否・HTML-looking出力、native DOM結果からのscriptなし表示、3幅の実UI通し/横溢れ、停止/timeout/error/reset/input cancel/rapid navigationと旧結果破棄、reload/旧v1追加/保存拒否、既存19教材回帰、controller/境界/生成物同期、固定SHA独立レビュー。教材のAPI説明もレビュー対象とする。


### 第6章 js05 クリックイベント教材

既存DOM境界/表示UIのままjs05を追加する。#add(type=button)と#count(p)を使い、変数count=0を作ってaddEventListener("click", callback)で1ずつ加算しtextContentへ表示する。実行開始時0、native clickを3回発生させた各snapshot1/2/3を親で採点する。登録時にcallbackを呼ぶ誤り、固定値、二重加算、未登録を拒否する。ボタンは採点環境が自動操作し、表示iframeはスクリプトなしの最終結果確認用であり手動クリックで実行されない。

限定API/nativeとの違いはjs04の説明に加え、click/input function listenerのみ、options/removeEventListener/バブリング不可、handler例外で実行全体失敗、native Promiseを返すhandlerを順に待つことを明記する。既存ID/v1・共有枠/停止予約・2秒期限・CSPは維持し、変更しない。js04と第5章の既存証拠は保存する。受入は初期値/3イベントの意味誤答、3幅の実UI保存/復元/停止/timeout/エラー/初期化/入力変更/教材移動、全20教材回帰、controller/生成物同期と固定SHA独立レビュー。受入前は19/24=79%、完了後20/24=83%とし、Chapter6予定3を分母にする。


### 第6章 js06 入力イベント教材

既存境界契約内で#name(type=text input)と独立#message(p)を使う。初期入力空/表示未入力、native inputで太郎→空→次郎を設定し、各回のvalueと表示「こんにちは、太郎さん」→「未入力」→「こんにちは、次郎さん」を親で採点する。event.target.valueで現在の入力を読み、空文字の条件分岐とtextContentを教える。固定値・clickのみ・初回だけ・消去未対応・textContentから値を読む誤りを拒否する。採点が自動入力し、結果iframeは手入力してもhandlerが動かない静的確認用と明記する。

表示のvalueはDOMParserのlive propertyだけではserializeに残らないため、inputはvalue属性、textareaは文字内容へ検証済み文字列を反映する。trusted fixtureと親のsnapshot文字列だけを扱い、scriptなしsandbox/CSP/文字列encodingを維持する。通常DOM全体/バブリング/async native挙動等の未対応を追加しない。受入は3幅実UI/各入力snapshot/入力消去/復元（最終input value含む）/停止/処理中取消/移動/エラー/期限後retry、旧js03/js04/js05履歴、全21教材回帰、controller/生成物同期、固定SHA独立レビュー。受入前20/24=83%、完了後21/24=88%、第6章3/3=100%。第7章保存などは未実装。
