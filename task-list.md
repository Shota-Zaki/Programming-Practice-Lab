# Programming Practice Lab Task List

## Metadata

- currentTask: `PPL-FOUNDATION-001`
- currentPhase: `Web開発基礎講座`
- currentStatus: `in_progress`
- completionPercentage: `29%`（講座全体24レッスン中7レッスン実装・検証済み。初期カリキュラム17/17と第2章7/7受入項目は完了）
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

`PPL-FOUNDATION-001`のHTML第1〜2章は実装・検証済み（7/24レッスン、29%）。次は既存第3章「見た目を整える」の4教材について、選択子・色と文字・余白・ボックスモデルの目標と演習・採点条件をDESIGN.mdに具体化し、CSS入力の判定を設計・実装する。

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
