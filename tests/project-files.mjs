import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { PROJECT_KEY, FILE_NAMES, STARTER_FILES, createProjectSnapshot, createProjectRepository, prepareProjectExport } from '../src/static/project-files.js';

function storage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}
test('snapshot copies exactly three complete files', () => {
  const input = { ...STARTER_FILES, 'app.js': 'const message = "日本語🙂</script><img onerror=evil()>";\n' };
  const snapshot = createProjectSnapshot(input);
  input['app.js'] = 'changed';
  assert.notEqual(snapshot['app.js'], input['app.js']);
  assert.ok(Object.isFrozen(snapshot));
  assert.deepEqual(Object.keys(snapshot), FILE_NAMES);
  assert.throws(() => createProjectSnapshot({ ...input, '../secret': 'x' }), /ファイル/);
  assert.throws(() => createProjectSnapshot({ ...input, 'app.js': 1 }), /文字列/);
});
test('UTF-8 limits reject overflow and unpaired surrogate without truncation', () => {
  assert.equal(createProjectSnapshot({ ...STARTER_FILES, 'app.js': 'a'.repeat(32768) })['app.js'].length, 32768);
  assert.throws(() => createProjectSnapshot({ ...STARTER_FILES, 'app.js': 'a'.repeat(32769) }), /32KiB/);
  assert.throws(() => createProjectSnapshot({ ...STARTER_FILES, 'app.js': 'あ'.repeat(10923) }), /32KiB/);
  assert.throws(() => createProjectSnapshot({ ...STARTER_FILES, 'app.js': '\ud800' }), /Unicode/);
});
test('restore and reset affect only project key, preserving old progress', () => {
  const original = '{"version":1,"lessonId":"js06","lessons":{}}';
  const store = storage({ 'ppl.foundation.progress.v1': original });
  const repo = createProjectRepository(() => store);
  repo.state.files['app.js'] = '日本語🙂\n'; repo.state.activeFile = 'app.js';
  assert.equal(repo.save(), true);
  const restored = createProjectRepository(() => store);
  assert.equal(restored.status, 'restored');
  assert.equal(restored.state.files['app.js'], '日本語🙂\n');
  assert.equal(restored.state.activeFile, 'app.js');
  assert.equal(restored.reset(), true);
  assert.deepEqual(restored.state.files, STARTER_FILES);
  assert.equal(store.data.get('ppl.foundation.progress.v1'), original);
});
test('corrupt raw survives load and editing until explicit reset', () => {
  for (const raw of ['{bad', 'null', '{"version":2}', JSON.stringify({ version: 1, projectId: 'other', files: STARTER_FILES, activeFile: 'index.html' })]) {
    const store = storage({ [PROJECT_KEY]: raw });
    const repo = createProjectRepository(() => store);
    assert.equal(repo.status, 'corrupt'); repo.state.files['app.js'] = 'memory only';
    assert.equal(repo.save(), false); assert.equal(store.data.get(PROJECT_KEY), raw);
    assert.equal(repo.reset(), true); assert.notEqual(store.data.get(PROJECT_KEY), raw);
  }
});
test('storage failures and oversized edits preserve in-memory work', () => {
  assert.equal(createProjectRepository(() => { throw new Error('storage getter failed'); }).status, 'unavailable');
  const denied = createProjectRepository(() => { throw new DOMException('denied', 'SecurityError'); });
  denied.state.files['app.js'] = 'keep';
  assert.equal(denied.save(), false); assert.equal(denied.state.files['app.js'], 'keep');
  const store = storage(); const quota = createProjectRepository(() => store);
  store.setItem = () => { throw new DOMException('full', 'QuotaExceededError'); };
  quota.state.files['app.js'] = 'retain'; assert.equal(quota.save(), false);
  assert.equal(quota.state.files['app.js'], 'retain');
  quota.state.files['app.js'] = 'a'.repeat(32769); assert.equal(quota.save(), false);
  assert.equal(quota.state.files['app.js'].length, 32769);
});
test('repeated export preserves bytes and matching real SHA-256 hashes', async () => {
  const input = { ...STARTER_FILES, 'app.js': '// 日本語🙂\nconst x = "</script><meta http-equiv=refresh>";\n' };
  const one = await prepareProjectExport(input), two = await prepareProjectExport(input);
  assert.deepEqual(one, two);
  const manifest = JSON.parse(one['manifest.json']);
  for (const name of FILE_NAMES) {
    assert.equal(one[name], input[name]);
    const record = manifest.files.find(file => file.name === name);
    assert.equal(record.bytes, Buffer.byteLength(input[name]));
    assert.equal(record.sha256, createHash('sha256').update(input[name]).digest('hex'));
  }
  assert.deepEqual(Object.keys(one), [...FILE_NAMES, 'README.txt', 'manifest.json']);
  assert.ok(!one['manifest.json'].includes('completed'));
});
test('async digest snapshots edits and cancellation/error never returns a bundle', async () => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const input = { ...STARTER_FILES };
  const pending = prepareProjectExport(input, { digest: async bytes => { await gate; return crypto.subtle.digest('SHA-256', bytes); } });
  input['app.js'] = 'edited later'; release();
  assert.equal((await pending)['app.js'], STARTER_FILES['app.js']);
  const controller = new AbortController();
  await assert.rejects(prepareProjectExport(input, { signal: controller.signal, digest: async bytes => { controller.abort(); return crypto.subtle.digest('SHA-256', bytes); } }), { name: 'AbortError' });
  await assert.rejects(prepareProjectExport(input, { digest: async () => { throw Error('digest unavailable'); } }), /digest unavailable/);
});
