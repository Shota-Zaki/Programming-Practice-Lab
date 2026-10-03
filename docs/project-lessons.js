import { STARTER_FILES } from './project-files.js';

export const projectChapter = { id: 'project-chapter07', title: 'ミニ成果物第7章', plannedLessons: 3 };
export const project01 = Object.freeze({
  id: 'project01', title: '自己紹介サイトの設計と構造',
  objectives: ['3ファイルの役割と相対参照を決める', '意味のあるHTMLと操作できる学習テーマ欄を作る'],
  contentBlocks: [
    { title: '先にサイトの内容を決める', text: '架空の学習者の紹介と、学びたい内容を2つ以上用意します。mainの中にh1、紹介文のp、ulまたはolとliを書き、ページ名をtitle、本文の言語をhtmlのlangに指定してください。個人情報や秘密は入力しません。' },
    { title: '操作する要素にも名前を付ける', text: 'labelのforをtopic、selectのidをtopicにそろえます。未選択の空文字とhtml・css・javascriptの4つのoptionを用意します。表示欄はp#topic-messageに「未選択」、保存を忘れる操作はbutton#forgetにtype="button"を指定します。IDはページ内で一意にしてください。hidden・inert・無効化やTab順の変更を使わず、操作欄を表示します。' },
    { title: '同じフォルダーの3ファイルをつなぐ', text: 'headに<link rel="stylesheet" href="./styles.css">、bodyの末尾に<script src="./app.js" defer></script>を書きます。CSSやJSをHTMLへ埋め込まず、3つのタブで編集します。開始コードの空欄を完成例と比べ、構造を完成させましょう。' },
    { title: 'このレッスンで確認する範囲', text: 'project01はHTML構造の静的採点です。表示コピーにはJavaScriptが含まれず、選択しても表示更新や保存は動きません。第6章の限定APIと違い、成果物のapp.jsでは通常のDOMと同期localStorageを使う予定です。project02の動作とproject03の実行確認は専用環境の受入待ちです。' },
    { title: '静的表示で使える要素と属性', text: '文書設定と例にある要素のほか、section・header・footer・nav・article・aside・div・span・見出しh2〜h4・ol・strong・em・small・pre・code・br・hr・ページ内リンクa、form・fieldset・legend・details・summary・dialogを表示できます。本文の属性はid・class・lang・dir・role・title・for・value・selected・disabled・hidden・inert・open・tabindex・size・multiple・data-*・aria-*、ボタンのtype="button"に対応します。操作欄のtabindexは指定しません。追加の入力欄や未対応要素/属性は使いません。閉じたdetails/dialogや非表示の親要素の中へ必須内容を置くと、表示条件を満たせません。' },
  ],
  hints: ['h1・紹介文・リスト・操作欄をmainの中へ置きます。labelのforとselectのidをそろえ、optionのvalueを空文字/html/css/javascriptにします。', 'CSS参照はhead、defer付きJS参照はbodyの末尾です。CSSで必須要素を隠していないか確認しましょう。'],
  starterFiles: Object.freeze({
    ...STARTER_FILES,
    'index.html': '<!doctype html>\n<html lang="ja">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title></title>\n  <link rel="stylesheet" href="./styles.css">\n</head>\n<body>\n  <main>\n    <h1></h1>\n    <p></p>\n    <h2>学びたいこと</h2>\n    <ul>\n      <!-- 学習内容をliで2つ以上書きます -->\n    </ul>\n    <!-- label、select、表示欄、忘れるボタンを追加します -->\n  </main>\n  <script src="./app.js" defer></script>\n</body>\n</html>\n',
  }),
  exampleFiles: STARTER_FILES,
});

export const PROJECT01_PROGRESS_KEY = 'ppl.foundation.project01.progress.v1';
export function createProjectLessonProgress(storage) {
  const state = { version: 1, lessonId: 'project01', completed: false, attempts: 0 };
  let status = 'fresh', corrupt = false;
  try {
    const raw = storage()?.getItem(PROJECT01_PROGRESS_KEY);
    if (raw != null) {
      try {
        if (raw.length > 1024) throw Error('size');
        const prior = JSON.parse(raw);
        if (!prior || Object.keys(prior).length !== 4 || prior.version !== 1 || prior.lessonId !== 'project01'
          || typeof prior.completed !== 'boolean' || !Number.isSafeInteger(prior.attempts) || prior.attempts < 0) throw Error('schema');
        Object.assign(state, prior); status = 'restored';
      } catch { corrupt = true; status = 'corrupt'; }
    }
  } catch { status = 'unavailable'; }
  const save = () => {
    if (corrupt) return false;
    try {
      const target = storage(); if (!target) throw Error('storage');
      target.setItem(PROJECT01_PROGRESS_KEY, JSON.stringify(state)); status = 'saved'; return true;
    } catch { status = 'unavailable'; return false; }
  };
  return { state, get status() { return status; }, record(passed) {
    state.attempts = Math.min(Number.MAX_SAFE_INTEGER, state.attempts + 1);
    if (passed) state.completed = true;
    return save();
  }, reset() { state.completed = false; state.attempts = 0; corrupt = false; return save(); } };
}

export const project02Css = Object.freeze({
  id: 'project02-css', title: '読みやすいレスポンシブCSS',
  objectives: ['375・768・1280pxで横溢れなく表示する', '余白・文字・操作欄の寸法を整える'],
  contentBlocks: [
    { title: '共有ファイルから続ける', text: 'project01のHTML構造を完成させてからstyles.cssを編集します。教材の切替は3ファイルを置き換えません。CSS開始例を手動でコピーして余白や寸法を追加しましょう。再読込後はproject01教材を表示し、入力は保存から復元します。' },
    { title: '外側とカード内の余白', text: 'bodyの左右paddingを16px以上、mainの左右paddingを24px以上にします。mainはmax-width: 720pxとmargin: 0 autoで中央へ。box-sizing: border-boxを使い、狭い幅で固定widthを指定しないようにします。' },
    { title: '文字と操作欄', text: '主見出し・本文・リスト・label・select・buttonを16px以上、select以外の行高を文字サイズの1.5倍以上にします。font: inheritで操作欄にも反映し、selectとbuttonの高さを44px以上にします。native selectの行高・選択肢の表示はブラウザーが管理します。Tabキーで選択欄とボタンへ移動し、既定のフォーカス表示を残しましょう。フォーカス表示は自動採点に含めず、プレビューで確かめます。' },
    { title: '文字色と単色背景', text: 'この先行教材では白いカードと暗い文字など、単色背景で明暗比4.5以上の組合せを使います。必須文字・選択肢と背景の計算済み色を比較します。透明文字、背景画像/グラデーション、opacityの変更、blend・mask・clip・filterによる視覚効果はこの確認範囲では使いません。親要素で内容を切り抜くoverflow指定も避けます。色以外のアクセシビリティ全体を保証する採点ではありません。' },
    { title: '3幅で確かめる', text: '長い文章はoverflow-wrapで折り返せます。文字や操作欄を隠したりoverflowで切り抜いたりせず、横スクロール不要な配置を作ります。必須内容を画面より上へ退避せず、負のtext-indentも使いません。長いページの通常の縦スクロールは使えます。確認結果は3幅を集約します。プレビューにはJSがなく、テーマ選択・表示更新・標準localStorageの動作確認は専用native環境の受入待ちです。CSS確認だけではproject02全体を完了にしません。' },
  ],
  hints: ['mainを固定幅にせず最大幅と自動marginで整えます。', 'bodyとmainのpaddingは別々です。select・buttonにも文字サイズと行高を継承します。'],
  starterCss: 'body { font-family: sans-serif; }\n/* 余白・文字・カード・操作欄の寸法を追加します */\n',
  exampleFiles: Object.freeze({ ...STARTER_FILES, 'styles.css': "* { box-sizing: border-box; }\nbody { margin: 0; padding: 16px; font-family: sans-serif; font-size: 16px; line-height: 1.7; color: #25334a; background: #edf2f8; }\nmain { max-width: 720px; margin: 0 auto; padding: 24px; background: white; border-radius: 16px; }\nh1 { font-size: clamp(24px, 5vw, 36px); line-height: 1.5; overflow-wrap: anywhere; }\np, li, label { overflow-wrap: anywhere; }\nlabel { display: block; margin-top: 24px; }\nselect, button { display: block; max-width: 100%; min-height: 44px; padding: 8px 12px; font: inherit; }\nbutton { margin-top: 16px; }\n" }),
});

export const project03Export = Object.freeze({
  id: 'project03-export', title: '書き出したファイルを照合する',
  objectives: ['同じsnapshotから3ファイルを持ち出す', 'manifestと現在の編集内容への一致を区別する'],
  contentBlocks: [
    { title: 'ひと組として保存する', text: '「ファイルを書き出す」からindex.html・styles.css・app.js・manifest.json・README.txtを同じ空フォルダーに保存します。再書き出しでは全ファイルを取り直します。「ダウンロード開始」はOSの保存完了ではありません。まず取得したファイル名を確かめましょう。' },
    { title: 'manifestを読む', text: 'manifestは各コードのUTF-8 byte数とSHA-256を記録します。byte数は文字数と異なり、日本語や絵文字で増えます。照合対象は3コードのみでREADMEの内容は照合しません。manifestは署名や動作結果ではなく、同じ内容かを確かめる記録です。' },
    { title: '保存したファイルを選んで照合する', text: '下の選択欄で3コードとmanifestの4ファイルを選びます。READMEは一緒に選んでも構いません。固定名だけを重複せず選び、コード各32KiB・manifest4KiB・README16KiB以内にしてください。選択したコードを実行したり、入力へ上書きしたり、保存/外部送信したりはしません。物理フォルダーやsymlink、OS保存完了の検証ではなく、選択したbytesの照合です。' },
    { title: '二つの一致を見比べる', text: '「manifest一致」はそのmanifestに記録したサイズ/hashへの一致、「現編集一致」は現在の入力snapshotと同じbytesかです。manifestとコードを一緒に変更すれば前者だけは一致するため、正しさや出所の証明にはなりません。混在したファイルなら全ファイルを取り直し、現編集だけと異なる場合は古い書き出しを選んでいないか確かめます。' },
    { title: '照合の後に残る確認', text: '初回・選択変更・再読込・閉じて再open・忘れる・保存失敗は、専用native環境と信頼できる結果連携の受入後に確認します。この画面の内容照合や静的確認はproject03全体の完了になりません。取得ファイルを通常ブラウザーへ開く操作を隔離実行として案内せず、公開/deployは別の承認工程です。' },
  ],
  hints: ['不一致のファイルだけを新旧混在で取り替えず、同じ書き出しのひと組を選び直します。', '編集・教材移動・取消・再選択で照合結果は未確認に戻り、再読込後はファイルの選択もやり直します。'],
  examples: [['manifestの形式例（値は参考用）', '{\n  "schemaVersion": 1,\n  "projectId": "profile-site",\n  "files": [\n    { "name": "index.html", "bytes": 1234, "sha256": "実際の64桁のhash" },\n    { "name": "styles.css", "bytes": 567, "sha256": "実際の64桁のhash" },\n    { "name": "app.js", "bytes": 890, "sha256": "実際の64桁のhash" }\n  ]\n}\n'], ['照合結果の読み方', 'manifest一致 / 現編集一致 → 選んだ3コードが現在の書き出しと同じ内容\nmanifest一致 / 現編集不一致 → 別のsnapshot（古い書き出しなど）\nmanifest不一致 → 変更・混在・破損などを確認\nどの結果でもnative動作・保存・project03全体は未確認\n']],
});
