# Architecture

## 目的

単独サイトとして開発しながら、将来ほかの学習サービスへ統合できる境界を維持する。

## Directory boundary

```text
src/             編集元
scripts/         ビルド・検証処理
docs/            GitHub Pages公開物
project-docs/    設計・運用文書
```

`docs`は公開専用である。設計文書、作業記録、未公開教材、秘密情報を配置しない。

## 将来構成

UI方針の選定後、編集元をReact・TypeScript構成へ移行する。公開先は引き続き`docs`とし、ビルド出力先を固定する。

将来の主要境界:

- course content
- lesson rendering
- exercise execution
- automatic grading
- learner progress
- environment diagnostics
- authentication adapter
- persistence adapter

## 統合可能性

以下を交換可能にする。

- アプリケーションの基準URL
- ユーザー識別方法
- 進捗保存先
- ナビゲーション外枠
- 認証実装
- 公開基盤
