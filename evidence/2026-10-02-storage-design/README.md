# 第7章保存案の設計チェックポイント — 2026-10-02

Baseline `549093d0d727ccf86c8e4c973fe05329a7167b0d`。独立レビュー済みdesign `245605fd6a5ed304b59321e89eca468e83660b23`。

第7章は既存のMINI PROJECT/3教材「自己紹介サイトを完成させる」を維持する。保存専用3教材/新しいlesson IDへ置き換えない。native同期localStorageと独自async APIを別案として、コード再利用/成果物runtime/取消とpartial writes/reload/lesson isolation/quota/corruption/denied storageの差をDESIGNへ記録した。

A native API中心: 現opaque Workerでは任意native Windowコードを実行せず、成果物export/local UXの設計が要る。B 専用API中心: Promise APIと独自runtimeを明示し、native localStorageを偽装しない。どちらもsame-origin権限やsandbox緩和を採らない。A/Bはowner選択前であり、backend/API/教材/ユーザー保存のmigrationを実装していない。

codecは具体的consumer未確定のため文書候補のまま。先行設計070702cのcodec実装可能というレビューは、最新親指示と245605fのscopeで置き換えた。コードを作る承認として扱わない。product選択前は要件/事実の確認、受入計画、既存教材の独立した修正が可能。

独立245605fレビュー阻害なし。`unchanged-files.sha256`はsrc/docs/testsの全38ファイルがbaselineと同一である証拠。過去Chapter5/js04/js05/js06 evidence差分なし。`npm run verify:agent`でbuild/check:pages/同期を確認しraw log保存。新規native browser実測やcodec/persistence/cancel/UI受入をPASSとは宣言しない。native仕様の根拠: [HTML Standard](https://html.spec.whatwg.org/multipage/webstorage.html)、[IndexedDB specification](https://w3c.github.io/IndexedDB/)。

今回設計受入4/4、講座は21/24=88%維持。Blocked: A/B教材方針/成果物持ち出しのowner決定。残受入: native/external実行かfacadeの確定、具体的consumer/キー/lesson登録、native persistence/reload/namespace isolation/partialwrite/corruption/quota拒否、UI/ミニ成果物、Pages/Safari/読み上げ。main merge/公開未実施。
