import { FILE_NAMES, createProjectRepository, prepareProjectExport } from './project-files.js';
import { inspectProjectFiles } from './project-static.js';

export function initializeProjectWorkspace(root) {
  const $ = selector => root.querySelector(selector);
  const repository = createProjectRepository(() => window.localStorage);
  const state = repository.state, editor = $('#project-editor');
  let pending = null, artifacts = [];
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
  $('#project-cancel').addEventListener('click', () => { cancel(); clearDownloads(); });
  $('#project-inspect').addEventListener('click', async () => {
    const controller = begin(); $('#project-action-status').textContent = '静的構造を確認しています';
    try {
      const result = await inspectProjectFiles(state.files, { signal: controller.signal });
      if (pending !== controller || controller.signal.aborted) return;
      $('#project-preview').srcdoc = result.preview; $('#project-checks').replaceChildren();
      for (const check of result.checks) {
        const item = document.createElement('li'); item.textContent = `${check.passed ? '確認できました' : '見直してください'}: ${check.label}`;
        $('#project-checks').append(item);
      }
      $('#project-action-status').textContent = '静的確認を更新しました。JavaScript・保存・教材の合格判定は実行していません。';
    } catch (error) {
      if (pending === controller && error.name !== 'AbortError') {
        $('#project-checks').replaceChildren(); $('#project-preview').srcdoc = '';
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
    if (!window.confirm('3ファイルの入力を初期状態へ戻しますか？ 書き出したファイルや成果物の保存値、講座の完了履歴は削除しません。')) return;
    invalidate('入力を初期化しました。書き出したファイル・成果物の保存値は削除していません。');
    repository.reset(); selectFile(state.activeFile); showSave(); editor.focus();
  });
  selectFile(state.activeFile); showSave();
  const leave = () => {
    const hadDownloads = artifacts.length > 0; cancel(); clearDownloads();
    if (hadDownloads) $('#project-action-status').textContent = '画面を移動したため取得リンクを取り消しました。再書き出ししてください。既に取得したファイルは回収できません。';
  };
  window.addEventListener('pagehide', leave);
  return { leave };
}
