import { lessons, chapters } from './lessons.js';
import { gradeHtml } from './grading.js';
import { createProgressRepository } from './progress.js';
const $ = selector => document.querySelector(selector);
const repository = createProgressRepository(() => window.localStorage, lessons);
const state = repository.state;
const panels = [...document.querySelectorAll('[data-view-panel]')];
const validViews = new Set(panels.map(p => p.dataset.viewPanel));
const editor = $('#editor');
const escapeHtml = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const current = () => lessons.find(l => l.id === state.lessonId);
const entry = () => state.lessons[state.lessonId];
function save() { $('#save-status').textContent = repository.save() ? '保存済み' : '保存できません。この画面内のみ保持します'; }
function closeMenu() { $('#sidebar').classList.remove('open'); $('.menu-button').setAttribute('aria-expanded', 'false'); }
function showView(name, { focus = false, history = true } = {}) {
  state.view = validViews.has(name) ? name : 'home';
  panels.forEach(p => { p.hidden = p.dataset.viewPanel !== state.view; p.classList.toggle('active', !p.hidden); });
  $('#view-title').textContent = {home:'ホーム',courses:'基礎講座',course:'Web開発基礎',lesson:'教材',practice:'入力演習'}[state.view];
  $('#view-kicker').textContent = 'FOUNDATION LEARNING';
  document.querySelectorAll('.sidebar nav [data-view],.mobile-nav [data-view]').forEach(button => {
    if (button.dataset.view === state.view) button.setAttribute('aria-current','page'); else button.removeAttribute('aria-current');
  });
  if (history) window.history.replaceState(null, '', `#${state.view}`);
  save(); closeMenu();
  window.scrollTo({top:0, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  if (focus) { const heading = $(`[data-view-panel="${state.view}"] h1`); if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); } }
}
function progress() {
  const chapter = chapters.find(c => c.id === current().chapterId);
  const chapterLessons = lessons.filter(l => l.chapterId === chapter.id);
  const count = chapterLessons.filter(l => state.lessons[l.id].completed).length;
  const total = lessons.filter(l => state.lessons[l.id].completed).length;
  const percent = Math.round(count / chapterLessons.length * 100);
  document.querySelectorAll('[data-chapter-title]').forEach(n => n.textContent = chapter.title);
  document.querySelectorAll('[data-chapter-progress]').forEach(n => n.textContent = `${count} / ${chapterLessons.length}`);
  document.querySelectorAll('[data-course-progress]').forEach(n => n.textContent = `${total} / 24`);
  document.querySelectorAll('[data-chapter-percent]').forEach(n => n.textContent = `${percent}%`);
  document.querySelectorAll('[data-progress-bar]').forEach(n => n.style.width = `${percent}%`);
  $('#current-lesson-label').textContent = `${chapter.title} / ${current().title}`;
  $('#lesson-picker').innerHTML = chapters.map(c => `<section><h3>${escapeHtml(c.title)}</h3>${lessons.filter(l => l.chapterId === c.id).map((l, i) => `<button type="button" data-lesson="${l.id}" ${l.id === state.lessonId ? 'aria-current="step"' : ''}>${i + 1}. ${escapeHtml(l.title)}${state.lessons[l.id].completed ? ' ✓ 完了' : ''}</button>`).join('')}</section>`).join('');
}
function renderPreview() {
  // CSP precedes learner markup; sandbox intentionally grants no capabilities.
  $('#preview').srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'none'; base-uri 'none'">${editor.value}`;
}
function renderResult() {
  const lesson = current(), record = entry();
  const result = record.checkedCode === record.code ? record.result : null;
  $('#conditions').innerHTML = lesson.completionTests.map((test, i) => `<li class="${result ? result[i].passed ? 'pass' : 'fail' : ''}"><span>${result ? result[i].passed ? '✓' : '×' : '○'}</span>${escapeHtml(test.label)}</li>`).join('');
  const count = result?.filter(r => r.passed).length ?? 0;
  const passed = result && count === lesson.completionTests.length;
  $('#result-status').textContent = result ? `${count} / ${lesson.completionTests.length} 合格` : '未確認';
  $('#result-title').textContent = passed ? '演習を完了しました' : result ? '未達成の条件があります' : 'コードを入力してください';
  $('#result-message').textContent = passed ? lesson.explanation : result ? '×の条件を教材と見比べて修正してください。' : 'プレビュー更新後、完了条件を確認できます。';
  $('#attempts').textContent = `確認回数: ${record.attempts}回${record.completed ? ' / 完了履歴あり' : ''}`;
  $('#next-lesson').hidden = !passed;
  $('#next-lesson').textContent = lesson.nextLessonId ? '次のレッスンへ' : '章の進捗を確認する';
}
function renderLesson() {
  const lesson = current();
  const chapter = chapters.find(c => c.id === lesson.chapterId);
  $('#lesson-content').innerHTML = `<header><p class="eyebrow">HTML / CHAPTER ${chapter.number}</p><h1 id="lesson-title">${escapeHtml(lesson.title)}</h1></header><section><h2>今回の目標</h2><ul class="goals">${lesson.objectives.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></section>${lesson.contentBlocks.map(b => `<section><h2>${escapeHtml(b.title)}</h2><p>${escapeHtml(b.text)}</p></section>`).join('')}<section><h2>コード例</h2><div class="code"><header><span>index.html</span><button type="button" data-copy-code>コピー</button></header><pre><code>${escapeHtml(lesson.example)}</code></pre></div></section><footer class="lesson-next"><p>例を参考に自分で入力し、完了条件を確認しましょう。</p><button class="primary" type="button" data-view="practice">入力演習へ進む</button></footer>`;
  $('#practice-title').textContent = lesson.title;
  $('.practice-head small').textContent = `WEB基礎 / ${lesson.id.toUpperCase()} / PRACTICE`;
  $('[data-view-panel="lesson"] .breadcrumb span:last-child').textContent = lesson.id.toUpperCase();
  $('#task-title').textContent = lesson.title;
  $('#practice-hint').textContent = lesson.hints.join(' ');
  editor.value = entry().code;
  progress(); renderResult(); renderPreview();
}
document.addEventListener('click', async event => {
  const button = event.target.closest('[data-view],[data-view-link],[data-lesson],[data-copy-code]');
  if (!button) return;
  if (button.hasAttribute('data-copy-code')) {
    try { await navigator.clipboard.writeText(current().example); button.textContent = 'コピー済み'; } catch { button.textContent = '選択してコピー'; }
  } else if (button.dataset.lesson) {
    state.lessonId = button.dataset.lesson; renderLesson(); showView('lesson', {focus:true});
  } else { event.preventDefault(); showView(button.dataset.view || 'home', {focus:true}); }
});
$('.menu-button').addEventListener('click', () => { const open = $('#sidebar').classList.toggle('open'); $('.menu-button').setAttribute('aria-expanded', String(open)); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
editor.addEventListener('input', () => { entry().code = editor.value; renderResult(); save(); });
editor.addEventListener('keydown', e => {
  // Preserve normal Tab navigation; Ctrl/Command+Enter provides a keyboard preview shortcut.
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); renderPreview(); }
});
$('#run-preview').addEventListener('click', renderPreview);
$('#check-code').addEventListener('click', () => {
  const record = entry(); record.code = editor.value;
  record.result = gradeHtml(record.code, current().completionTests); record.checkedCode = record.code; record.attempts++;
  if (record.result.every(r => r.passed)) record.completed = true;
  progress(); renderResult(); renderPreview(); save();
});
$('#reset-code').addEventListener('click', () => {
  entry().code = current().starterCode; entry().result = null; entry().checkedCode = null;
  editor.value = entry().code; renderResult(); renderPreview(); save(); editor.focus();
});
$('#next-lesson').addEventListener('click', () => {
  if (current().nextLessonId) { state.lessonId = current().nextLessonId; renderLesson(); showView('lesson', {focus:true}); }
  else showView('course', {focus:true});
});
renderLesson();
showView(validViews.has(location.hash.slice(1)) ? location.hash.slice(1) : state.view, {history:false});
window.addEventListener('hashchange', () => { if (validViews.has(location.hash.slice(1))) showView(location.hash.slice(1), {history:false}); });
