import { FILE_NAMES, createProjectRepository, prepareProjectExport } from './project-files.js';
import { gradeProject01, gradeProject02Css } from './project-static.js';
import { project01, project02Css, createProjectLessonProgress } from './project-lessons.js';

export function initializeProjectWorkspace(root) {
  const $ = selector => root.querySelector(selector);
  const repository = createProjectRepository(() => window.localStorage, { starterFiles: project01.starterFiles });
  const progress = createProjectLessonProgress(() => window.localStorage);
  const state = repository.state, editor = $('#project-editor');
  let lesson = project01;
  let pending = null, artifacts = [], onProgress = () => {};
  const showProgress = () => {
    $('#project-result').textContent = lesson === project01 ? '未確認 — 現在の3ファイルで静的構造を確認してください。' : '未確認 — 現在の3ファイルで3幅の静的CSSを確認してください。project02全体は未完了です。';
    $('#project-history').textContent = `確認回数: ${progress.state.attempts}回 / ${progress.state.completed ? 'project01完了履歴あり' : '未完了'} / 第7章 ${progress.state.completed ? 1 : 0} / 3`;
    $('#project-progress-save').textContent = progress.status === 'corrupt' ? '教材の履歴を読み取れません。元のデータを保持しています。履歴の初期化で回復できます。'
      : progress.status === 'unavailable' ? '教材の履歴を保存できません。この画面内のみ保持します。' : '完了履歴は端末へ保存します。再読込後の現コードは未確認になります。';
    onProgress();
  };
  const renderContent = () => {
    const content = $('#project-lesson-content'); content.replaceChildren(); $('#project-examples').replaceChildren();
    $('#project-title').textContent = lesson.title; content.setAttribute('aria-label', lesson.title);
    $('#project-kicker').textContent = lesson === project01 ? 'MINI PROJECT / PROJECT01' : 'MINI PROJECT / PROJECT02 CSS';
    $('#project-description').textContent = lesson === project01 ? 'HTML構造を完成させ、同じ3ファイルを持ち出せます。静的採点でproject01を完了できます。' : '同じ成果物に読みやすいCSSを追加します。静的条件を確認し、続きの動作・保存へ備えます。';
    $('#project-lesson-note').textContent = lesson === project01 ? 'project01は構造の静的採点です。教材の切替は入力を保持します。' : 'project02 CSS先行教材 — 静的CSSのみ。project02全体は未完了です。切替は入力を保持し、再読込時はproject01へ戻ります。';
    $('#project-inspect').textContent = lesson === project01 ? '静的構造を確認' : '3幅の静的CSSを確認';
    for (const block of [{ title: '今回の目標', text: lesson.objectives.join('。') + '。' }, ...lesson.contentBlocks]) {
      const section = document.createElement('section'), heading = document.createElement('h2'), paragraph = document.createElement('p');
      heading.textContent = block.title; paragraph.textContent = block.text; section.append(heading, paragraph); content.append(section);
    }
    const examples = lesson === project01 ? FILE_NAMES.map(name => [name + 'の構造完成例', lesson.exampleFiles[name]]) : [['styles.cssの開始例', lesson.starterCss], ['styles.cssの完成例', lesson.exampleFiles['styles.css']]];
    for (const [title, source] of examples) {
      const details = document.createElement('details'), summary = document.createElement('summary'), pre = document.createElement('pre'), code = document.createElement('code');
      summary.textContent = title; code.textContent = source; pre.append(code); details.append(summary, pre); $('#project-examples').append(details);
    }
    $('#project-hint').textContent = lesson.hints.join(' ');
    for (const button of root.querySelectorAll('[data-project-lesson]')) button.setAttribute('aria-pressed', String(button.dataset.projectLesson === lesson.id));
  };
  const clearDownloads = () => {
    for (const artifact of artifacts) URL.revokeObjectURL(artifact.url);
    artifacts = []; $('#project-downloads').replaceChildren();
  };
  const showSave = () => {
    $('#project-save-status').textContent = repository.status === 'corrupt' ? '保存データを読み取れません。元のデータは保持しています。編集はこの画面内のみです。初期化で置き換えられます。'
      : repository.status === 'unavailable' ? '保存できません。この画面内のみ保持します。サイズ上限も確認してください。'
      : repository.status === 'fresh' ? 'まだ保存していません' : '3ファイルを端末へ保存済み';
  };
  const save = () => { repository.save(); showSave(); };
  const cancel = (message = '確認・書き出しを取り消しました。入力は保持しています。') => {
    const operation = pending; pending = null; operation?.abort();
    $('#project-cancel').hidden = true; $('#project-inspect').disabled = false; $('#project-export').disabled = false;
    if (operation) $('#project-action-status').textContent = message;
  };
  const invalidate = message => {
    cancel(message); clearDownloads(); $('#project-action-status').textContent = message;
    $('#project-checks').replaceChildren(); $('#project-preview').srcdoc = '';
    showProgress();
  };
  const selectFile = (name, focus = false) => {
    state.activeFile = name; editor.value = state.files[name];
    for (const tab of root.querySelectorAll('[data-project-file]')) {
      const active = tab.dataset.projectFile === name;
      tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    }
    $('#project-editor-label').textContent = `${name} 入力欄`;
    $('#project-file-panel').setAttribute('aria-labelledby', `project-tab-${FILE_NAMES.indexOf(name)}`);
  };
  for (const tab of root.querySelectorAll('[data-project-file]')) {
    tab.addEventListener('click', () => { selectFile(tab.dataset.projectFile); save(); });
    tab.addEventListener('keydown', event => {
      const current = FILE_NAMES.indexOf(state.activeFile);
      const next = event.key === 'ArrowRight' ? (current + 1) % 3 : event.key === 'ArrowLeft' ? (current + 2) % 3
        : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : -1;
      if (next >= 0) { event.preventDefault(); selectFile(FILE_NAMES[next], true); save(); }
    });
  }
  editor.addEventListener('input', () => {
    state.files[state.activeFile] = editor.value;
    invalidate('編集しました。確認・書き出しはやり直してください。既に取得したファイルは回収できません。'); save();
  });
  editor.addEventListener('keydown', event => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); $('#project-inspect').click(); }
  });
  const begin = () => {
    cancel(); clearDownloads();
    const controller = new AbortController(); pending = controller;
    $('#project-cancel').hidden = false; $('#project-inspect').disabled = true; $('#project-export').disabled = true;
    return controller;
  };
  const finish = controller => {
    if (pending === controller) { pending = null; $('#project-cancel').hidden = true; $('#project-inspect').disabled = false; $('#project-export').disabled = false; }
  };
  $('#project-cancel').addEventListener('click', () => { invalidate('確認・書き出しを取り消しました。入力は保持しています。'); });
  $('#project-inspect').addEventListener('click', async () => {
    const controller = begin(); $('#project-action-status').textContent = '静的構造を確認しています';
    try {
      $('#project-checks').replaceChildren(); $('#project-preview').srcdoc = ''; showProgress();
      const result = await (lesson === project01 ? gradeProject01 : gradeProject02Css)(state.files, { signal: controller.signal });
      if (pending !== controller || controller.signal.aborted) return;
      $('#project-preview').srcdoc = result.preview; $('#project-checks').replaceChildren();
      for (const check of result.checks) {
        const item = document.createElement('li'); item.textContent = `${check.passed ? '確認できました' : '見直してください'}: ${check.label}${check.passed ? '' : ` (${check.actual})`}`;
        $('#project-checks').append(item);
      }
      const passed = result.checks.every(check => check.passed); if (lesson === project01) progress.record(passed); showProgress();
      $('#project-result').textContent = lesson !== project01 ? (passed ? '3幅の静的CSS条件を確認できました。native動作・保存は未確認で、project02全体は未完了です。' : '未達成の静的条件があります。3幅の結果とCSS教材を見比べて修正してください。') : passed ? 'project01の構造を完了しました。動作・保存・成果物実行は未確認です。' : '未達成の構造条件があります。教材とヒントを見比べて修正してください。';
      $('#project-action-status').textContent = '静的確認を更新しました。JavaScript・保存の動作は実行していません。project02/03は未完了です。';
    } catch (error) {
      if (pending === controller && error.name !== 'AbortError') {
        $('#project-checks').replaceChildren(); $('#project-preview').srcdoc = '';
        showProgress();
        $('#project-action-status').textContent = `静的確認できませんでした: ${error.message}`;
      }
    } finally { finish(controller); }
  });
  $('#project-export').addEventListener('click', async () => {
    const controller = begin(); $('#project-action-status').textContent = '同じ編集内容からファイルを準備しています';
    try {
      const bundle = await prepareProjectExport(state.files, { signal: controller.signal });
      if (pending !== controller || controller.signal.aborted) return;
      for (const [name, content] of Object.entries(bundle)) {
        const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' })); artifacts.push({ name, url });
        const button = document.createElement('button'); button.type = 'button'; button.textContent = `${name}を取得`;
        button.setAttribute('aria-label', `${name}を取得`);
        button.addEventListener('click', () => {
          const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; root.append(anchor); anchor.click(); anchor.remove();
          button.textContent = `${name}（ダウンロード開始）`;
        });
        $('#project-downloads').append(button);
      }
      $('#project-action-status').textContent = '5ファイルを同じ空フォルダに保存してください。「ダウンロード開始」は端末への保存完了を示しません。';
    } catch (error) {
      if (pending === controller && error.name !== 'AbortError') {
        clearDownloads(); $('#project-action-status').textContent = `書き出せませんでした: ${error.message}。入力は保持しています。`;
      }
    } finally { finish(controller); }
  });
  $('#project-reset').addEventListener('click', () => {
    if (!window.confirm('3ファイルの入力をproject01の開始コードへ戻しますか？ 書き出したファイルや成果物の保存値、講座の完了履歴は削除しません。')) return;
    invalidate('入力を初期化しました。書き出したファイル・成果物の保存値は削除していません。');
    repository.reset(); selectFile(state.activeFile); showSave(); editor.focus();
  });
  $('#project-reset-history').addEventListener('click', () => {
    if (!window.confirm('project01の確認回数と完了履歴を初期化しますか？ 編集した3ファイル、旧21教材の履歴、成果物の保存値は保持します。')) return;
    invalidate('project01の履歴を初期化しました。編集した3ファイルは保持しています。');
    progress.reset(); showProgress();
  });
  const selectLesson = id => {
    if (!['project01', 'project02-css'].includes(id) || id === lesson.id) return;
    invalidate('教材を切り替えました。入力は保持し、現在の確認結果と取得リンクを取り消しました。');
    lesson = id === 'project02-css' ? project02Css : project01; renderContent(); showProgress();
  };
  for (const button of root.querySelectorAll('[data-project-lesson]')) button.addEventListener('click', () => selectLesson(button.dataset.projectLesson));
  renderContent(); selectFile(state.activeFile); showSave(); showProgress();
  const leave = () => {
    const hadDownloads = artifacts.length > 0; cancel(); clearDownloads();
    $('#project-checks').replaceChildren(); $('#project-preview').srcdoc = ''; showProgress();
    if (hadDownloads) $('#project-action-status').textContent = '画面を移動したため取得リンクを取り消しました。再書き出ししてください。既に取得したファイルは回収できません。';
  };
  window.addEventListener('pagehide', leave);
  return { leave, selectLesson, get title() { return lesson.title; }, get completed() { return progress.state.completed; }, subscribe(callback) { onProgress = callback; } };
}
