# NEXT_WORK.md

- Active Task: `PPL-FOUNDATION-001 — Web開発基礎講座`
- Status: `in_progress`（HTML第1〜2章は実装・検証済み）
- Completion: `29%`（講座全体7/24レッスン）。初期カリキュラム17/17、第2章7/7受入項目完了。
- Branch: `work`
- Next Role: 教材設計・実装
- Next Action: 既存第3章「見た目を整える」の4教材についてDESIGN.mdに目標・入力演習・採点条件を定義し、CSSの選択子・色と文字・余白・ボックスモデルの教材と判定を実装する。HTML第1〜2章のIDと保存データ、sandbox/CSPを維持する。
- Blocking: なし。公開/main mergeは明示承認が必要。
- Verification: `npm run verify:agent`、`PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/foundation-browser.mjs`。
- Latest evidence: `evidence/2026-10-02/`。source/test `549ef789a483494d19ed507fa7b8d536084c3071`。全7教材×3幅、誤答22ケース、保存互換性PASS。

詳細なscope・残件・Evidenceは`task-list.md`。GitHub Actionsは使用しない。次の別Taskは未設定。
