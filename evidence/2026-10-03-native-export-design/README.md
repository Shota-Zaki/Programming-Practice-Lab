# 第7章案A具体設計 — 2026-10-03

Baseline: `e40a7b6e3c7239832c1e72037cfb5f0d185c2a9d`。
独立レビュー対象: `e9ee4ae862102d6189f6bd4b5370df22d220df9e`。阻害指摘なし。

ownerの案A承認を反映し、既存mini-project3教材を具体化。標準localStorage/通常DOMの同じ学習者コードをindex.html/styles.css/app.jsのUTF-8 bytesとして持ち出す。snapshot/hash、途中・繰返し・取消、専用origin/profile、再open/忘れる/データ削除、quota/不正保存/partial writesを定義。task-listに後続実装の受入10条件を登録した。

静的編集/scriptなし確認/exportの実装契約として独立レビュー通過。任意native Window実行は現Workerへ接続せず、別専用環境のOS通信/ファイル・プロセス/資源分離と結果連携が受入済みになるまでBlocked。CSP・Playwright offlineだけを全通信禁止やプロセス停止の保証とせず、通常ブラウザーfallbackも設けない。現Macで新規環境構築・インストール・設定変更・restartはしていない。

`unchanged-files.json`の38ファイルはsrc/docs/testsがbaselineとbytes/hashとも同一である証拠。`verify-agent.log`と`.gz`は可読/正確rawの対で、build/check:pages/生成物同期PASS。native動作・新教材・実UIの検証証拠ではない。過去証拠不変。

今回設計6/6=100%。講座21/24=88%維持。Readyは静的モデル/編集/export、Blockedはnative専用環境・結果transportの受入、実Pages/Safari/読み上げ等はDeferred。main merge/公開未実施。レビュー後の最終更新は管理文書・本証拠READMEだけ。
