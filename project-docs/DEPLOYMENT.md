# Deployment

## GitHub Pages設定

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`

## 公開フロー

1. `work`でソースを変更する。
2. `npm run verify`を実行する。
3. 生成された`docs`をソースと同じcommitへ含める。
4. Pull Requestを`main`へ統合する。
5. GitHub Pagesが`main/docs`を公開する。
6. 公開URLを確認する。

## 重要事項

GitHub Pagesは`docs/index.html`を入口として使用する。`docs`を削除した状態で`main`へ統合しない。

現在はBranch公開を採用しているため、ビルド済み`docs`をRepositoryへcommitする。将来GitHub Actionsから直接公開する方式へ変更する場合は、Pages設定と運用規約を同時に更新する。

## 公開URL

`https://shota-zaki.github.io/Programming-Practice-Lab/`
