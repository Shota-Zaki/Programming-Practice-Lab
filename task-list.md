# Programming Practice Lab Task List

## Metadata

- currentTask: `PPL-INIT-001`
- currentPhase: `公開基盤初期化`
- currentStatus: `completed`
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

## 次タスク候補

`PPL-DESIGN-001` UI方向性の比較・選定

開始条件:

- トップ画面、コース画面、演習画面について複数の方向性を比較する。
- ユーザーが採用方向または組み合わせを選択する。
- 選定結果を`DESIGN.md`へ反映してから実装を開始する。
