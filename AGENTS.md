# AGENTS.md

## 1. Repository原則

- Repository: `Shota-Zaki/Programming-Practice-Lab`
- Base branch: `main`
- 恒久作業Branch: `work`
- タスクごとのBranchを追加しない。
- `main`へ直接実装しない。
- rebase、force push、履歴改変を行わない。
- `task-list.md`を進捗管理の唯一の正本とする。

## 2. GitHub Pages

- 公開元は`main`の`/docs`。
- `/docs/index.html`を常に保持する。
- `/docs`は生成物として扱い、手作業で修正しない。
- 編集元は`/src`、生成処理は`/scripts`へ置く。
- ソース変更後は必ず`npm run verify`を実行する。
- `npm run verify`後に差分が生じた場合、その`/docs`差分を必ずcommitする。
- GitHub Pages配下で動作するよう、絶対パスではなくRepository配下を考慮したパスを使用する。

## 3. 設計

- UI実装前に`DESIGN.md`を作成・更新する。
- UI方針が未確定の場合、異なる複数案を提示し、選定後に実装する。
- 参考資料の固有表現を、UI文言、設計文書、コード識別子へ転記しない。
- 375px、768px、1280pxを基本監査幅とする。

## 4. 実装

- 教材、採点、実行環境、進捗保存を疎結合にする。
- ブラウザ実行、ローカル実行、クラウド実行を明確に分離する。
- 将来の統合に備え、基準URL、認証、保存先を交換可能にする。
- 任意コードを通常のアプリケーションプロセスで直接実行しない。
- 秘密情報、認証情報、個人情報をRepositoryや公開物へ含めない。

## 5. 完了条件

各作業は次を満たすまで完了扱いにしない。

1. 実装または文書変更が目的と一致している。
2. `npm run verify`が成功している。
3. `/docs`が編集元と同期している。
4. `task-list.md`が実態と一致している。
5. GitHub Pages公開対象に秘密情報が含まれていない。
6. 必要な検証証拠が作業報告に記録されている。
