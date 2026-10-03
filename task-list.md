# Programming Practice Lab Task List

## Metadata

- currentTask: `PPL-FOUNDATION-001`
- currentPhase: `Web開発基礎講座`
- currentStatus: `in_progress`
- completionPercentage: `92%`（講座全体24レッスン中22レッスン実装・検証済み。旧21教材と第7章project01の静的構造受入完了。project02/03のnative受入は未完了）
- baseBranch: `main`
- workBranch: `work`
- pagesSource: `main/docs`
- selectedDesign: `foundation-first + project-based`
- updatedAt: `2026-10-03`

## CORE 共通採点adapter — 現在の独立実装単位

状態: ローカル受入完了・次公開gate保留（5/5=100%）。Foundationへ統合したPPL-CORE-001のinterface工程。講座22/24=92%維持、教材数/native受入へ加算しない。

- [x] trusted登録/要求/envelope/行の共通契約を定義し、4方式を実UIへ接続する。
- [x] 不正登録/要求/結果と取消/遅延/同コード再実行をunitで検証する。
- [x] 旧v1/単体入力/不整合result/破損/保存拒否、中断/繰返しを3幅の実UIで確認する。
- [x] 旧21教材/実行controller/workspace、生成物同期を検証する。
- [x] 固定候補の独立レビュー・証拠/正本管理文書を完了する。

検証Product ed50f3f8827ed353c87a64d5b7c49f6746b706ac: 38unit（adapter10）、adapter実UI3幅/不整合結果拒否/同コード遅延結果破棄、旧21×3幅/旧v1・単体入力・破損・保存拒否、workspace35/download30、project03 9/download15/遅延6race、verify:agent PASS。独立exactレビュー阻害なし。Evidence: evidence/2026-10-03-grading-adapter/REPORT.md。独立観測はmobile/CSS/保存拒否、全3幅と旧21回帰は実装agentによる別証拠。

設計: design/common-grading-adapter.md。旧21の教材/判定grader/progress.jsを変更せず、登録をコピー/凍結し要求/結果を相関確認する。envelope/runIdはv1へ保存せず、保存形式/進捗は移行しない。IndexedDB/教材全体共通形式は別ACで未実装。Worker1枠/2秒/5秒予約、既存sandbox/network/storage境界、第7章native技術gateを維持する。

前工程project03の独立レビュー済み89b1274b8c4583e97e2df91077e1d7f2694740f1/tree272044be0bbd4fa22051772aee36f84d0ddf9335は親policy13:06:41UTC r8/selection6/applied6と通常push許可後にremote親3f9fc9e/Pages legacy main/docs/work workflowなし/rulesetsなしを再確認してworkへ通常push。connected GitHubのSHA/tree読取一致。required CIなし（PASS扱いしない）。次候補公開は親の新policy/remote/trigger gate待ち。

Active: Foundation/CORE adapter。Ready: 既存4方式の共通契約。Planned: 共通教材形式/IndexedDBと残native動作/成果物。Blocked: native専用環境/信頼できる結果transport。Deferred: 実Pages/Safari/手動読み上げ/実践UI。別Task未設定。

## 第7章 project03 ファイル照合 — 受入・work反映済み（前工程記録）

状態: 受入・work反映済み（5/5=100%）。講座22/24=92%維持。project03全体/nativeの受入に加算しない。

- [x] 成果物/manifestの説明・例・手順・ヒントと第3教材への到達を提供する。
- [x] 選択した固定ファイルのbounded UTF-8/schema/bytes/hash照合と現在の編集snapshot比較を読み取り専用で実装する。
- [x] 編集/再選択/取消/切替/移動/初期化/期限/例外で現結果と遅延完了を破棄し、入力/履歴を保持する。
- [x] Unitの意味誤答・実ダウンロード再選択照合・3幅の実UI・旧教材/workspace保存/境界の影響を検証する。
- [x] 固定候補の独立レビュー・生成物同期・証拠/管理文書を完了する。

前工程CSS候補3f9fc9e22a0cfa323899eefed0652e4424a84544/tree b6c584b390951ea8f2e5440b0e32ec4c29d5e11dは親policy12:28:18UTC revision8/selection6/applied6と公開許可後に、remote親d930/Pages main/docs/work workflowなし/rulesetsなしを再確認し通常push。connected GitHub読取一致、required CIなし（PASS扱いしない）。この前工程の公開gateは解消し89b1274bを通常work反映済み。現在の次候補は冒頭CORE節を参照。

Product 9150c6db9a91cd14b558833917df3bbea8003ff7: 28unit、project03 3幅/実download15/9ケース/遅延6race、CSS32誤答、project01 40誤答、workspace35/download30、旧21×3幅、verify:agent PASS。独立exactレビュー阻害なし。Evidence: evidence/2026-10-03-project03-export/REPORT.md。ファイル内容照合はproject03全体の受入ではない。native技術gateはREPORT/DESIGN記載のOS級隔離・資源停止・専用origin/profile・信頼できる結果transport。

後続の承認済みCORE共通adapter interfaceを確認: 4既存graderを統一dispatchし未知/native modeを実行前拒否する独立単位は権限追加なしで実装可能。当時はread-only調査のみ。後続adapter実装受入は冒頭のCORE節を参照。Active: Foundation。Ready: 現CORE候補のguarded通常work反映。Planned: 残りnative動作・成果物実行、共通形式、IndexedDB。Blocked: 専用native環境/transport。Deferred: 実Pages/Safari/読み上げ/実践UI。別Task未設定。

## 第7章 project02 CSS — 受入・work反映済み（前工程記録）

状態: 受入・work反映済み（5/5=100%）。全体22/24=92%を維持。

- [x] CSSの説明・開始例・完成例・ヒントと入力を保持する教材切替を提供する。
- [x] 3幅の実寸で余白/カード/文字色・明暗比/操作欄/横溢れを静的確認する。
- [x] CSS確認はproject01履歴/旧21履歴を更新せず、nativeとproject02全体完了を無効に保つ。
- [x] 実UI3幅・意味誤答・同値CSS・取消/編集/切替/再読込/初期化・保存faultと影響範囲を検証する。
- [x] 生成物同期・固定候補の独立レビュー・証拠・管理文書を完了する。

project01通常work反映済み: remote SHA d9307c29f7724f524f45979f4f7a49c5dfbfa7b7、tree dd3991f621580128196b2053aa044ad3de0fed63。親policy revision8/selection6/applied6再確認とremote/trigger確認後に通常pushし読取一致。Pagesはmain/docs、work workflowなし、required CIなし（PASS扱いしない）。次候補の公開は親の再確認待ち。

Product 352fa9d476a571509fbfec568d681adbaf8c3445: 21unit、CSS3幅/32誤答/5同値、project01回帰40誤答、workspace35/実download30、旧21×3幅、verify:agent PASS。初期/再レビュー指摘を解消し固定候補の独立再現に阻害なし。Evidence: evidence/2026-10-03-project02-css/REPORT.md。CSS条件のみの先行単位5/5=100%、project02全体/nativeは未完了。この前工程の公開gateは解消し3f9fc9eを通常work反映済み。現在工程は上のproject03節。

## 第7章 project01 — 受入済みの独立実装単位（前工程記録）

状態: `ローカル受入完了・親への候補受渡し`（7/7=`100%`）。承認済み案Aに沿い、自己紹介サイトの設計と構造だけを登録・受入した。project02/03のnative動作/保存/結果transportは無効のまま。既存workspace入力は保持し、新規/明示初期化時に未完成HTMLを使う。

- [x] 教材の目標・説明・3ファイル開始例/構造完成例・ヒントを登録し、講座から到達可能にする。
- [x] 静的HTML構造・操作欄・相対参照をopaque trusted parserで採点し、375/768/1280の表示を集約する。
- [x] 専用進捗key、完了履歴と現snapshotの結果の区別、24/3の分母、旧21ID/v1不変を実装する。
- [x] 開始例不合格/完成例合格/意味誤答、3幅の実UI・Tab/label・編集/移動/初期化/取消/保存復元/保存拒否を検証する。
- [x] learner JS未評価、scriptなしsandbox、禁止resource/通信、export同一bytes/hashと取消、旧workspaceの復元を回帰確認する。
- [x] 旧21教材、実行controller、生成物同期、npm run verify:agentを確認し、証拠を保存する。
- [x] 固定SHA独立レビュー・指摘解消・管理文書を完了し、候補を親へ渡す。guarded work反映は親のポリシー再確認後の別工程。

講座実装受入は22/24（92%）。検証/独立レビュー対象productは`7fa8c0a1af448328c4178204142ee5d460945e02`。21unit/controller、project01 3幅/40意味誤答/同値fieldset、workspace35観測/実download30、旧21教材×3幅、verify:agent PASS。独立レビューの親要素非表示/fieldset実効無効化/閉じたdetails/Tab順/属性消失の指摘を解消し、修正SHAの独立再現は阻害なし。Evidence: `evidence/2026-10-03-project01/REPORT.md`、`review.md`、hash manifest。最終証拠checkpointではsrc/docs/testsを変更しない。Windowsタスク専用checkoutのworkにローカルcommit済み。リポジトリ内`.agents/skills`は存在せず、AGENTS.md/VERIFY_AGENT.mdを適用した。main merge/公開/サービス再起動/設定変更/永続アクセス追加なし。この前工程の保留は解消し、親の最新policy/remote/trigger確認後にd9307c29を通常push・remote照合済み。Active: PPL-FOUNDATION-001。Ready: レビュー済み候補の親受渡し/guarded work反映。Planned: project02/03、共通形式/adapter/IndexedDB。Blocked: native実行専用環境・結果transport。Deferred: 実Pages/Safari/読み上げ/基礎講座後実践UI。別Task未設定。

## PPL-INIT-001 GitHub Pages公開基盤

状態: `完了`

## PPL-DESIGN-001 UI方向性の比較・選定

状態: `完了`

決定:
- 方向C「プロジェクト型」を採用した。
- 2026-08-06の追加決定で、基礎講座を実践プロジェクトより先に置く構成へ変更した。

## PPL-APP-001 プロジェクト型正式UI初期実装

状態: `完了`

## PPL-APP-002 主要画面一式の設計拡張

状態: `完了`

実装済み:
- ホーム
- プロジェクト一覧
- プロジェクト詳細
- 学習工程
- 教材
- 演習
- 演習結果
- 復習
- 学習履歴
- 開発環境

既存の画面一式は`project-preview.html`へ保存し、基礎講座完了後の実践UIとして参照可能にする。

## PPL-FOUNDATION-001 Web開発基礎講座

状態: `進行中`

### 目的

HTML・CSS・JavaScriptを、教材を読むだけでなく実際に入力・表示・修正しながら学べる最初の完成講座を作る。

### 初期カリキュラム

- [x] Web開発基礎を最初の受講講座として設計する。
- [x] HTML → CSS → JavaScriptの順序を定義する。
- [x] 基礎講座一覧画面を追加する。
- [x] Web開発基礎の詳細画面を追加する。
- [x] HTML第1レッスンの教材画面を追加する。
- [x] HTML入力演習のUIを追加する。
- [x] sandbox付きiframeプレビューを追加する。
- [x] title、h1、pの条件判定を追加する。
- [x] 入力コードを端末へ保存する。
- [x] 既存の実践プロジェクトUIを別ページへ退避する。
- [x] 教材データを画面HTMLから分離する。
- [x] HTML第1章の4レッスンを教材データとして作成する。
- [x] レッスン完了状態と章進捗を保存する。
- [x] 入力演習の試行回数と結果を保存する。
- [x] 再読込後に教材位置と演習状態を復元する。
- [x] HTML第1章の通し検証を行う。
- [x] 375px、768px、1280pxで操作監査を行う。

### HTML第2章の受入条件

- [x] 意味のある構造、リスト・リンク・画像、フォームの3教材を設計する。
- [x] 説明・例・開始コード・採点・ヒントを3教材に提供する。
- [x] DOMの親子関係、リンク先、alt、labelと入力欄の対応を採点する。
- [x] 章移動と章別進捗、講座進捗を表示する。
- [x] 第1章のIDとv1保存データを維持し、第2章の入力・結果を復元する。
- [x] 全7教材を375/768/1280pxで操作・採点・再読込確認する。
- [x] 誤答22ケース、sandbox維持、画像表示、生成物同期を検証する。

### CSS第3章の受入条件

- [x] 選択子・色と文字・余白・ボックスモデルの4教材を設計する。
- [x] CSS専用入力、固定HTML、教材の説明・例・ヒントを提供する。
- [x] 計算済みスタイルと外寸を採点し、同値表現とcascadeを扱う。
- [x] 学習者CSSを隔離し、プレビュー権限・外部通信禁止を維持する。
- [x] 入力変更・教材移動・初期化で採点を取り消し、タイムアウト後に再試行できる。
- [x] 全11教材×3幅、HTML/CSS誤答、保存互換性を検証する。
- [x] 生成物を同期し、実画面とプレビューを確認する。

### CSS第4章の受入条件

- [x] Flexbox・Grid・メディアクエリ・組み合わせの4教材を設計する。
- [x] 説明・例・開始コード・ヒントと章移動を実装する。
- [x] 各幅の実配置・等幅・間隔・可視性・横溢れを採点し、全幅を集約する。
- [x] プレビュー幅を選び、枠内で横スクロールできる。
- [x] 599/600・899/900の境界、誤配置・非表示・固定幅の誤答を検証する。
- [x] 複数幅途中の取消・フレーム解放、全15教材×3幅と旧保存を検証する。
- [x] 生成物同期と実画面確認の証拠を保存する。

### JavaScript第5章の受入条件

- [x] 変数・条件/反復・関数の3教材を設計し、説明・例・開始コード・ヒント・意味採点を提供する。
- [x] opaque iframeのBlob Workerで評価し、親画面は評価せず、通信/保存/追加Worker/偽結果を検証する。
- [x] 2秒の結果期限、停止、遅延結果破棄、コード/ケース/出力制限を実装する。
- [x] 同時ホスト枠1・待ち行列なし・停止後5秒の予約と画面待機を実装し、連続Run/Cancel/Timeoutの追加実行128件を拒否、実Worker終了とCPU idleを検証する。
- [x] 3教材×3幅で入力/結果復元、停止、入力変更/移動取消、初期化、文字列HTMLの安全表示を確認する。
- [x] 全18教材×3幅、旧v1/旧単体入力/破損/保存拒否、既存HTML/CSS採点とプレビューを回帰検証する。
- [x] 生成物同期・独立固定SHAレビュー・実画面確認の証拠を保存する。

### JavaScript第6章の先行DOM/イベント境界

この先行境界受入は教材/UI接続前の独立基盤のみを対象とした。当時の講座完成度は18/24=75%。教材/通常UIの受入は以下のjs04〜js06と最新履歴を参照。

- [x] 対応APIとnative DOMとの違い、fixture/命令/出力制約、parent snapshot採点契約を定義する。
- [x] Workerからopaque iframeの実DOMへ限定命令を渡し、native click/inputを処理する。
- [x] 親DOM/保存/通信/追加Worker/偽メッセージを実ブラウザーで検証する。
- [x] callback重複/this/currentTarget/文字列encoding/誤答/新しいDOM初期化と未対応API拒否を確認する。
- [x] callback途中取消/期限/遅延継続/作成失敗/作成中取消と、共有枠の追加128実行拒否を確認する。
- [x] 第5章実ブラウザー回帰、固定SHA独立レビュー、生成物同期と証拠管理を完了する。
- [x] 第6章全3教材を通常UIへ接続する（js04/js05/js06受入完了）。

### 第6章 js04 DOM更新教材の受入条件

- [x] ID選択/textContent更新の説明・例・開始コード・限定API契約を提供する。
- [x] native DOM snapshotを親で採点し、未対応API/開始コードを拒否する。
- [x] learner文字列を安全表示し、偽メッセージ/禁止通信を確認する。
- [x] 3幅の実UIで停止・初期化・入力取消・教材移動・期限後再試行を受け入れる。
- [x] 同一成功コードの再実行停止で未確認表示/固定HTMLへ復帰し、履歴を保持する。
- [x] 旧v1/保存復元と予定3教材の進捗分母を維持し、全19教材回帰を通す。
- [x] 生成物同期、固定SHA独立レビュー、実画面確認と証拠を保存する。

### Web開発基礎の全体範囲

#### HTML
- 文書構造
- 見出しと文章
- リスト、リンク、画像
- 意味のある構造
- フォーム

#### CSS
- 選択子
- 色、文字、余白
- ボックスモデル
- Flexbox
- Grid
- レスポンシブ

#### JavaScript
- 変数
- 条件分岐
- 繰り返し
- 関数
- DOM
- イベント
- 入力値
- ブラウザ保存

## PPL-CORE-001 ブラウザ演習基盤

状態: `PPL-FOUNDATION-001へ統合`

基礎講座の実装に必要な範囲から段階的に構築する。

### 完了条件

- [ ] 教材データの共通形式を定義する。
- [x] 実行アダプターの共通インターフェースを定義する。（既存21教材のHTML/CSS/数値JavaScript/限定DOM共通採点adapter。nativeは未対応/開始前拒否）
- [x] JavaScript実行をWeb Workerへ分離する。（第5章数値処理と第6章限定DOM/event演習）
- [x] 実行時間上限と停止処理を実装する。（結果期限/停止要求とnative終了遅延を区別）
- [x] テスト結果を期待値、実際値、修正案に分けて表示する。
- [ ] IndexedDB保存へ移行する。
- [ ] GitHub Pagesで動作する。

## 次の行動

`PPL-FOUNDATION-001`は旧21教材とproject01静的構造の22/24教材受入済み（92%）。最新工程は冒頭のCORE共通採点adapter節（5/5=100%）。project01/CSS/project03照合はwork反映済み。CORE候補は親の次公開gate待ち。共通教材形式/IndexedDBは後続ACとして残り、native実行は専用環境/transport受入前には接続しない。第7章ミニ成果物3教材を維持する。別Task未設定。

### 第7章案A — 今回の設計受入条件

状態: `設計受入完了`（6/6=100%）。実教材受入数21/24=88%を維持する。

- [x] 承認済み案Aと既存mini-project3教材要件を追跡し、具体的な3教材・consumerを定義する。
- [x] 同じHTML/CSS/JSを持ち出すファイル形式、操作、取消・繰返し・復帰を定義する。
- [x] 専用origin/profile、保存寿命、削除、quota/破損/partial writesをnative仕様と整合させる。
- [x] 親アプリ・既存opaque frame/Workerの境界を維持し、local実行の通信・停止に関する成立条件と未成立箇所を明示する。
- [x] 編集/exportを先行できる順序と、native実行・採点・3教材受入の具体的検証条件を定義する。
- [x] src/docs/tests不変、verify同期PASS、固定SHA独立レビューと証拠を記録する。

実装受入は今回の設計受入と別。`DESIGN.md`の第7章案A節と`design/chapter7-native-export.md`へ実装契約を置き、Task状態・scope・ACの正本は本ファイルとする。

固定設計`e9ee4ae862102d6189f6bd4b5370df22d220df9e`を独立レビューし阻害指摘なし。Evidence: `evidence/2026-10-03-native-export-design/`。Active: PPL-FOUNDATION-001。Ready: 権限追加のない編集/静的確認/export。Planned: 残り3教材/正式共通形式/adapter/IndexedDB。Blocked: 任意native実行向け専用環境と信頼できる結果連携の受入。Deferred: 実Pages/Safari/読み上げ、基礎講座後の実践UI。別Task未設定。A/B選択は解消済みで再確認不要。native実装/受入は未実施。main merge/公開未実施。

### 第7章案A — 3教材全体の後続実装受入条件（project01単位の受入は冒頭）

以前の静的workspace工程のscopeは3ファイル編集・静的確認・exportまでで、当時project01/02/03の登録/合格連携は行わなかった。最新工程でproject01の静的構造だけを受入済み。以下は3教材全体の条件であり、project02/03/native実行・結果transportの未受入を引き続き示す。

#### 今回の静的workspace受入（作業前登録）

- [x] 独立3ファイルmodel/schema、専用保存key、復元/破損/保存拒否、旧v1不変をテストする。
- [x] 同一snapshotのUTF-8 bytes/manifest/hash/limits、Unicode/HTML風文字列/反復/非同期取消/errorをテストする。
- [x] 3タブ編集・静的構造確認・scriptなしプレビュー・明示native未対応・未完了を通常UIへ接続する。
- [x] reload/保存拒否/初期化確認/取消/移動・keyboard/mobile/3幅/禁止通信を実ブラウザーで検証する。
- [x] 既存21教材と実行controller・生成物同期を回帰確認する。
- [x] 固定SHA独立レビュー・証拠・管理文書・guarded work反映を完了する。

Product95f8604、NativeQA f42971f、旧21教材回帰c67e532。Evidence: `evidence/2026-10-03-project-workspace/REPORT.md`。17 unit/35 native/30実download/21教材×3幅/verify PASS。productと証跡checkpoint f483f0aの独立レビュー阻害なし。編集workspaceを実教材の合格として加算しない。静的workspace受入6/6（100%）。親の保留解除後、canonical/originの既知baselineとcleanを再確認し、レビュー済み5d2a52dをfast-forward/pushしremote readback一致を確認。native環境/結果transportは別Blockedのまま。Active: PPL-FOUNDATION-001。Ready: 3教材の正式登録に向けた教材設計・受入準備。Planned: 3教材の正式登録/受入、共通形式/adapter/IndexedDB。Blocked: native実行環境/結果transport。Deferred: 実Pages/Safari/読み上げ/実践UI。別Task未設定。canonical workへの反映・通常push済み。main merge/公開は未実施。

- [ ] 3教材の説明/開始例/完成例/ヒント、nativeと既存限定APIの差、project01/02/03の条件・計画分母を実装する。
- [ ] 3ファイル入力・タブ切替・保存/再読込・保存拒否・確認付き初期化・教材移動を375/768/1280で検証し、既存21ID/v1/完了履歴を回帰確認する。
- [ ] scriptなし静的プレビューで学習者HTML/JSを親やsame-originで評価せず、script/event/iframe/base/meta/import/resource・CSS通信・親保存への到達を負検証する。
- [ ] exportの同一snapshot/UTF-8 bytes/hash/相対参照、32KiB/96KiB境界、HTML風JS文字列、取消/途中保存/再export混在/manifest不一致、OS保存完了を装わない表示を確認する。
- [ ] 専用native環境の事前条件（通信拒否/ファイル・プロセス分離/資源上限/ブラウザーsandbox/秘密不在）を実際の環境で受け入れ、外部navigation/fetch/WebSocket/WebRTC/DNS/別loopback/新page/worker/download/permissionsを負検証する。成立前はruntimeを有効にしない。
- [ ] 専用origin/profileと固定bundleのみの配信、競合port/二重起動拒否、親・他project保存不変、同じコードのnativeWindow起動/初回/選択/再読込/正常再open/忘れるを実測する。frame/Worker/独自async APIで代用しない。
- [ ] native missing/不正value/SecurityError/QuotaExceededError、成功書込後の例外・停止、強制終了後の実値再読取、保存だけ削除/編集だけ初期化/再exportを区別して確認する。quota拒否の制御faultは実quota枯渇証拠と区別する。
- [ ] 無限初期処理/無限event/非同期遅延/大量出力・確保の停止、独立heartbeat/旧run結果拒否、プロセス群終了まで次run拒否、終了確認不能時fail closedを検証する。OS級保証をbrowser timerで代用しない。
- [ ] 外部controllerの実DOM/native保存観察とsnapshot/hashに対応した合否、偽結果/自己申告/別bundle/古いrun拒否、未実装runtime利用不可・no fallbackを確認し、3教材ごとの開始例不合格/完成例合格/意味誤答を検証する。
- [ ] 全24教材の実受入を終えるまで88%を一括100%にせず、教材ごとに受入数更新。verify/生成物同期・固定SHA独立レビュー・native証拠を保存する。Safari/実Pages/読み上げは未検証ならDeferredのまま、main/公開は別承認。

## Repository operation policy — 2026-09-01

- GitHub Actionsは使用しない。
- `work`へのcommit / push / scope内mergeは都度確認なしで実行可能。
- `main`へのmergeは必ず実行直前にユーザー確認を行う。
- READMEへ現在TaskやHEAD等のlive値を記録しない。
- **すべての作業で、このファイルと`NEXT_WORK.md`を必ず更新する。**
- 検証方法・既存検証コマンドはこの運用統一では変更しない。

## Repository Operations Log

### 2026-09-02 — ChatGPT/Codex検証入口

- `npm run verify:agent`を追加し、既存`npm run verify`をそのまま呼ぶようにした。
- `VERIFY_AGENT.md`に固定SHA、Task固有追加検証、未実施の扱い、証拠記録ルールを定義した。
- Current Taskの375 / 768 / 1280操作監査等は引き続きAcceptance Criteria側の追加検証として扱う。


### 2026-10-01 — HTML第1章を完成

- `lessons.js`に4レッスン、`grading.js`にDOM採点、`progress.js`に保存Repositoryを分離。
- 入力、試行数、採点時コード・結果、完了履歴、表示位置を教材別に保存。旧入力の移行、壊れた保存・保存拒否からの継続を検証。
- 375 / 768 / 1280pxの各幅で4教材を順次完了し、再読込、教材復習、入力変更時の採点無効化、初期化、Tab移動、横溢れなしを確認。全幅pageerror 0。
- `tests/foundation-browser.mjs`で再実行可能。`PLAYWRIGHT_MODULE`で既存PlaywrightのESM入口を指定するか、利用環境のPlaywrightを使う。
- Evidence: `evidence/2026-10-01/browser-results.json`と15枚の画面画像。目視確認は375px教材・1280px演習を含む。
- HTML第1章の17 ACは完了。章2〜7（20レッスン）、JavaScript Worker/停止、IndexedDB/共通アダプターは未完。公開は未実施。
- `npm run verify:agent` PASS（build、Pages必須ファイル、生成物と編集元の同期）。ログ: `evidence/2026-10-01/verify-agent.log`。`git diff --check`もPASS。


### 2026-10-02 — HTML第2章を完成

- Source/test SHA: `549ef789a483494d19ed507fa7b8d536084c3071`。教材html05〜html07、章メタデータ、章ごとの分母・進捗、先頭教材への導線を追加。
- 採点は同じsection/リスト/form内の関係、一意のリンク先ID、教材画像と非空alt、明示label、入力名・必須・無効化を検証。fieldsetの無効化と別form所有も拒否する。
- `npm run verify:agent` PASS（build/check:pages/生成物差分なし）。全7教材を375/768/1280pxで通し検証、全幅pageerror0・横溢れなし。完成例7件は合格、開始コード7件は未達、誤答22ケースは不合格。旧v1/旧単体入力、破損・保存拒否も確認。
- ブラウザ再実行: `PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/foundation-browser.mjs`。Evidence: `evidence/2026-10-02/browser-results.json`、`verify-agent.log`、24枚の画面画像。375px教材と1280pxフォームを目視確認。iframeにscript権限を追加せず、画像は同梱data、CSPは外部通信・送信を制限。
- 初回ブラウザ試行の教材ボタンlocator重複と、旧保存fixture投入後のhashchangeによる上書きをテスト側で修正して再実行。完成例や誤答判定の条件は削除していない。
- 残件: 第3〜7章17レッスン、統合PPL-CORE-001の共通形式/アダプター・Worker/停止・結果内訳・IndexedDB・実Pages検証。未設定の新Taskは作成していない。公開/main mergeは未実施。


### 2026-10-02 — CSS第3章を完成

- Source/test SHA: `e2627b652dec6ddde31de6de7be278da7a16b77d`。アプリケーション実装は9c1df02/3b574c2、最終証拠追加テストはe2627b6。4教材css01〜css04、CSS/HTML表示切替、固定HTMLへのCSS入力を追加。
- `css-grading.js`はブラウザのCSSOM/getComputedStyle/外寸を使う。固定コードのみnonce許可するopaque-origin iframeにCSS文字列を専用portで渡し、親DOM/保存領域への同一オリジンアクセスや外部通信は許可しない。学習者JavaScript実行機能は追加していない。表示用プレビューのsandboxは空のまま。
- 入力変更・教材移動・初期化で採点を取り消す。2秒タイマーの失敗表示と再試行を確認。これはCSS採点の待機制限であり、将来のWorkerによるJavaScript実行制御の完成を意味しない。
- `npm run verify:agent` PASS。全11教材×375/768/1280pxで完成例合格/開始コード未達、入力・結果復元、初期化、Tab、横溢れなし、pageerror0。HTML誤答22/CSS誤答10、同値色表現・important/cascade、外部リクエスト0、CSSへのHTML混入、取消・タイムアウト・UI再試行を確認。
- 四辺の検証は維持し、余白/境界線の条件をまとめて表示。採点失敗表示がfinally処理で消えないよう修正し、最終固定SHAで再検証。スクリーンショットはreduced motionとscroll位置固定で採取し、画面外iframeの全ページ画像だけに頼らず各幅のプレビュー単体画像も保存。
- Evidence: `evidence/2026-10-02-css/` のbrowser-results.json、verify-agent.log、39枚の画像。1280px演習、375px演習とプレビューを目視確認。実GitHub Pages・Safari・手動読み上げは未検証。
- 残件: 第4〜7章13レッスン、統合PPL-CORE-001の共通実行アダプター・Worker/停止・結果内訳・IndexedDB・実Pages検証。次の別Taskは未設定。公開/main mergeは未実施。


### 2026-10-02 — CSS第4章を完成

- Source/test SHA: `ff52a5e347edb9849b1cfd5b1c10474318c0ef74`。css05〜css08を追加し、全15教材へ拡張。Flexbox/Gridは計算済みプロパティに加えて子の実位置・等幅・可視性を検証する。
- CSS採点は教材指定viewportを順に独立したopaque-originフレームで評価し、同じ条件IDへ集約。css07は375/599/600/768/1280px、css08は375/599/600/768/899/900/1280px。既存教材は800pxを維持。
- CSSプレビューの幅選択を追加。広い表示は枠内のスクロールに収まり、アプリ全体の横溢れは発生しない。600/900pxの切替を3画面幅から操作して確認。
- `npm run verify:agent` PASS。全15教材×375/768/1280pxで入力・採点・再読込・初期化・Tab・pageerror0・横溢れなし。誤答はHTML22、基礎CSS10、レイアウト15ケースを拒否。境界1pxずれ、列比率、非表示/親opacity、絶対配置、固定幅、overflowによる隠蔽を確認。
- 狭幅だけ失敗した答案が集約で不合格になること、全幅の値が結果へ残ることを確認。2つ目の採点フレーム追加中の取消でも以降を実行せず、残存iframe0。旧保存・保存拒否・CSP/外部通信・タイムアウト再試行は回帰PASS。
- 初期検証で幅変更直後の古いレイアウトを読んでいたため、iframe navigationと描画フレーム完了を待つようテストを修正。固定幅の期待値は変更していない。初期化ハンドラーへの不要な表示設定挿入を除去し、取消がappend中に起きる場合のフレーム解放も補強した。
- Evidence: `evidence/2026-10-02-layout/` のbrowser-results.json、verify-agent.log、51枚の画像。1280px演習と375pxプレビューを目視確認。実Pages公開、Safari、手動スクリーンリーダーは未検証。
- 残件: 第5〜7章9レッスン、統合PPL-CORE-001の共通実行/Worker/停止/結果内訳/IndexedDB/実Pages検証。次の別Taskは未設定。main merge/公開は未実施。

### 2026-10-02 — JavaScript実行ライフサイクルの先行単位

- Fixed source/test SHA: `f21a2f0023d965944ba7f6d17bb3574d7f15918c`。第5章3教材の目標/代表値/境界をDESIGN.mdへ定義。Worker factoryの契約を持つ独立controllerを追加し、コードを評価せず相関ID、停止、置換取消、時間上限、終了時解放、エラー、遅延応答破棄を扱う。
- `npm run test:execution`7/7 PASS（実Node Worker無限ループ停止とmainタイマー応答、再試行を含む）。`npm run verify:agent` PASS。独立固定SHAレビューでblocking findingなし。証拠: `evidence/2026-10-02-execution/`。
- 本先行単位の受入検査7/7=100%。講座は15/24=63%のまま。PPL-COREのWorker/共通アダプター完了条件は未チェックのまま。実行ホスト、権限制約、ブラウザ検証、採点、教材/UI接続は未完。
- Active: PPL-FOUNDATION-001。Ready: 実行ホストの境界設計/検証。Planned: 第5〜7章9教材、共通アダプター/結果内訳/IndexedDB/実Pages確認。Blocked: なし。Deferred: 実践UI（基礎講座後）。別の次Task: 未設定。
- main merge/公開なし。次は教材接続前に通信/保存/出力量/メモリ制約を扱う実行ホストを設計・検証する。Worker単体を権限隔離とみなさない。


### 2026-10-02 — JavaScript第5章を完成

- Fixed source/test SHA: `7e7e8fb9ca18a9dbfd04e86366b33e14c8452b14`。js01/02/03の3教材、opaque iframeで作るBlob Workerホスト、親側数値採点、停止/取消/時間制限、型/実際値/期待値表示を追加。旧15IDとv1保存を維持。
- `npm run verify:agent` PASS、controller8/8 PASS。Chromium151で3教材の例合格/開始コード未達、誤答9件拒否、数値同値表現、DOM/保存/通信/API/偽結果/HTML表示、実無限ループ/遅延応答/取消/再試行を検証。3教材×3幅の操作と全18教材×3幅の回帰PASS（pageerror0、横溢れなし、旧保存・保存拒否・HTML22/CSS25誤答・幅境界を維持）。
- 初期400ms停止済Workerゼロの検査は失敗。独立最小対照からnative終了遅延と判明し、即時停止とは報告しない。最終実測は取消53.1〜53.8ms、150ms試験timeout応答152.6〜152.9ms、400ms後はWorker1、応答後2035〜2046msでtarget消失、待機後CPU0秒/500ms。実行枠1/待ち行列なし、frame解放後5秒予約で追加128実行を拒否。公開2秒期限は維持。5秒は今回環境での余裕であり、全ブラウザー終了/硬いメモリ上限を保証しない。
- 独立固定SHAソースレビューでblocking findingなし。期限/解放/停止遅延の記述と測定時点に関するP2二件を修正済み。Evidence: `evidence/2026-10-02-javascript/` のREADME、結果JSON/生ログ/controller/verify/レビュー、独立probe、画面画像。
- 第5章受入7/7=100%。currentTask講座完成度18/24=75%。Active: PPL-FOUNDATION-001。Ready: 既存第6章DOM/イベントと実行境界の設計。Planned: 第6〜7章6教材、正式共通形式/アダプター、IndexedDB、実Pages/Safari/手動読み上げ確認。Blocked: 今回scopeなし。Deferred: 実践UI（基礎講座後）。別の次Task: 未設定。
- main merge/公開は未実施。main mergeには実行直前のユーザー承認が必要。


### 2026-10-02 — 第6章先行DOM/イベント境界を検証

- Fixed source/test SHA: `c4f80e091b5b5a728667eaf5dd2704e7b0bfc4c8`。独立DOM/event executorと親側graderを追加。学習者コードはWorkerのみ、trusted opaque iframeがnative DOM/イベント/snapshotを所有する。第5章と同じ1枠/待ち行列なし/5秒予約を共有する。
- 本scopeは教材/UI接続前の先行境界。simple ID selector、textContent/value、click/input listenerのみ。重複、this/currentTarget、非同期handler、例外、unsupported API、fixture/encoding/数量制約とnativeとの差をDESIGNへ明記。第6章教材や通常UIの完了とは扱わない。
- `npm run verify:agent`、controller8/8、実Chromium151 DOM/eventテストPASS。native click2回0→1→2、文字列/空入力、新規DOM reset、親snapshot採点、未対応API5件/fixture4件拒否、iframe作成失敗/作成中取消、親/保存/通信/追加Worker/偽命令/Worker synthetic eventを検証。browser toolingでnativeテキスト/img0と親からのSecurityErrorも確認。
- 実クリックcallback途中の取消/reset/navigation harness・無限loop timeoutを確認。追加DOM/第5章128実行拒否、逆方向の共有枠と新規runを検証。取消0.1〜4ms、150ms試験timeout応答152.1ms、無限Workerは400ms残存/2036msでtarget消失、待機後CPU0秒/500ms。実行期限2秒は変更せず、5秒は普遍的終了/硬いmemory quotaの保証としない。
- 第5章既存実ブラウザー回帰3教材×3幅PASS（採点/型/隔離/無限loop/停止/入力/移動取消/復元/reset/HTML安全表示/追加128件拒否）。元の4d980e2証拠は別作業dirで再検証し変更していない。lessons/progress/foundation/indexと既存テストはbaseから不変（source-manifest）。
- 独立固定SHAソースレビューでblocking findingなし。currentTarget/async例外/disabled・nested fixtureの指摘は修正済み。Evidence: `evidence/2026-10-02-dom-boundary/`（native JSON/ログ、controller/verify、manifest、レビュー、第5章回帰画像/結果）。
- 先行scope受入6/6。講座currentTask完成度は18/24=75%を維持。Active: PPL-FOUNDATION-001。Ready: 契約に沿った最初の第6章DOM更新教材設計/既存UI接続。Planned: 第6〜7章6教材と通常UI/保存/リセット/rapid navigation受入、正式共通形式/アダプター、IndexedDB、実Pages/Safari/手動読み上げ。Blocked: 本scopeなし。Deferred: 基礎講座後の実践UI。別の次Task: 未設定。
- main merge/公開なし。main mergeには実行直前のユーザー承認が必要。

### 2026-10-02 — js04 DOM更新教材を通常UIで受け入れ

- source/test `00821bbaea1b8b0f632e51d802b0c3e9a5c63dcc`。375/768/1280pxの実UI停止/初期化/移動/復元/エラー/安全表示を受け入れ、同一コード再実行停止の旧表示残存も修正した。
- 全19教材×3幅と47誤答、旧保存/破損/拒否回帰PASS。controller8/8、verify:agent PASS。Evidence: `evidence/2026-10-02-dom-lesson/`。
- js04受入7/7。Active: PPL-FOUNDATION-001、完成度19/24=79%。Ready: js05クリックイベント教材設計/通常UI受入。Planned: 残り5教材、共通形式/adapter、IndexedDB、実Pages/Safari/読み上げ。Blocked: 本scopeなし。Deferred: 基礎講座後の実践UI。別Task未設定。
- native終了/メモリ制約は既存境界の限界を維持。main merge/公開は未実施。

### 2026-10-02 — js05 クリックイベント教材を通常UIで受入

- [x] 教材説明/例/開始コード/限定APIとnativeとの差を提供する。
- [x] 開始0、native click3回後の1/2/3の4snapshotを親で採点し、5意味誤答を拒否する。
- [x] scriptなし静的最終表示と保存復元を確認する。
- [x] 同一コード再実行Stopで未確認状態へ戻し、完了履歴を保持する。
- [x] handler開始marker確認後のreset/edit/navigation取消とhandler期限後retryを3幅で受入する。
- [x] 旧v1履歴、全20教材×3幅、既存47誤答/保存拒否等を回帰検証する。
- [x] controller8/8、生成物同期、固定SHA独立レビュー、実画面確認と証拠を保存する。

source/test `280a7626bb26a392eed9c2550e7d3895abccab58`。Evidence: `evidence/2026-10-02-click-lesson/`。Active: PPL-FOUNDATION-001、完成度20/24=83%。Ready: js06入力教材。Planned: 残り4教材、共通形式/adapter、IndexedDB、実Pages/Safari/読み上げ。Blocked: 本scopeなし。Deferred: 基礎講座後の実践UI。別Task未設定。native終了/メモリ制約を維持。main merge/公開未実施。

### 2026-10-02 — js06 入力イベント教材を通常UIで受入

- [x] 教材説明/例/開始コード/限定APIとnativeとの差を提供する。
- [x] 開始空/未入力、native input太郎→空→次郎のvalue/表示の8条件を親で採点し、7意味誤答を拒否する。
- [x] scriptなし静的最終表示と保存復元を確認する。
- [x] 同一コード再実行Stopで未確認状態へ戻し、完了履歴を保持する。
- [x] handler開始marker確認後のreset/edit/navigation取消とhandler期限後retryを3幅で受入する。
- [x] 旧v1履歴、全21教材×3幅、既存47誤答/保存拒否等を回帰検証する。
- [x] controller8/8、生成物同期、固定SHA独立レビュー、実画面確認と証拠を保存する。

source/test `c30cdc2bceadefd47e1d5020e0775a48c818651b`。Evidence: `evidence/2026-10-02-input-lesson/`。Active: PPL-FOUNDATION-001、完成度21/24=88%。Ready: 第7章保存境界/教材設計。Planned: 残り3教材、共通形式/adapter、IndexedDB、実Pages/Safari/読み上げ。Blocked: 本scopeなし。Deferred: 基礎講座後の実践UI。別Task未設定。native終了/メモリ制約を維持。main merge/公開未実施。

### 2026-10-02 — 第7章保存契約の設計のみを受入

- [x] 既存mini-project要件とnative/custom APIの事実・差を追跡する。
- [x] 固定SHA独立設計レビューを通し、owner choiceと保留範囲を明確にする。
- [x] runtime/UI/v1/21教材/過去evidence不変、生成物同期を確認する。
- [x] task/NEXT/evidenceを更新し、講座88%を維持する。

Design `245605fd6a5ed304b59321e89eca468e83660b23`。Evidence: `evidence/2026-10-02-storage-design/`。設計4/4であり教材を追加していない。Active: PPL-FOUNDATION-001。Ready: 選択後の具体的受入/consumer設計。Planned: 第7章mini-project3教材、共通形式/adapter、IndexedDB、実Pages/Safari/読み上げ。Blocked: A/B学習APIと成果物持ち出しのowner決定。Deferred: consumer未確定codec/facade/backend実装と実践UI。別Task未設定。native persistence/取消/partial writes等は未実装・未検証。main merge/公開未実施。
