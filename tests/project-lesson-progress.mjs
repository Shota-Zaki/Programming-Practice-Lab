import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProjectLessonProgress, PROJECT01_PROGRESS_KEY, project01 } from '../src/static/project-lessons.js';
import { createProjectRepository, PROJECT_KEY } from '../src/static/project-files.js';

const store = initial => {
  const data = new Map(Object.entries(initial ?? {}));
  return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
};
test('new lesson starter is incomplete; existing workspace bytes survive registration', () => {
  const storage = store();
  const repo = createProjectRepository(() => storage, { starterFiles: project01.starterFiles });
  assert.match(repo.state.files['index.html'], /<title><\/title>/);
  repo.state.files['index.html'] = '<h1>prior workspace 日本語🙂</h1>'; repo.save();
  const raw = storage.getItem(PROJECT_KEY);
  assert.equal(createProjectRepository(() => storage, { starterFiles: project01.starterFiles }).state.files['index.html'], repo.state.files['index.html']);
  assert.equal(storage.getItem(PROJECT_KEY), raw);
});
test('attempts and historical completion survive reload; reset changes only project01 history', () => {
  const storage = store({ 'ppl.foundation.progress.v1': 'legacy-bytes', [PROJECT_KEY]: 'workspace-bytes', 'ppl.profile.v1.topic': 'css' });
  const progress = createProjectLessonProgress(() => storage);
  progress.record(false); assert.equal(progress.state.completed, false);
  progress.record(true); progress.record(false); assert.equal(progress.state.completed, true);
  const reload = createProjectLessonProgress(() => storage);
  assert.equal(reload.state.attempts, 3); assert.equal(reload.state.completed, true);
  assert.deepEqual(Object.keys(reload.state), ['version', 'lessonId', 'completed', 'attempts']);
  assert.equal(reload.reset(), true); assert.equal(reload.state.completed, false);
  assert.equal(storage.getItem('ppl.foundation.progress.v1'), 'legacy-bytes');
  assert.equal(storage.getItem(PROJECT_KEY), 'workspace-bytes');
  assert.equal(storage.getItem('ppl.profile.v1.topic'), 'css');
});
test('corrupt history is retained until explicit reset', () => {
  for (const raw of ['{bad', 'null', JSON.stringify({ version: 1, lessonId: 'project02', completed: true, attempts: 1 }), JSON.stringify({ version: 1, lessonId: 'project01', completed: true, attempts: -1 }), 'x'.repeat(1025)]) {
    const storage = store({ [PROJECT01_PROGRESS_KEY]: raw });
    const progress = createProjectLessonProgress(() => storage);
    assert.equal(progress.status, 'corrupt'); assert.equal(progress.record(true), false);
    assert.equal(storage.getItem(PROJECT01_PROGRESS_KEY), raw);
    assert.equal(progress.reset(), true); assert.equal(progress.status, 'saved');
  }
});
test('get/set failures keep the in-memory result without claiming persistence', () => {
  const progress = createProjectLessonProgress(() => { throw new DOMException('denied', 'SecurityError'); });
  assert.equal(progress.status, 'unavailable'); assert.equal(progress.record(true), false);
  assert.equal(progress.state.completed, true); assert.equal(progress.status, 'unavailable');
  const storage = store(); storage.setItem = () => { throw new DOMException('full', 'QuotaExceededError'); };
  const quota = createProjectLessonProgress(() => storage);
  assert.equal(quota.record(true), false); assert.equal(quota.status, 'unavailable');
  assert.equal(quota.state.attempts, 1); assert.equal(quota.state.completed, true);
});
