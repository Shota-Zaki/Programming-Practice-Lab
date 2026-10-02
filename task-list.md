# Programming Practice Lab Task List

## Metadata

- currentTask: `PPL-FOUNDATION-001`
- currentPhase: `Web開発基礎講座`
- currentStatus: `in_progress`
- completionPercentage: `63%`（講座全体24レッスン中15レッスン実装・検証済み。初期カリキュラム17/17、第2〜4章は各7/7受入項目完了）
- baseBranch: `main`
- workBranch: `work`
- pagesSource: `main/docs`
- selectedDesign: `foundation-first + project-based`
- updatedAt: `2026-10-02`

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
- [ ] 実行アダプターの共通インターフェースを定義する。
- [ ] JavaScript実行をWeb Workerへ分離する。
- [ ] 実行時間上限と停止処理を実装する。
- [ ] テスト結果を期待値、実際値、修正案に分けて表示する。
- [ ] IndexedDB保存へ移行する。
- [ ] GitHub Pagesで動作する。

## 次の行動

`PPL-FOUNDATION-001`はHTML第1〜2章とCSS第3〜4章まで実装・検証済み（15/24レッスン、63%）。次は既存第5章「値と処理の基本」の3教材を設計する。変数・条件分岐・繰り返し・関数の課題と期待値を定義し、任意JavaScriptをメイン画面で実行しないWorker実行・時間制限・停止・結果通知の境界を先に実装してから教材へ接続する。

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
