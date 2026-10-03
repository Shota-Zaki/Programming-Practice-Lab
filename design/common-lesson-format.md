# PPL-CORE-001 共通教材形式v1 — 既存Foundation21教材

COREの「教材データの共通形式を定義する」を、既存HTML/CSS/数値JavaScript/限定DOMの実consumerへ接続する独立単位として実装する。Foundationの教材本文・採点・進捗を疎結合にする既存設計から導く。UI配置や教材の意味、learner APIは変えない。

## 契約

rootは厳密な`{version:1,id,courseId,chapterId,language,title,learning,exercise,nextLessonId}`。learningは`{objectives,contentBlocks,example,hints,explanation}`。exerciseは`{mode,starterCode,completionTests}`とmodeごとのpayloadを持つ。HTMLは追加payloadなし、CSSはmarkupと任意viewports、数値JavaScriptはparameters/returnExpression、限定DOMはfixture。modeはhtml/css/javascript/domのみでlanguageと一致させる。未知版・未知field・native/未知mode・混在payload・欠損/型不一致/疎array/重複条件IDを拒否する。

データはJSONへ往復できるplain object/密array/有限number/string/boolean/nullのみとし、コピー/凍結する。共通部分の文字列・リスト・本文block、各方式で既存graderが読む条件とpayloadの形を確認する。採点条件のID/順序/値を補完・変更しない。CSSの採点幅/byWidth、DOMのselector/step/property/fixture対応、数値のinputs/expectedを保持する。catalogは重複教材ID、不明nextLessonId、別courseへ飛ぶnext、循環nextを拒否する。

旧CSS helperの任意requiredSelector=undefinedはJSONでは存在しないため省略する。値を持つrequiredSelectorとその他のfieldは保持する。未知fieldや不正値を一般に削除/修復する処理は行わない。

## 実consumerと互換性

lessons.jsの既存教材定義をcompileしてversion1のlessonCatalogを作る。UI/progressと既存grader/公開lessons exportには、共通形式から生成したlegacy viewを使う。grading-adapterはlessonCatalogを読み、検証したlegacy viewを既存graderへ渡す。古いcreateGradingAdapter(legacyLessons)の契約も維持する。教材順・旧21ID・chapter/course/next・本文/例/開始code/hints/説明・completionTests/payloadを等値で保持する。互換ビューは新しい期待値や実行権限を作らない。

common形式versionは教材定義の版であり、ppl.foundation.progress.v1の版ではない。学習者保存の移行・IndexedDB・自動修復/削除・新key書込は行わない。progress.jsを変えず、code/checkedCode/result/attempts/completedを従来通り復元/保存する。保存拒否時も既存のメモリ継続表示を維持する。教材moduleは保存/ネットワーク/learner評価を行わない。

upgradeは配信されたstatic教材moduleの交換だけ。既存v1や旧単体入力をロードし、未確認の入力/古いcheckedCode/完了履歴を保持する。途中実行は従来のcancel/reloadで破棄し、schemaVersionやcommon定義を進捗へ混入させない。DB transaction/途中DB upgradeは未実装であり、この工程で受入を主張しない。

## 範囲と受入

1. 共通形式/検証/catalog/互換viewを実装し、旧21データの等値をbaselineと照合する。
2. grading-adapterと通常UIを共通catalogへ接続し、legacy adapter呼出しも維持する。
3. 未知版/mode/payload/条件/graphとコピー・JSON往復をunitで検証する。
4. 旧保存/中断/retry/reload/保存拒否、旧21×3幅、workspace/controller/生成物同期を検証する。
5. exact候補の独立レビュー・証拠・管理文書を完了する。

第7章3ファイルprojectは独立namespace/別入力形式のままとし、今回のsingle-code schemaへ無理に変換しない。講座22/24=92%維持。native実行/OS分離/資源停止/信頼できるtransport、IndexedDB、実Pages/Safari/手動読み上げは未受入。この工程では権限/設定/依存を追加しない。
