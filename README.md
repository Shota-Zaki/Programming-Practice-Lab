# Programming Practice Lab

実際にコードを入力し、実行・検証しながら、現場で利用される開発技術を学ぶための独立学習サイトです。

## 公開URL

- GitHub Pages: `https://shota-zaki.github.io/Programming-Practice-Lab/`
- 公開元: `main` ブランチの `/docs`

## Repository運用

- 恒久作業ブランチは `work` の1本だけを使用する。
- `main` への直接実装は行わず、`work` からPull Requestで統合する。
- 公開用の `/docs` と、設計文書用の `/project-docs` を分離する。
- `/docs` は生成物であり、原則として直接編集しない。
- ソース変更時は `npm run build` を実行し、更新された `/docs` を同じ変更へ含める。
- `main/docs` に統合された内容がGitHub Pagesへ公開される。

## ローカル確認

```bash
npm run build
python -m http.server 4173 --directory docs
```

ブラウザで `http://localhost:4173/` を開きます。

## 現在の構成

```text
Programming-Practice-Lab/
├─ src/                 サイトの編集元
├─ scripts/             ビルド・公開検証
├─ docs/                GitHub Pages公開物
├─ project-docs/        設計・運用文書
├─ .github/workflows/   自動検証
├─ DESIGN.md            UI・体験設計の正本
├─ task-list.md         進捗管理の正本
└─ AGENTS.md            作業規約
```

現在はGitHub Pages公開基盤のみを初期化しています。最終UIはデザイン方針の選定後に実装し、その段階でReact・TypeScriptを正式導入します。
