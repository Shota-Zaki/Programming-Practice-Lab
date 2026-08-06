# Merge Strategy

## Branch

- `main`: 公開可能な正本
- `work`: 唯一の恒久作業Branch

タスク単位の一時Branchは作成しない。

## Pull Request

- `work`から`main`へのPull Requestを更新して使用する。
- 実装、生成済み`docs`、検証証拠、`task-list.md`更新を同じ変更単位に含める。
- 検証失敗中は統合しない。
- 原則としてmerge commit方式を使用する。

## Pages整合性

Pull Requestの差分で、編集元だけが変更され`docs`が更新されていない状態を禁止する。自動検証で差分を検出する。
