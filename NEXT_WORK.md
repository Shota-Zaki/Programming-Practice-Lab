# NEXT_WORK.md

- Active Task: `PPL-FOUNDATION-001 — Web開発基礎講座`
- Status: `in_progress`（HTML第1〜2章、CSS第3〜4章、JavaScript第5章と第6章js04は実装・検証済み）
- Completion: `79%`（講座全体19/24レッスン）。初期17/17、第2〜5章各7/7、js04受入7/7完了。
- Branch: `work`
- Next Role: 第6章js05クリックイベント教材設計/接続
- Next Action: 既存DOM/event bridge契約に沿ってjs05クリックイベント教材を設計し、通常UIの実操作・保存・取消を受け入れる。既存ID/v1保存/プレビュー隔離を維持する。
- Ready: js05教材設計/接続。Planned: 第6章2教材・第7章3教材、正式共通形式/アダプター、IndexedDB、実Pages/Safari/手動読み上げ確認。
- Blocking: 今回scopeなし。Deferred: 実践UI（基礎講座後）。別の次Task: 未設定。
- Verification: `npm run verify:agent`、`npm run test:execution`、`PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/javascript-browser.mjs`、同環境で`node tests/foundation-browser.mjs`。
- Latest evidence: `evidence/2026-10-02-dom-lesson/`。source/test `00821bbaea1b8b0f632e51d802b0c3e9a5c63dcc`。controller8/8、js04実UI×3幅、全19教材×3幅、旧保存/47誤答回帰PASS。固定SHA独立ソースレビュー阻害なし。
- Result deadline vs cleanup: 公開2秒期限と取消応答を維持。native Worker終了には今回Chromiumで約2〜3秒の遅延を観測。枠1/待ち行列なし、解放後5秒の予約で追加作成を拒否。5秒は環境実測の余裕であり、全ブラウザーの終了や硬いメモリquotaを保証しない。
- Approval boundary: main merge/公開は未実施。mainへのmergeは実行直前のユーザー明示承認が必要。

詳細なscope・残件・Evidenceは`task-list.md`。GitHub Actionsは使用しない。

- DOM boundary evidence: `evidence/2026-10-02-dom-boundary/`。fixed source/test `c4f80e091b5b5a728667eaf5dd2704e7b0bfc4c8`。native DOM/event/隔離/encoding/取消/共有枠/作成失敗と第5章3教材×3幅回帰PASS、独立レビュー阻害なし。対応API/nativeとの差はDESIGN参照。この先行境界時点は教材/通常UI未接続、75%維持。今回js04の実UI受入は上記最新evidence参照。リセット/移動はAPI consumer harnessのAbortSignal契約検証であり、通常UI完成を意味しない。
