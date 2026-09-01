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

---

## 6. 共通運用ポリシー（2026-09-01・最新ユーザー指示）

この節は、GitHub Actions、Git操作、進行管理文書、README、最終報告に関する既存の競合記述を上書きする。上記の既存検証方法・検証コマンド・完了条件は、この変更では変更しない。

### GitHub Actions

- GitHub Actionsは使用しない。
- workflowの起動・再実行・結果確認・Artifact取得を、作業、検証、レビュー、完了判定、公開判定に使用しない。
- `.github/workflows/`を新規追加・再追加しない。

### Git操作

- `work`へのcommit / pushはcurrentTaskのscope内なら都度確認なしで実行してよい。
- 既存作業Branchから`work`へのmergeもscope内なら都度確認なしで実行してよい。
- **`main`へのmergeは、実行直前に必ずユーザーへ確認し、明示承認後のみ行う。**
- `main`への直接push、force push、rebase、共有履歴の書き換えは禁止する。
- deploy、外部公開、課金、破壊的変更等の既存承認境界は緩和しない。

### 管理文書

- `task-list.md`をTask状態・scope・Acceptance Criteria・残件の唯一の文書正本とする。
- **すべての作業で、最終報告前に必ず`task-list.md`を更新する。**
- **すべての作業で、最終報告前に必ず`NEXT_WORK.md`を更新する。**
- 次Taskが未設定なら勝手に作成せず`未設定`と記録する。
- branch / PR / HEAD等のlive値は必要時にGitHubから取得し、READMEへ固定しない。

### README

- READMEには現在Task、Current HEAD、Review HEAD、現在PR、liveな進捗率を書かない。
- READMEはプロジェクト概要、構成、セットアップ、静的な運用説明、管理文書への案内に限定する。

### 最終報告

最終返答には最低限、次を含める。

1. `今回の作業内容`
2. `検証結果`
3. `現在の状態`
4. `残タスク一覧` — Active / Ready / Planned / Blocked / Deferred等を区別して省略しない
5. `完成度` — **必ずXX%形式**。currentTaskは原則 `完了Acceptance Criteria数 ÷ Acceptance Criteria総数 × 100` を整数丸めして算出し、別基準なら根拠を併記する
6. `問題・残件`
7. `次の作業`
8. `ユーザー確認が必要な操作` — 少なくとも`main`へのmerge
