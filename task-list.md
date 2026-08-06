# Programming Practice Lab Task List

## Metadata

- currentTask: `PPL-DESIGN-001`
- currentPhase: `UI方向性の比較・選定`
- currentStatus: `awaiting_user_selection`
- baseBranch: `main`
- workBranch: `work`
- pagesSource: `main/docs`
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

状態: `ユーザー選定待ち`

### 目的

トップ画面、コース画面、演習画面について複数の設計方向を比較し、Programming Practice Labの正式なUI方針を確定する。

### 比較案

- A: 学習ガイド型
- B: 開発環境型
- C: プロジェクト型

各案は公開プロトタイプ内でトップ、コース、演習を切り替えて確認できる。

### 完了条件

- [x] 3つの方向案を作成する。
- [x] 各案にトップ画面を含める。
- [x] 各案にコース画面を含める。
- [x] 各案に演習画面を含める。
- [x] 375px、768px、1280pxを考慮したレスポンシブ構造にする。
- [x] 各案の利点とリスクを`DESIGN.md`へ記録する。
- [ ] ユーザーが採用案または組み合わせを選定する。
- [ ] 選定結果を`DESIGN.md`の正式方針へ反映する。
- [ ] 次の実装タスクを確定する。

### 検証対象

- 方向案切替: A、B、C
- 画面切替: トップ、コース、演習
- 表示幅: 375px、768px、1280px
- キーボードフォーカス
- 長いコード、説明文、コース名の表示

### 証拠

- 比較用公開URL: `https://shota-zaki.github.io/Programming-Practice-Lab/`
- 編集元: `src/static/`
- 公開物: `docs/`
- 設計記録: `DESIGN.md`

## 次工程

ユーザーの選定後、採用方向を正式なデザイン方針へ変換し、情報設計、コンポーネント、レスポンシブ挙動、アクセシビリティ要件を確定する。
