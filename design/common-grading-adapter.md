# PPL-CORE-001 共通採点adapter — 既存21教材への接続

根拠: task-list.mdのCORE共通実行interfaceと疎結合の原則。Foundationへ統合した独立単位として、通常UIのHTML/CSS/数値JavaScript/限定DOM採点を一つの契約で呼ぶ。UIの配置・文言・採点条件は変更しない。

## 入力・登録・結果

trusted登録教材を構築時にコピー/凍結し、idとcompletionTestsの一意性を確認する。呼出側は教材定義/期待値を渡さず、厳密な`{lessonId, code, runId}`のみを渡す。lessonIdは登録済み、codeは文字列、runIdは画面内の正のsafe integer。runIdはUIが単調増加させる相関値で、署名/永続identity/外部transportではない。

旧language=html/css/javascriptとexecutionMode未指定、javascript+domだけを受け入れる。未知language/modeとnativeは登録時に拒否し、実行開始しない。既存gradeHtml/gradeCss/gradeJavaScript/gradeDomLessonへ同じ教材とコード、非同期3方式には同じAbortSignalを渡す。新runtime、sandbox権限、ネットワーク/保存capability、timeout緩和、待ち行列を追加しない。既存Worker1枠/結果2秒/停止予約5秒と各graderの制限を維持する。

成功envelopeは`{version:1, lessonId, code, runId, mode, results}`。modeはhtml/css/javascript/dom。resultsは既存の順序/ID/boolean passed、任意のstring actual/expectedをコピー/凍結する。条件数・順序・ID・合否型・表示値型が合わなければ成功にしない。呼出元もenvelopeと要求/登録教材の一致を確認してからresultだけを既存v1へ保存する。HTMLにactual/expectedを補完せず、既存の表示/保存形を保つ。

## 中断と互換性

開始前取消ではgraderを呼ばない。実行中取消はsignalを既存graderへ届け、adapterの待機もAbortErrorで終える。後着成功/失敗は結果へ戻さない。入力・教材・画面・初期化・停止・再実行のUI取消処理を維持し、保存直前に現controller/run/lesson/codeを確認する。取消は既存の保存済み完了履歴やnative成功済み書込をrollbackする契約ではない。

旧21教材ID/判定/例/開始コード、ppl.foundation.progress.v1のversion/keys/result行、旧単体入力と保存拒否表示は維持する。既存progress.jsは変更しない。旧保存からrunId/envelopeを読み込むことも保存することもない。共通教材データ形式/IndexedDB移行は別ACで未実装。第7章static workspaceは独立採点系としてこのadapterへ混在させず、講座22/24=92%・project02/03 native gateを維持する。

## 受入

1. 4方式を実UIへ接続し既存採点行を維持する。
2. 不正登録/未知native mode、不正要求/結果、取消/遅延/同コード再実行の相関をunitで確認する。
3. 旧v1/単体入力/不整合result/破損/保存拒否、入力/停止/移動/reset/再読込/繰返しを実UIで確認する。
4. 旧21教材×3幅、既存controllerとproject workspaceへの影響、生成物同期を確認する。
5. exact候補の独立レビューと証拠/正本管理文書を完了する。

実Pages/Safari/手動読み上げ、native実行・OS分離・資源停止・信頼できる外部transportはこの工程の受入に含めない。
