import { createProgressRepository, STATE_KEY } from './progress.js';

export const PROGRESS_DATABASE = 'ppl.foundation.progress';
export const PROGRESS_STORE = 'records';
export const PROGRESS_RECORD = 'foundation';
const problem = (name, message) => new DOMException(message, name);
const copy = value => structuredClone(value);
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function validRecord(record, lessons) {
  // Legacy v1 progress is JSON data. Native structured cloning also accepts
  // cycles/BigInt; reject these before adopting or replacing an invalid record.
  try { JSON.stringify(record); } catch { return false; }
  const state = record?.state;
  return plain(record) && Object.keys(record).length === 3 && record.version === 1 &&
    Number.isSafeInteger(record.revision) && record.revision > 0 && record.revision < Number.MAX_SAFE_INTEGER &&
    plain(state) && Object.keys(state).length === 4 && state.version === 1 &&
    lessons.some(lesson => lesson.id === state.lessonId) && typeof state.view === 'string' && plain(state.lessons) &&
    Object.keys(state.lessons).length === lessons.length && lessons.every(lesson => {
      const entry = state.lessons[lesson.id];
      return plain(entry) && Object.keys(entry).length === 5 && typeof entry.code === 'string' &&
        Number.isSafeInteger(entry.attempts) && entry.attempts >= 0 && typeof entry.completed === 'boolean' &&
        (entry.checkedCode === null || typeof entry.checkedCode === 'string') &&
        (entry.result === null || Array.isArray(entry.result) && entry.result.length === lesson.completionTests.length &&
          lesson.completionTests.every((test, index) => entry.result[index]?.id === test.id && typeof entry.result[index].passed === 'boolean'));
    });
}

// version is trusted host configuration; the application uses version 1.
export async function openProgressDatabase(factory, { lessons, timeoutMs = 4000, version = 1, signal, onClosed = () => {} } = {}) {
  if (signal?.aborted) throw problem('AbortError', 'Restore was interrupted');
  const db = await new Promise((resolve, reject) => {
    let request, settled = false;
    const finish = (error, value) => { if (settled) return; settled = true; clearTimeout(timer); signal?.removeEventListener('abort', interrupted); error ? reject(error) : resolve(value); };
    const timer = setTimeout(() => finish(problem('TimeoutError', 'Database open timed out')), timeoutMs);
    const interrupted = () => finish(problem('AbortError', 'Restore was interrupted'));
    signal?.addEventListener('abort', interrupted, { once: true });
    try {
      request = factory().open(PROGRESS_DATABASE, version);
      request.onblocked = () => finish(problem('BlockedError', 'Another page is blocking the database'));
      request.onerror = () => finish(request.error || problem('UnknownError', 'Database open failed'));
      request.onupgradeneeded = () => {
        if (settled) { request.transaction.abort(); return; }
        if (!request.result.objectStoreNames.contains(PROGRESS_STORE)) request.result.createObjectStore(PROGRESS_STORE);
      };
      request.onsuccess = () => {
        if (settled) { request.result.close(); return; }
        if (!request.result.objectStoreNames.contains(PROGRESS_STORE)) {
          request.result.close(); finish(problem('DataError', 'Database schema is invalid')); return;
        }
        finish(null, request.result);
      };
    } catch (error) { finish(error); }
  });
  let closed = false;
  const active = new Set();
  function close() {
    if (closed) return;
    closed = true;
    signal?.removeEventListener('abort', stopped);
    for (const transaction of active) { try { transaction.abort(); } catch { /* already committed */ } }
    db.close();
  }
  function changed() { if (closed) return; close(); onClosed(problem('VersionError', 'Database connection changed')); }
  function stopped() { if (closed) return; close(); onClosed(problem('AbortError', 'Restore was interrupted')); }
  signal?.addEventListener('abort', stopped, { once: true });
  if (signal?.aborted) stopped();
  db.onversionchange = changed;
  db.onclose = changed;
  function transaction(operation) {
    return new Promise((resolve, reject) => {
      if (closed) { reject(problem('InvalidStateError', 'Database is closed')); return; }
      let tx, value, failure, timer;
      try {
        tx = db.transaction(PROGRESS_STORE, 'readwrite'); active.add(tx);
        const finish = error => { clearTimeout(timer); active.delete(tx); error ? reject(error) : resolve(value); };
        const abort = error => { failure = error; try { tx.abort(); } catch { finish(error); } };
        tx.oncomplete = () => finish(null);
        tx.onabort = () => finish(failure || tx.error || problem('AbortError', 'Save was interrupted'));
        timer = setTimeout(() => abort(problem('TimeoutError', 'Save timed out')), timeoutMs);
        const store = tx.objectStore(PROGRESS_STORE), read = store.get(PROGRESS_RECORD);
        read.onsuccess = () => {
          try { value = operation(store, read.result); } catch (error) { abort(error); }
        };
      } catch (error) {
        if (tx) { failure = error; try { tx.abort(); } catch { clearTimeout(timer); active.delete(tx); reject(error); } }
        else reject(error);
      }
    });
  }
  const validate = record => { if (!validRecord(record, lessons)) throw problem('DataError', 'Saved progress is invalid'); return record; };
  return {
    readOrMigrate(state, migrationError) {
      return transaction((store, record) => {
        if (record !== undefined) return validate(record);
        if (migrationError) throw migrationError;
        const migrated = validate({ version: 1, revision: 1, state: copy(state) });
        store.put(migrated, PROGRESS_RECORD); return migrated;
      });
    },
    write(state, revision) {
      return transaction((store, record) => {
        validate(record);
        if (record.revision !== revision) throw problem('ConflictError', 'Another page saved newer progress');
        const next = validate({ version: 1, revision: revision + 1, state: copy(state) });
        store.put(next, PROGRESS_RECORD); return next;
      });
    },
    close
  };
}

export function progressStatusText(status) {
  if (status.phase === 'loading') return '学習データを復元しています';
  if (status.phase === 'pending') return '保存中です。完了前に閉じると未保存の入力を失うことがあります';
  if (status.phase === 'saved') return '保存済み（IndexedDB）';
  const reasons = {
    ConflictError: '別の画面に新しい保存があります。入力を控えてから再読込してください',
    VersionError: '保存先の版が変わりました。入力を控えてから再読込してください',
    BlockedError: '別の画面が保存先の更新を妨げています。そちらを閉じて再読込してください',
    DataError: '保存データを読み取れません。旧データは変更していません',
    QuotaExceededError: '保存容量が足りません',
    AbortError: '保存が中断されました',
    TimeoutError: '保存処理が時間内に完了しませんでした'
  };
  const restored = status.source === 'legacy' ? '旧保存から復元しました。' : '';
  return `保存できません。${restored}${reasons[status.reason] || '保存先を利用できません'}。この画面内のみ保持します。閉じる前に入力を控えてください`;
}

export async function createIndexedProgressRepository(storage, lessons, indexedDB, options = {}) {
  const legacy = new Map(); let migrationError = null, restoredLegacy = false;
  try {
    const source = storage();
    if (!source) throw problem('SecurityError', 'Legacy storage unavailable');
    for (const key of [STATE_KEY, 'ppl.foundation.view', 'ppl.foundation.html01']) legacy.set(key, source.getItem(key));
    const raw = legacy.get(STATE_KEY);
    if (raw !== null) {
      let parsed; try { parsed = JSON.parse(raw); } catch { throw problem('DataError', 'Legacy progress is invalid'); }
      if (!plain(parsed) || parsed.version !== 1 || !plain(parsed.lessons)) throw problem('DataError', 'Legacy progress is invalid');
      restoredLegacy = true;
    }
    if (typeof legacy.get('ppl.foundation.html01') === 'string') restoredLegacy = true;
  } catch (error) { migrationError = error; }
  const state = createProgressRepository(() => ({ getItem: key => legacy.get(key) ?? null }), lessons).state;
  const listeners = new Set();
  let source = restoredLegacy ? 'legacy' : 'memory';
  let status = { phase: 'loading', source }, database = null, revision = 0, generation = 0;
  let queued = null, running = false, closed = false, locked = false, committed = null;
  const publish = (phase, reason) => { status = { phase, source, ...(reason ? { reason } : {}) }; for (const listener of listeners) listener({ ...status }); };
  const disconnect = error => {
    locked = true; generation++;
    if (queued) { queued.resolve(false); queued = null; }
    publish('error', error.name);
  };
  try {
    database = await openProgressDatabase(indexedDB, { ...options, lessons, onClosed: disconnect });
    const record = await database.readOrMigrate(state, migrationError);
    if (options.signal?.aborted) throw problem('AbortError', 'Restore was interrupted');
    if (locked) throw problem('VersionError', 'Connection changed during restore');
    Object.assign(state, copy(record.state)); revision = record.revision; committed = JSON.stringify(state); source = 'indexeddb'; publish('saved');
  } catch (error) { locked = true; database?.close(); publish('error', error.name); }
  async function pump() {
    running = true;
    while (queued && !closed && !locked) {
      const item = queued; queued = null;
      try {
        const record = await database.write(item.snapshot, revision);
        revision = record.revision; committed = JSON.stringify(item.snapshot);
        if (item.generation === generation && !closed && !locked) publish('saved');
        item.resolve(!closed && !locked);
      } catch (error) {
        if (['ConflictError', 'DataError', 'VersionError', 'InvalidStateError'].includes(error.name)) disconnect(error);
        else if (item.generation === generation && !closed && !locked) publish('error', error.name);
        item.resolve(false);
      }
    }
    running = false;
  }
  return {
    state,
    get status() { return { ...status }; },
    subscribe(listener) { listeners.add(listener); listener({ ...status }); return () => listeners.delete(listener); },
    save() {
      if (closed || locked) return Promise.resolve(false);
      let snapshot; try { snapshot = copy(state); } catch (error) { publish('error', error.name); return Promise.resolve(false); }
      if (!running && !queued && JSON.stringify(snapshot) === committed) { publish('saved'); return Promise.resolve(true); }
      const sequence = ++generation; publish('pending');
      return new Promise(resolve => {
        if (queued) queued.resolve(false);
        queued = { snapshot, generation: sequence, resolve };
        if (!running) void pump();
      });
    },
    close() {
      if (closed) return;
      closed = true; generation++;
      if (queued) { queued.resolve(false); queued = null; }
      database?.close(); publish('error', 'AbortError');
    }
  };
}
