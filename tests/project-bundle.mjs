import test from 'node:test';
import assert from 'node:assert/strict';
import { STARTER_FILES, prepareProjectExport } from '../src/static/project-files.js';
import { verifyProjectBundle } from '../src/static/project-bundle.js';
const files = bundle => Object.entries(bundle).map(([name, value]) => new File([value], name));
const replace = (bundle, fn) => { const next = { ...bundle }, manifest = JSON.parse(next['manifest.json']); fn(manifest); next['manifest.json'] = JSON.stringify(manifest); return files(next); };

test('exported Unicode/raw HTML-like code matches manifest and current snapshot without execution', async () => {
  const current = { ...STARTER_FILES, 'app.js': '// </script> 🦉\nthrow Error("must never execute")\n' }, bundle = await prepareProjectExport(current);
  const result = await verifyProjectBundle(files(bundle), current);
  assert.equal(result.manifestMatches, true); assert.equal(result.currentMatches, true); assert.equal(result.rows.length, 3);
  assert.equal((await verifyProjectBundle(files(bundle).filter(file => file.name !== 'README.txt'), current)).currentMatches, true);
});
test('manifest mismatch and stale current code are separate observations', async () => {
  const bundle = await prepareProjectExport(STARTER_FILES);
  const changed = await verifyProjectBundle(files({ ...bundle, 'app.js': bundle['app.js'] + '//changed' }), STARTER_FILES);
  assert.equal(changed.manifestMatches, false); assert.equal(changed.currentMatches, false);
  const stale = await verifyProjectBundle(files(bundle), { ...STARTER_FILES, 'app.js': '//new code' });
  assert.equal(stale.manifestMatches, true); assert.equal(stale.currentMatches, false);
  const forged = await verifyProjectBundle(replace(bundle, value => value.files[0].sha256 = '0'.repeat(64)), STARTER_FILES);
  assert.equal(forged.manifestMatches, false); assert.equal(forged.currentMatches, true);
});
test('strict filenames, cardinality and manifest semantics reject before claiming integrity', async () => {
  const bundle = await prepareProjectExport(STARTER_FILES), selected = files(bundle);
  for (const input of [selected.slice(0,3), [...selected,new File(['x'],'other.txt')], [...selected.slice(0,4),selected[0]], selected.map(file => file.name === 'index.html' ? new File(['x'],'../index.html') : file)]) await assert.rejects(verifyProjectBundle(input,STARTER_FILES));
  for (const mutate of [m => m.schemaVersion = 2, m => m.projectId = 'other', m => m.result = 'PASS', m => m.files.pop(), m => m.files[1] = m.files[0], m => m.files[0].bytes = -1, m => m.files[0].bytes = 32769, m => m.files[0].bytes = 1.5, m => m.files[0].sha256 = 'z'.repeat(64), m => m.files[0].result = true]) await assert.rejects(verifyProjectBundle(replace(bundle,mutate),STARTER_FILES), /形式/);
});
test('caps reject unread bytes; exact UTF-8 boundaries and empty code remain valid content checks', async () => {
  const current = { 'index.html': 'a'.repeat(32768), 'styles.css': 'b'.repeat(32768), 'app.js': 'c'.repeat(32768) }, bundle = await prepareProjectExport(current);
  assert.equal((await verifyProjectBundle(files(bundle),current)).currentMatches,true);
  let reads = 0;
  for (const name of ['index.html','styles.css','app.js','manifest.json','README.txt']) {
    const cap = name === 'manifest.json' ? 4096 : name === 'README.txt' ? 16384 : 32768;
    const input = files(bundle).map(file => file.name === name ? {name,size:cap+1,arrayBuffer(){reads++;throw Error('must not read');}} : file);
    await assert.rejects(verifyProjectBundle(input,current), /上限/);
  }
  assert.equal(reads,0);
  const empty = { 'index.html':'', 'styles.css':'', 'app.js':'' };
  assert.equal((await verifyProjectBundle(files(await prepareProjectExport(empty)),empty)).manifestMatches,true);
});
test('invalid UTF-8, read failure, inconsistent metadata and digest failure have no positive result', async () => {
  const bundle = await prepareProjectExport(STARTER_FILES);
  await assert.rejects(verifyProjectBundle(files(bundle).map(file => file.name === 'app.js' ? new File([new Uint8Array([255])],'app.js') : file),STARTER_FILES), /UTF-8/);
  for (const override of [{size:1,arrayBuffer:async()=>new ArrayBuffer(0)}, {size:1,arrayBuffer:async()=>{throw Error('read denied');}}]) await assert.rejects(verifyProjectBundle(files(bundle).map(file => file.name === 'app.js' ? {name:file.name,...override} : file),STARTER_FILES));
  await assert.rejects(verifyProjectBundle(files(bundle),STARTER_FILES,{digest:async()=>new ArrayBuffer(0)}), /SHA-256/);
  await assert.rejects(verifyProjectBundle(files(bundle),STARTER_FILES,{digest:async()=>{throw Error('digest denied');}}), /digest denied/);
});
test('abort releases pending read/hash and rejects late outcomes; current strings are snapshotted', async () => {
  const bundle = await prepareProjectExport(STARTER_FILES), controller = new AbortController();
  const input = files(bundle).map(file => file.name === 'manifest.json' ? {name:file.name,size:file.size,arrayBuffer:()=>new Promise(()=>{})} : file);
  const reading = verifyProjectBundle(input,STARTER_FILES,{signal:controller.signal}); controller.abort(); await assert.rejects(reading,{name:'AbortError'});
  const current = {...STARTER_FILES}; let release, entered;
  const ready = new Promise(resolve=>entered=resolve), stop = new AbortController();
  const pending = verifyProjectBundle(files(bundle),current,{signal:stop.signal,digest:bytes=>{entered();return new Promise(resolve=>release=async()=>resolve(await crypto.subtle.digest('SHA-256',bytes)));}});
  await ready; current['app.js']='changed after snapshot'; stop.abort(); await assert.rejects(pending,{name:'AbortError'}); await release();
  const live = {...STARTER_FILES}; const result = verifyProjectBundle(files(bundle),live); live['app.js']='changed'; assert.equal((await result).currentMatches,true);
});
test('hung reads time out within bounded diagnostic deadline', async () => {
  const bundle = files(await prepareProjectExport(STARTER_FILES));
  await assert.rejects(verifyProjectBundle(bundle.map(file => file.name === 'manifest.json' ? {name:file.name,size:file.size,arrayBuffer:()=>new Promise(()=>{})} : file),STARTER_FILES), /5秒/);
});
