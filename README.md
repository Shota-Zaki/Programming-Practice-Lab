# Programming Practice Lab

実際にコードを入力し、実行・検証しながら、現場で利用される開発技術を学ぶための独立学習サイトです。

## 公開URL

- GitHub Pages: `https://shota-zaki.github.io/Programming-Practice-Lab/`
- 公開元: `main` ブランチの `/docs`

## Repository運用

- 恒久作業ブランチは `work` の1本だけを使用する。
- `main` への直接実装は行わない。
- `main`へのmergeはユーザーの明示承認後に行う。
- GitHub Actionsは使用しない。
- 公開用の `/docs` と、設計文書用の `/project-docs` を分離する。
- `/docs` は生成物であり、原則として直接編集しない。
- ソース変更時は既存Repository規約に従って生成・検証し、必要な `/docs` 差分を同じ変更へ含める。
- `main/docs` に統合された内容がGitHub Pagesの公開元となる。

## ローカル確認

```bash
npm run build
python -m http.server 4173 --directory docs
```

ブラウザで `http://localhost:4173/` を開きます。

## Repository構成

```text
Programming-Practice-Lab/
├─ src/                 サイトの編集元
├─ scripts/             ビルド・公開検証
├─ docs/                GitHub Pages公開物
├─ project-docs/        設計・運用文書
├─ DESIGN.md            UI・体験設計の正本
├─ task-list.md         進捗管理の正本
├─ NEXT_WORK.md         次に行う1工程
└─ AGENTS.md            作業規約
```

## 進行管理

現在Task、HEAD、PR、進捗率などの動的情報はREADMEへ固定しません。`task-list.md`と`NEXT_WORK.md`を参照してください。
