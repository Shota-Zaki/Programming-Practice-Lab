# Foundation21進捗のIndexedDB移行

Baseline: 1a5c211c36d202aa202c5dfcc28a931d6954cd3f。最終Product: 382def60674d07900f944b72e5b515ff25200acc/tree5d663010a131ff8a5ef5e2b761025660993f104e。

## 実装と保存契約

設計design/indexeddb-progress.mdを先に固定し、Foundation21教材の実保存consumerへ接続した。DB名ppl.foundation.progress/schema1/store records/key foundation。recordはversion/revision/既存v1 state。同じreadwrite transactionのread+putで初回だけ旧progress/単体入力/viewを移す。既存recordが正本で繰返し移行/後からのlegacy変更で上書きしない。旧localStorageを変更/削除せず、native topic・project・無関係keyを維持する。

request successとtransaction completeを区別し、完了前は保存中。snapshotをコピーして直列化し待機分を最新へ集約する。古いackで最新入力の保存済みを表示しない。各transactionのrevision比較で別tabの古いsnapshotを拒否し、入力をこの画面内で保持する。無断merge/上書き/自動再読込をしない。open/transactionは4秒で失敗表示へ帰着する。versionchange/close/pagehideはactive処理をabort/closeし、後出しack/open/初期化を採用しない。BFCache復帰は再読込する。

DB利用不可/壊れたDB/未知版では旧保存を読取専用で復元し、新編集はメモリのみ。localStorageへのwrite fallback/dual-writeはない。旧rawの破損/読取拒否も勝手に置換しない。正常DBがあればlegacy読取拒否でもDBを使う。transient save失敗は次の編集でretry、競合/版変更/起動失敗は入力を控えた後のreloadから復帰する。表示は復元中/保存中/保存済みIndexedDB/理由付き保存失敗を区別する。

scopeはFoundation21。progress.js/旧21教材/4grader/adapter/Worker/controller/opaque sandbox/通信境界/project runtimeは不変。第7章workspaceとproject01進捗の保存はまだlocalStorage、native learner APIも未接続。この単位だけで全CORE保存の移行完了としない。講座22/24=92%維持。

## 固定候補の検証

- Windows task-owned checkout、Node24.19.0、既存Playwright1.63.0/Chromium153.0.8010.12。新規一時contextとtask loopbackだけ。ユーザーのブラウザープロファイル/実データに接続しない。全server/contextをfinallyで終了。新dependency/権限/永続accessなし。
- 最終382def6のnative DB browser25シナリオPASS。375/768/1280で初回/repeat/旧completed+attempts+checkedCode+code/実採点/reload/旧raw不変/DBauthority/遅延ack/実put成功後abort+retry。単体legacy、同時初回移行、DB正常時legacy getter拒否、DB利用不可/open拒否/起動quota/put拒否/transaction拒否/移行abort、壊れたlegacy/DB/未知版保持も確認。
- native2tab CAS競合とreload、native blocked version2 upgrade、阻止upgradeの後ろで待つ実openのdeadline/late結果、keepaliveで実transactionを継続したdeadline abort+retry、pagehide後の遅延ack、初回migrationのackを保持したpagehideでUI初期化/保存済みを拒否することを確認。version2はテスト専用profile内のfixtureで、アプリのDB版は1のまま。
- 拒否/quota/getter/keepalive/ack配送はtrusted test注入。実容量を埋めたnative quota測定ではない。native tx abort/blocked/versionchangeは実APIを使う。synthetic pagehide/BFCache用handlerの確認を、実ブラウザーのBFCache実装受入と混同しない。
- 最終382def6の旧21教材×3幅、開始/例/採点/保存完了待ちreload/reset、HTML22意味誤答、CSS10+layout15意味誤答/同値/幅境界/取消/timeoutretry、旧v1/単体legacy/破損/拒否PASS。raw全結果と代表9画面を保存。
- b739eb0のadapter通常UI3幅/旧v1/同コード遅延/編集-reset-教材-画面-reload取消/foreign row拒否/DOM/numeric停止+retry、workspace35観測/download30、project03 9ケース/download15/3幅/遅延6race PASS。382との差はpractice保存status CSSとそのテストだけで、全JavaScript一致を独立確認。影響あるlayoutと旧21UIは382で再実行し、無関係なsuiteの重複実行はしない。
- de6bc0eの50既存unit/controller PASS。unitが読むmodule/testsはb739/382から不変。新DBconsumerは上記native browserで検証し、50unitを新DBのunit coverageと称しない。最終382 npm run verify:agent/source-docs同期/diffcheck PASS。GitHub Actions不使用、required CIなしをPASSにしない。

## 独立レビューと初期失敗

de6bc初回レビューは、初期復元のawait後までpagehide handlerが無かったため、初回migration完了の配送を保持してhide後に解放するとUI初期化/保存済みになる問題を再現した。初回結果はpass:falseで保持。b739でawait前のAbortController/handler、open/driver/transaction/復元とUI初期化のguardを追加し解消。独立mobileで通常migration/history/旧raw/DBreload/queue/nativeabort+retry/2tabCAS/post-initpagehide、初期復元hide、pre-aborted factory呼出0/DB未作成、late native open success後のcloseを確認した。これは保存/bootstrap lifecycleの不備でありlearner sandbox escapeの証拠ではない。

初回main DB suiteは新contextのeditor可視待ちtimeoutで未完、原因は断定しない。初回full21は新編集の非同期commitを待たずreloadして旧結果を読んだassertion failure。保存完了の待機を追加し期待値は緩めず、修正版で両suiteが完走した。初回失敗ログを保存しPASS扱いしない。

実装側画面確認で長いエラーがmobileの戻るbuttonを縦に押し縮めたため、382でpending/errorを別の全幅grid行へ置いた。独立exact382で375px saved/pending/error、button1行/横溢れなしとb739全JS一致を確認。最終DB suiteにbutton幅/高さ/別行assertionを追加し、375/768/1280の通常UI・旧21全幅も通した。独立レビューはmobile/静的HTMLとソース、全21×3幅は実装agentの別証拠。

## 境界と公開

request成功/abort/completeはnative APIの観測範囲。OS電源断までの物理durability/実quota値/ブラウザー削除後の保持/全ブラウザーは保証しない。[IndexedDB transaction仕様](https://w3c.github.io/IndexedDB/#transaction-lifecycle)参照。実Pages/Safari/手動読み上げはDeferred。native任意実行のOS通信/ファイル・プロセス分離/CPU-memory上限/停止確認/専用origin-profile/信頼できるtransportは未受入。main merge/deploy/サービス再起動/設定変更なし。

このREPORTは公開前checkpoint。固定候補のguarded work反映は直前の指定policy GET/expected remote1a5c211/no-deploy-triggerと親継続許可の範囲確認後に行う。main mergeは実行直前のユーザー明示承認が必要。

Active: Foundation/IndexedDB。Ready: レビュー済みFoundation21候補。Planned: 第7章workspace入力とproject01進捗のIndexedDB移行/復帰契約、残native動作/成果物。Blocked: native専用環境/transport。Deferred: 実Pages/Safari/読み上げ/実践UI。別Task未設定。
