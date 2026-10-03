import { FILE_NAMES, PROJECT_ID, createProjectSnapshot } from './project-files.js';

const encoder = new TextEncoder(), decoder = new TextDecoder('utf-8', { fatal: true });
const caps = { 'index.html': 32768, 'styles.css': 32768, 'app.js': 32768, 'manifest.json': 4096, 'README.txt': 16384 };
const keys = (value, expected) => value && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).length === expected.length && expected.every(name => Object.hasOwn(value, name));
const abortError = () => new DOMException('照合を取り消しました', 'AbortError');
const timeoutError = () => new Error('照合が5秒以内に終わりませんでした。選択し直して再試行してください');
const checkAbort = signal => { if (signal?.aborted) throw abortError(); };
function waitFor(promise, signal, deadline) {
  checkAbort(signal);
  if (performance.now() >= deadline) return Promise.reject(timeoutError());
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (error, value) => {
      if (settled) return; settled = true; clearTimeout(timer); signal?.removeEventListener('abort', abort);
      error ||= performance.now() >= deadline ? timeoutError() : null;
      error ? reject(error) : resolve(value);
    };
    const abort = () => finish(abortError());
    const timer = setTimeout(() => finish(timeoutError()), Math.max(0, deadline - performance.now()));
    signal?.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(value => finish(null, value), error => finish(error));
  });
}

export async function verifyProjectBundle(selected, currentFiles, { signal, digest = bytes => crypto.subtle.digest('SHA-256', bytes) } = {}) {
  checkAbort(signal);
  const snapshot = createProjectSnapshot(currentFiles);
  if (!selected || !Number.isSafeInteger(selected.length) || selected.length < 4 || selected.length > 5) throw new Error('3コードファイルとmanifest.jsonの4ファイルを選んでください。README.txtは任意です');
  const files = Array.from(selected), byName = new Map();
  for (const file of files) {
    if (!file || typeof file.name !== 'string' || !Object.hasOwn(caps, file.name) || byName.has(file.name)) throw new Error('固定名だけを、重複せず選んでください');
    if (!Number.isSafeInteger(file.size) || file.size < 0 || file.size > caps[file.name] || typeof file.arrayBuffer !== 'function') throw new Error(`${file.name}がサイズ上限を超えているか読み取れません`);
    byName.set(file.name, file);
  }
  if (![...FILE_NAMES, 'manifest.json'].every(name => byName.has(name))) throw new Error('3コードファイルとmanifest.jsonが必要です');
  const deadline = performance.now() + 5000;
  const read = async name => {
    checkAbort(signal);
    const file = byName.get(name);
    const buffer = await waitFor(file.arrayBuffer(), signal, deadline);
    if (!(buffer instanceof ArrayBuffer) || buffer.byteLength !== file.size) throw new Error(`${name}を正しく読み取れませんでした`);
    const bytes = new Uint8Array(buffer).slice();
    try { decoder.decode(bytes); } catch { throw new Error(`${name}はUTF-8のテキストにしてください`); }
    return bytes;
  };
  const raw = await read('manifest.json');
  let manifest;
  try { manifest = JSON.parse(decoder.decode(raw)); } catch { throw new Error('manifest.jsonを読み取れません。書き出したmanifestを選んでください'); }
  if (!keys(manifest, ['schemaVersion','projectId','files']) || manifest.schemaVersion !== 1 || manifest.projectId !== PROJECT_ID || !Array.isArray(manifest.files) || manifest.files.length !== 3
    || !FILE_NAMES.every(name => manifest.files.filter(row => keys(row, ['name','bytes','sha256']) && row.name === name && Number.isSafeInteger(row.bytes) && row.bytes >= 0 && row.bytes <= 32768 && typeof row.sha256 === 'string' && /^[a-f0-9]{64}$/.test(row.sha256)).length === 1)) throw new Error('manifest.jsonの形式が違います。この画面から書き出したmanifestを選んでください');
  const rows = [];
  for (const name of FILE_NAMES) {
    const bytes = await read(name), declared = manifest.files.find(row => row.name === name), current = encoder.encode(snapshot[name]);
    const hash = await waitFor(digest(bytes.slice()), signal, deadline);
    if (!(hash instanceof ArrayBuffer) || hash.byteLength !== 32) throw new Error('SHA-256を計算できませんでした');
    const sha256 = [...new Uint8Array(hash)].map(value => value.toString(16).padStart(2,'0')).join('');
    rows.push({ name, bytes: bytes.length, manifestMatches: declared.bytes === bytes.length && declared.sha256 === sha256,
      currentMatches: current.length === bytes.length && current.every((value, index) => value === bytes[index]) });
  }
  checkAbort(signal);
  return { rows, manifestMatches: rows.every(row => row.manifestMatches), currentMatches: rows.every(row => row.currentMatches) };
}
