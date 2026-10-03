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
