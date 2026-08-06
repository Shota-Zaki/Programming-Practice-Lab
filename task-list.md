# Programming Practice Lab Task List

## Metadata

- currentTask: `PPL-CORE-001`
- currentPhase: `ブラウザ演習基盤`
- currentStatus: `planned`
- baseBranch: `main`
- workBranch: `work`
- pagesSource: `main/docs`
- selectedDesign: `project-based`
- updatedAt: `2026-08-06`

## PPL-INIT-001 GitHub Pages公開基盤

状態: `完了`

### 完了条件

- [x] `main/docs`をGitHub Pages公開物として使用できる。
- [x] `/docs/index.html`が存在する。
- [x] 編集元と公開物を分離する。
- [x] `/docs`同期検証用のコマンドを用意する。
- [x] 恒久作業Branchを`work`に固定する。
- [x] 設計文書を公開用`/docs`の外へ分離する。

### 証拠

- 公開URL: `https://shota-zaki.github.io/Programming-Practice-Lab/`
- 公開元: `main/docs`
- 検証コマンド: `npm run verify`

## PPL-DESIGN-001 UI方向性の比較・選定

状態: `完了`

### 決定

- [x] 方向A「学習ガイド型」を比較した。
- [x] 方向B「開発環境型」を比較した。
- [x] 方向C「プロジェクト型」を比較した。
- [x] ユーザーが方向Cを採用した。
- [x] 採用理由と設計原則を`DESIGN.md`へ反映した。

### 証拠

- 採用方向: `C / プロジェクト型`
- ユーザー決定日: `2026-08-06`
- 設計正本: `DESIGN.md`

## PPL-APP-001 プロジェクト型正式UI初期実装

状態: `完了`

### 完了条件

- [x] 比較用の3案切替UIを正式画面から撤去する。
- [x] プロジェクト起点のトップ画面を実装する。
- [x] プロジェクト工程画面を実装する。
- [x] 演習画面を実装する。
- [x] 375px、768px、1280pxを想定した表示へ調整する。
- [x] 画面切替と演習結果表示をキーボード操作可能にする。
- [x] `src/static`と`docs`を同期する。

### 補足

このタスクの演習実行はUI状態確認用であり、任意コードを安全に実行する本番エンジンではない。

## PPL-CORE-001 ブラウザ演習基盤

状態: `未着手`

### 目的

正式UIへ、教材データ、コード編集、実行、採点、保存を分離したブラウザ演習基盤を導入する。

### 初期対象

- JavaScript
- TypeScript
- React基礎
- HTML・CSSプレビュー

### 完了条件

- [ ] 教材データを画面実装から分離する。
- [ ] 実行アダプターの共通インターフェースを定義する。
- [ ] JavaScript実行をメインUIスレッドから分離する。
- [ ] 実行時間上限と停止処理を実装する。
- [ ] テスト結果を正否、期待値、実際値に分けて表示する。
- [ ] 入力コードと試行状態をローカル保存する。
- [ ] 再読込後に前回状態を復元する。
- [ ] GitHub Pagesで動作する。

## 次の行動

`PPL-CORE-001`の設計を細分化し、最初のJavaScript演習を実装する。
