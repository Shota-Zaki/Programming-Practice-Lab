# DESIGN.md

## 2026-10-03 project01 — 設計と構造の教材接続

案Aと既存3ファイルworkspaceを使う。project01だけ教材・開始例・完成例・ヒントを正式登録し、scriptなしの静的構造採点で完了履歴を得る。project02/03は予定として表示し、native動作・保存・成果物実行の合格を有効にしない。

既存workspaceの入力は保持する。新規・明示初期化時だけproject01の未完成HTMLを使い、CSS/JSも同じ3ファイルとして編集/exportする。教材表示と編集を同じ画面に置き、コード例は折りたたみで参照する。教材の主見出し、説明、条件、ヒント、現在結果、完了履歴を区別する。

project01の進捗は専用key `ppl.foundation.project01.progress.v1` に保存し、旧21教材のv1 schemaへ3ファイルを詰め込まない。構造結果は現在snapshotにだけ表示し、編集/初期化/取消/移動で未確認へ戻す。完了履歴は維持するが現コードの合格を装わない。破損進捗は自動上書きせず、確認付き当該教材履歴初期化で回復可能。講座分母24・第7章分母3を維持する。

採点はtrusted parserのopaque iframeで文書・main内の構造・ID一意性・labelとselect・option・表示p・button type・相対CSS/JS参照・禁止resourceを確認する。学習者JSを評価しない。静的表示コピーを使い、375/768/1280の各幅で必須要素の表示、選択欄/ボタンへのTab到達を確認する。これをnativeイベント/localStorage動作の証拠にしない。採点/保存の失敗は入力を保持し、現結果は未確認にする。

新しいruntime/権限/通信transportを追加しない。既存sandbox、2秒期限、export snapshot/hash契約、旧21教材を維持する。Windows専用checkoutで局所テストと旧教材回帰を実施し、固定commitを独立レビューする。work反映には親の最新ポリシー再確認を必要とする。

独立レビューで見つかった表示コピーの意味差を補正する。html/bodyのclass/idとhidden/inert/open等、fieldsetの実効無効化、閉じたdetails/dialogを保持して表示を測る。操作欄の明示tabindexは不合格。表示できない未対応wrapperをflattenした結果では合格させない。learner script/event/resourceは引き続きコピーしない。専用環境の権限や通信条件は変更しない。

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


## 第7章保存契約 — 設計チェックポイント（2026-10-02）

最新採択: ownerは2026-10-03に案A（標準localStorage、同じ学習者コードを成果物で使用）を承認。以下のA/B未採択・codec候補は当時の履歴であり、案B/facade実装の承認として使わない。具体的な3教材、編集/export、専用origin/profile、native実行成立条件は[第7章案Aの実装設計](design/chapter7-native-export.md)を参照。既存opaque iframe/Workerの保存権限を変えず、実教材受入21/24=88%を維持する。

### 既存要件と今回の範囲

根拠は本書「初期リリースの中心」の学習内容14ブラウザ保存/15ミニ成果物、7章24教材/1ミニ成果物、およびsrc/static/index.htmlの第7章MINI PROJECT/3 LESSONS「自己紹介サイトを完成させる」「設計、実装、確認、公開用ビルド」。最後の3教材はミニ成果物として維持し、保存API3教材へ置き換えない。js07〜js09などのID/個別教材構成は未確定。公開用ビルドは生成物の確認であり、この作業で公開する承認ではない。

今回の完了単位は保存の設計だけ。pure record codecは将来案に限り、定義済みconsumerがないため実装しない。現在21/24=88%を維持する。教材、learner API、実保存backend、UI、sandbox/Worker/共有枠、既存v1進捗、ユーザーの保存データへ接続しない。codecは信頼された親側の将来部品であり、native Storageのpolyfillではない。

### native APIの事実と今回の制約

native localStorageはWindowに公開された同期の文字列Storage。取得時のorigin/policy拒否、書込時のquota失敗を区別する。setItem一回の失敗はその更新を反映しないが、複数操作のtransactionや任意コードの取消によるrollbackはない。成功済み書込はその後の例外/停止で消えない。same-originの他画面と共有し、複数画面間のlockは保証されない。保存は再読込を跨ぐが、削除/設定/ブラウザーの保持方針で失われ得る。Workerのnative localStorageは提供されず、opaque frameはnative getterで拒否される。

[HTML Standard Web storage](https://html.spec.whatwg.org/multipage/webstorage.html#the-storage-interface)、[localStorage getter](https://html.spec.whatwg.org/multipage/webstorage.html#the-localstorage-attribute)、[MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)。IndexedDBは非同期request/transactionであり、localStorageの同期get/setと同じAPI・取消契約ではない。[Indexed Database API](https://w3c.github.io/IndexedDB/)参照。今回IndexedDB migrationは行わない。

### 教材方針の案と決定境界

**A native API中心**: native localStorageの説明/コードを最終成果物へ使う。同じコードを現Workerで実行できるとは説明しない。trusted固定コードのnative観察と、成果物の適切なoriginでの実行を区別する。任意コードを親/same-origin frameや同一権限Workerで評価する方法は採用不可。成果物export/local実行のUX・組合せHTML/CSS/JS検証が別途必要。file URL上の永続性を保証せず、適切なHTTP originでの検証を設計する。

**B 演習専用API中心**: 独自名lessonStore等のPromise APIを教材に明示し、native localStorageとの違いを表にする。getを同期に見せる、保存snapshotをlocalStorageという名前で偽装する、async commitを同期setItemの成功として扱うことは不可。成果物でも専用runtimeが必要になり、nativeコードのコピー再利用とは異なる。

A/Bは学習者が書くAPIとミニ成果物の持ち出し方を変えるproduct決定。既存要件だけからBをnativeAPIと等価として選ばない。選択前にlearner facade/教材/新しい永続書込を接続しない。共通codecの形状/限度は工学上の候補として整理できるが、既存要件への直接の追跡と具体的consumerが確定するまでコードにしない。今回UI方針は既存を維持し、新案のUIを実装しない。

### 非同期案Bを採る場合の提案契約（未採択・未実装）

- 親が教材を登録し、lessonId/許可key/保存namespaceを固定する。learnerはlogical key/valueのみを渡し、任意origin key、progressキー、保存オブジェクト自体を受け取れない。clearは当該教材の論理レコードだけ。native localStorage.clearは呼ばない。
- get/set/removeはPromise。strict stringのみでnative DOMStringの自動変換を真似しない。各set/removeのackは親による当該レコードのnative書込成功後。先行処理一つ、待ち行列なし、未awaitの競合操作は明示拒否。native quota/policy errorをfake成功・メモリ保存成功へ変換しない。
- 取消/入力変更/移動/期限で親のrun generationを無効化し、後着要求を拒否する。取消前にcommit済みの操作は残る。二つのsetの間で取消なら最初のみ残るpartial writeを教材で説明する。取消はデータrollbackではない。親の同期書込とcancel処理の実行順でcommit境界が決まり、遅延ackで成功表示を復活させない。
- 順次awaitでread-after-writeを確認する。同一教材のnamespaceを再読込時にloadし、別教材は別namespace。採点はknown fixtureのvolatile backendで行い、通常操作のpersist backendと区別する。ユーザーの保存内容を採点の期待値/初期化で上書きしない。実reloadは新しいrunなので既存snapshotを信用せず再load。
- 同じ教材の複数タブはnative backend上でlast writerが勝つことがある。optimistic conflict検知は原子的lockではなく、完全な競合解決を保証しない。保存操作数上限16/run、既存公開2秒期限、同時実行1/解放後5秒予約を維持する案だが、facade wiringとnative検証を終えるまで対応機能と宣言しない。

### 共通codec候補（consumer未確定・未採択）

将来codecを実装するなら独立moduleとし、既存画面/Workerからimportしない。外部権限/依存なし。`createLessonStorageCodec({lessonId,allowedKeys})`はtrusted設定だけを受け取る。lessonIdは英小文字開始の英数/ハイフン最大64文字。許可keyは最大8個、一意・空でない文字列、最大64 UTF-16単位。設定をコピーし、logical keyが__proto__でも連想objectのprototypeを変えないarray/Mapで扱う。

保存key候補はppl.lesson-record.v1.<lessonId>。v1進捗/旧入力/viewとprefixが異なる。許可済みlessonIdの登録・実際の保存先へのアクセスは将来のtrusted adapterの責任であり、codec単独を権限境界として扱わない。storageKey案は文書上の候補のみで、今回計算するコードもread/write/deleteも作らない。

recordは厳密に{version:1,lessonId,entries:[[key,value],...]}。encodeは許可された一意のkeyとstring valueのみを受け取り、deterministicに許可key順へ正規化する。valueは最大1024 UTF-16単位、record全体はJSON metadata/escapeも含めて最大4096 UTF-8 bytes。8key/64/1024/4096は初学者の短いプロフィール用の工学上限で、nativeブラウザーquotaではない。切捨て・Stringによる暗黙変換・fake quota成功をしない。

decode(null)はmissing。JSONの文字列null、壊れたJSON、型違い、version違い、lesson違い、未知field、未知key、重複keyはcorrupt。長さ/bytes/件数超過はover-limit。厳密なplain schema以外を復元しない。okだけが凍結済みコピーentriesを返す。入力を消す・修復する・空recordを自動保存する処理は持たない。storage getterが拒否された場合のunavailableはcodecでnullへ置換せず、将来adapterが別statusとして扱う。

parse前にraw文字数とUTF-8 bytesを制限し、既存保存/他lesson recordを受け入れない。短いinputでもescaped JSONはquotaを超え得るのでserialized bytesを測る。import自体に保存/起動/移行のside effectを持たせない。

### reload、corruption、拒否と回復の今後の受入

native書込済みrecordのreload/再open、別lesson/keyとprogressの不変、許可namespaceのみのremoveをnative browserで検証する。missing/corrupt/over-limit/unavailable/QuotaExceededを別状態として表示し、破損rawは明示した当該lessonリセット操作まで保持する。自動削除・silent overwrite・バックエンド切替で永続成功を装うことは不可。permission拒否時は作業コードの既存保存拒否表示と区別し、教材データ保存未成功を伝える。実ユーザーstorage移行は別作業。

今回codecはこれらを実行しない。pure schema検証のPASSをnative persistence、cancel race、quota、UI受入のPASSとして扱わない。真のnative quota値/総origin使用量/ストレージ消去/別タブ競合・Safari/Pagesの挙動は別検証。

### A/B比較とowner choice前に進められる範囲

| 観点 | A native API中心 | B 独自async API中心 |
| --- | --- | --- |
| 学習者コード | native getItem/setItemを成果物で使える。現Workerで同じ任意コードを評価できない | 専用Promise APIを明示。native同期Storageをそのまま書く教材ではない |
| 教育上の差 | native APIと実行環境の関係を直接学ぶ。export/local UXが必要 | 隔離した現画面で反復しやすいが、API差とpartial writesを別途教える |
| 完成サイトへの再利用 | nativeコードを適切なoriginで実行。file URLの永続性は保証しない | 専用runtimeを同梱するかnativeコードへ書換えが必要。教材コード単独では完成サイトにならない |
| 保存・取消 | native成功済み操作は残る。停止によるrollbackなし | Promise ack/親commit境界を設計し、成功済み操作は残る。同期APIを偽装しない |
| 必要な新規設計 | HTML/CSS/JSの組合せ・export・実行手順・native動作の受入 | facade capability/operation protocol/永続backend/専用runtimeとUI受入 |
| 既存sandbox | 同一origin権限を渡さない。native任意実行を現previewへ追加しない | 同一origin権限を渡さず、許可されたlogical record操作だけを仲介する |

選択前に行えるのは既存要件の追跡、native事実の確認、A/B比較、工程/受入の整理、既存21教材の独立した不具合修正。採択前に書込backend/facade/レッスンID/完成サイトruntimeを決めない。codec案にもまだ具体的consumerがないため実装しない。第7章はmini-projectとして維持し、保存専用3教材へ改変しない。

### チェックポイントの受入

1. 既存capstone要件、native/custom API差と未採択案を記録する。
2. 固定SHA独立設計レビューで、owner choiceと実装保留範囲を明確にする。
3. runtime/UI/v1保存/既存21教材と旧evidenceが不変である証拠、生成物同期を保存する。
4. task-list/NEXT/evidenceを更新し、講座88%を維持する。

実native persistence、codec、facade/run取消/partialwrite、UI、教材、ミニ成果物/公開用ビルドの受入は未実装・未検証。今回native挙動の根拠は上記規格であり、新しいbrowser実測は行わない。

## project02 CSS先行教材（2026-10-03）

承認済み案Aの見た目を独立教材として提供する。workspace内の通常ボタンでproject01/project02 CSSを選び、入力は共有・切替時不変。選択は画面内のみで再読込時project01へ戻る。3ファイル初期化は常にproject01開始コードで、確認文にも明記する。例は手動でコピーできるコードとして表示する。

静的コピーを375/768/1280pxで測定する。project01構造の10条件に加え、body左右余白16px以上、main左右内余白24px以上・幅720px以下・中央配置、本文と操作欄16px以上・本文/ボタン行高1.5倍以上（native selectの行高/切抜きはブラウザー管理）、操作欄の外寸高さ44px以上、文書/カード/本文の横溢れと非表示切抜きを確認する。値は計算済み寸法で判定しCSS記法を指定しない。native動作やlocalStorageは実行しない。CSS結果をproject01履歴へ書かず、project02完了も作らない。22/24=92%維持。

独立レビューの誤合格を受け、主見出しと必須内容の全親要素も測定する。外側余白はmainの実位置でも確認する。clip-path/legacy clip/mask/filterやoverflowによる切抜きを使わない条件を明示し、単色背景との文字の明暗比4.5以上を追加した（CSS6条件、構造と合わせ16条件）。標準CSSの計算済み色を1px swatchで読み、透明色を合成して明暗比を計算するだけで学習者HTMLをrasterize/実行しない。背景画像/gradient・opacity変更・blendはこの先行教材の採点外として拒否する。native selectの行高/overflowはブラウザー管理だが文字色・文字サイズ・外寸は確認する。長い本文の縦スクロールは許容する。Tab/labelの操作と完成例のfocus表示は実UIで確認し、任意CSSのfocus表示やアクセシビリティ全体の自動保証はしない。

再レビューの画面上方への退避・負text-indentの誤合格も修正した。必須内容の下端がページ上端より下にあり、text-indentが非負であることを確認する。長い通常本文が900pxより下へ続くことは拒否しない。小さな正のrelative offsetも許容する。
