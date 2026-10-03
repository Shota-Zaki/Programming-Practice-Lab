export const PROJECT_ID = 'profile-site';
export const PROJECT_KEY = 'ppl.foundation.project.v1.profile';
export const FILE_NAMES = Object.freeze(['index.html', 'styles.css', 'app.js']);
export const STARTER_FILES = Object.freeze({
  'index.html': '<!doctype html>\n<html lang="ja">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>学習者の自己紹介</title>\n  <link rel="stylesheet" href="./styles.css">\n</head>\n<body>\n  <main>\n    <h1>学習者の自己紹介</h1>\n    <p>HTML・CSS・JavaScriptを学んでいます。</p>\n    <h2>学びたいこと</h2>\n    <ul><li>意味のある構造</li><li>操作しやすい画面</li></ul>\n    <label for="topic">学習テーマ</label>\n    <select id="topic">\n      <option value="">未選択</option>\n      <option value="html">HTML</option>\n      <option value="css">CSS</option>\n      <option value="javascript">JavaScript</option>\n    </select>\n    <p id="topic-message">未選択</p>\n    <button id="forget" type="button">保存を忘れる</button>\n  </main>\n  <script src="./app.js" defer></script>\n</body>\n</html>\n',
  'styles.css': 'body { margin: 0; padding: 24px; font-family: sans-serif; line-height: 1.7; }\nmain { max-width: 720px; margin: 0 auto; }\nselect, button { font: inherit; max-width: 100%; }\n',
  'app.js': '// このファイルは標準のDOMとlocalStorageを使う成果物用です。\n// この画面では実行されません。\nconst topic = document.querySelector("#topic");\nconst message = document.querySelector("#topic-message");\nconst forget = document.querySelector("#forget");\nconst storageKey = "ppl.profile.v1.topic";\n// TODO: changeで表示・保存、getItemで復元、removeItemで忘れる処理を作ります。\n'
});
const encoder = new TextEncoder();
const ownKeysMatch = (object, keys) => object && typeof object === 'object' && !Array.isArray(object)
  && Object.keys(object).length === keys.length && keys.every(key => Object.hasOwn(object, key));
export function createProjectSnapshot(files) {
  if (!ownKeysMatch(files, FILE_NAMES)) throw new TypeError('3つの固定ファイルが必要です');
  let total = 0;
  const snapshot = {};
  for (const name of FILE_NAMES) {
    const value = files[name];
    if (typeof value !== 'string') throw new TypeError('ファイルは文字列にしてください');
    if (!value.isWellFormed()) throw new TypeError('不正なUnicodeを含む入力は書き出せません');
    const size = encoder.encode(value).byteLength;
    if (size > 32768) throw new RangeError(`${name}は32KiB以内にしてください`);
    total += size; snapshot[name] = value;
  }
  if (total > 98304) throw new RangeError('全ファイルは96KiB以内にしてください');
  return Object.freeze(snapshot);
}
export function createProjectRepository(storage, { starterFiles = STARTER_FILES } = {}) {
  const starter = createProjectSnapshot(starterFiles);
  const state = { files: { ...starter }, activeFile: FILE_NAMES[0] };
  let status = 'fresh', corrupt = false;
  let raw;
  try { raw = storage()?.getItem(PROJECT_KEY); } catch { status = 'unavailable'; }
  try {
    if (raw !== null && raw !== undefined) {
      if (raw.length > 600000) throw new Error('oversized record');
      const record = JSON.parse(raw);
      if (!ownKeysMatch(record, ['version', 'projectId', 'files', 'activeFile']) || record.version !== 1
        || record.projectId !== PROJECT_ID || !FILE_NAMES.includes(record.activeFile)) throw new Error('invalid record');
      state.files = { ...createProjectSnapshot(record.files) }; state.activeFile = record.activeFile; status = 'restored';
    }
  } catch {
    // Reading bytes failed schema validation; keep them until an explicit reset.
    corrupt = true; status = 'corrupt';
  }
  const save = () => {
    if (corrupt) { status = 'corrupt'; return false; }
    try {
      const record = { version: 1, projectId: PROJECT_ID, files: createProjectSnapshot(state.files), activeFile: state.activeFile };
      if (!FILE_NAMES.includes(record.activeFile)) throw new Error('invalid file');
      const target = storage();
      if (!target) throw new Error('no storage');
      target.setItem(PROJECT_KEY, JSON.stringify(record)); status = 'saved'; return true;
    } catch { status = 'unavailable'; return false; }
  };
  return { state, save, get status() { return status; }, reset() {
    state.files = { ...starter }; state.activeFile = FILE_NAMES[0]; corrupt = false; return save();
  } };
}
const checkAbort = signal => { if (signal?.aborted) throw new DOMException('取り消しました', 'AbortError'); };
export async function prepareProjectExport(files, { signal, digest = bytes => crypto.subtle.digest('SHA-256', bytes) } = {}) {
  checkAbort(signal);
  const snapshot = createProjectSnapshot(files), records = [];
  for (const name of FILE_NAMES) {
    const bytes = encoder.encode(snapshot[name]);
    const hash = new Uint8Array(await digest(bytes)); checkAbort(signal);
    if (hash.length !== 32) throw new Error('SHA-256を計算できませんでした');
    records.push({ name, bytes: bytes.byteLength, sha256: [...hash].map(value => value.toString(16).padStart(2, '0')).join('') });
  }
  const readme = '自己紹介サイトのファイル\n\nindex.html、styles.css、app.js、manifest.jsonを同じ空フォルダに保存してください。\nmanifest.jsonに3ファイルのUTF-8サイズとSHA-256を記録しています。再書き出し時は全ファイルを取り直してください。\nこの書き出しはファイルの生成だけで、教材の完了や公開ではありません。\nこの画面ではJavaScript・保存処理を実行していません。native動作確認は専用の隔離実行環境が受入済みになってから行います。\n通常のブラウザーで直接開く操作を隔離実行として案内していません。file:での保存継続は保証しません。\n課題コード・保存値に個人情報や秘密を含めないでください。\n';
  checkAbort(signal);
  return Object.freeze({ ...snapshot, 'README.txt': readme, 'manifest.json': JSON.stringify({ schemaVersion: 1, projectId: PROJECT_ID, files: records }, null, 2) + '\n' });
}
