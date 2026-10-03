# Foundation進捗のIndexedDB移行

既存COREのIndexedDB項目をFoundation21教材の実保存consumerへ接続する。3ファイルworkspace/project01進捗、成果物native Storageは独立namespaceのまま。講座22/24=92%を維持する。UI配置は維持し、既存保存statusを非同期完了に合わせる。

## 保存・移行契約

- DB名`ppl.foundation.progress`、schema version1、store `records`、key `foundation`。値は`{version:1,revision,state}`。stateは既存v1と同じ教材ID/code/checkedCode/result/attempts/completed/位置/view。revisionはtransaction内の競合検出用で教材定義の版とは異なる。
- 起動時は復元中表示・操作を一時無効にし、復元完了後にUIを接続する。DBに有効なrecordがあればDBだけを正本とする。legacyの後からの変更でDBを上書きしない。
- recordが未作成の場合のみ、旧`ppl.foundation.progress.v1`、旧単体HTML/viewから既存の復元規則でsnapshotを作る。同じreadwrite transactionでrecordを再読込し、まだ無ければrevision1を保存する。recordの存在が移行完了印であり別marker/partial migrationはない。競合する初回移行は最初にcommitしたrecordを採用する。
- この工程は旧localStorageを変更/削除しない。native topic、project、無関係なkeyも変更しない。旧rawが壊れている/読取拒否の場合は無断で正常データへ置換せず、メモリ状態のみで開始し理由を表示する。
- request successだけでは保存済みとしない。transaction complete後に初めてcommitを認める。abort/期限/例外/quotaではそのtransactionを失敗とし、最後にcommit済みのrecordと旧rawを保持する。OS電源断までの物理flushやブラウザー削除後の保持を保証しない。[IndexedDB仕様](https://w3c.github.io/IndexedDB/#transaction-lifecycle)を参照。

## 書込と複数画面

saveは呼出時のsnapshotをコピーし、画面の世代番号を増やす。単一repository内でwriteを直列化し、待機分は最新snapshotへ集約する。古いsaveがcommitしても最新世代がpendingなら保存済み表示にしない。最新snapshotのcommitだけが保存済みになる。採点のrun/code確認は既存adapterのまま。

各write transactionは現在のDB revisionと自分の読取済みrevisionを比較する。異なる場合はwriteせず競合errorに固定し、画面の入力を保持する。別tabのデータを自動で上書き/merge/画面再読込しない。再読込は未保存入力を失うため、その前にコードを手元へ控える旨を表示する。これで同時tabの完了履歴を古いsnapshotで消すことを防ぐ。成功時にrevisionを更新し次の直列writeへ進む。

versionchangeでは接続をcloseし、未完writeをabort、後出しackを無効化して再読込が必要なerrorを表示する。未知の高いDB version、未知/不正recordは上書きしない。blocked openとopen/transactionの時間上限はerrorへ帰着し、後で成功したopenはcloseする。接続を無期限に保持して他画面のupgradeを妨げない。通常のDB schemaは1であり、テストのversion2 upgradeはtask専用profile内のみ。

pagehideの取消は初期復元をawaitする前から登録し、signalをopen/接続/transaction/復元へ渡す。中断後は遅延callbackでstateやUIを初期化しない。BFCacheのpageshow復帰は再読込し、close済みrepositoryを保存可能として再利用しない。

## 故障時と表示

DBが使えない場合は旧保存を読取専用で復元し、以後の編集はこの画面内のメモリのみ。localStorageへの書込fallback/dual-writeを行わず、異なる正本を作らない。保存拒否/abort/quota後は同じ接続が有効なら次の編集でretryできる。競合・壊れたrecord・versionchangeはreloadまでwrite禁止。DB復帰時はreloadでDB正本から復元する。旧fallbackに新たな編集が保存されたと装わない。

表示は`復元中`、`保存中`、`保存済み（IndexedDB）`、`保存できません…この画面内のみ保持…`の4状態。errorには旧データからの復元/競合/接続変更等を区別した短い理由を添える。保存中/errorのまま閉じると未保存分を失う可能性を表示する。pagehideでは未完処理をabort/closeし遅延完了を採用しない。終了時の同期flushや新しい確認dialogは追加しない。

## 受入

1. 上記authority/移行/復帰/非同期表示を実consumerへ接続し、旧21履歴を保持する。
2. native IndexedDBで初回/繰返し移行、単体legacy、reload、旧raw不変を確認する。
3. abort/open refusal/transaction refusal/quota/破損/期限でcommitと表示を区別する。注入faultはnative quota実測と区別する。
4. blocked upgrade/複数tab/競合/versionchange/遅延ack/新snapshot/closeを検証する。
5. 旧21×3幅、adapter/実行controller、workspace/exportと生成物同期を回帰する。
6. 固定候補の独立レビュー・証拠・task/NEXT・guarded work反映を完了する。

テストは新規Playwright contextとloopbackのtask専用originだけ。ユーザーの実ブラウザーデータへ接続しない。sandbox/Worker/通信/任意native実行の権限を変更しない。Safari/実Pages/読み上げとnative transportは別の未受入gate。
