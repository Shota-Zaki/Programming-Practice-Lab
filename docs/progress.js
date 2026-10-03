export const STATE_KEY = 'ppl.foundation.progress.v1';
export function createProgressRepository(storage, lessons) {
  let available = true;
  const read = key => { try { return storage()?.getItem(key); } catch { available = false; return null; } };
  let saved;
  try { saved = JSON.parse(read(STATE_KEY) || 'null'); } catch { saved = null; }
  const state = { version: 1, lessonId: lessons[0].id, view: read('ppl.foundation.view') || 'home', lessons: {} };
  if (saved?.version === 1) {
    if (lessons.some(x => x.id === saved.lessonId)) state.lessonId = saved.lessonId;
    if (typeof saved.view === 'string') state.view = saved.view;
  }
  for (const lesson of lessons) {
    const prior = saved?.version === 1 ? saved.lessons?.[lesson.id] : null;
    const code = typeof prior?.code === 'string' ? prior.code : (lesson.id === 'html01' ? read('ppl.foundation.html01') : null) ?? lesson.starterCode;
    const result = Array.isArray(prior?.result) && prior.result.length === lesson.completionTests.length && prior.result.every((r, i) => r?.id === lesson.completionTests[i].id && typeof r.passed === 'boolean') ? prior.result : null;
    state.lessons[lesson.id] = { code, attempts: Number.isSafeInteger(prior?.attempts) && prior.attempts >= 0 ? prior.attempts : 0, completed: prior?.completed === true, result, checkedCode: typeof prior?.checkedCode === 'string' ? prior.checkedCode : null };
  }
  return { state, save() { try { storage()?.setItem(STATE_KEY, JSON.stringify(state)); available = true; } catch { available = false; } return available; }, get available() { return available; } };
}
