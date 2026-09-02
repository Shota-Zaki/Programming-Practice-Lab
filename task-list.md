# Programming Practice Lab Task List

## Metadata

- currentTask: `PPL-FOUNDATION-001`
- currentPhase: `Web開発基礎講座`
- currentStatus: `in_progress`
- completionPercentage: `59%`（初期カリキュラム17項目中10項目完了）
- baseBranch: `main`
- workBranch: `work`
- pagesSource: `main/docs`
- selectedDesign: `foundation-first + project-based`
- updatedAt: `2026-09-02`

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
- [ ] 教材データを画面HTMLから分離する。
- [ ] HTML第1章の4レッスンを教材データとして作成する。
- [ ] レッスン完了状態と章進捗を保存する。
- [ ] 入力演習の試行回数と結果を保存する。
- [ ] 再読込後に教材位置と演習状態を復元する。
- [ ] HTML第1章の通し検証を行う。
- [ ] 375px、768px、1280pxで操作監査を行う。

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

`PPL-FOUNDATION-001`として、HTML第1章を教材データへ分離し、4レッスンを順番に完了できる状態へ進める。

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
