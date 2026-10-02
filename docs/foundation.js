import { lessons, chapters } from './lessons.js';
import { gradeHtml } from './grading.js';
import { gradeCss, lessonPreview } from './css-grading.js';
import { gradeJavaScript } from './javascript-grading.js';
import { javascriptHostBusy, javascriptHostReady } from './javascript-host.js';
import { createProgressRepository } from './progress.js';
const $ = selector => document.querySelector(selector);
const repository = createProgressRepository(() => window.localStorage, lessons);
const state = repository.state;
const panels = [...document.querySelectorAll('[data-view-panel]')];
const validViews = new Set(panels.map(p => p.dataset.viewPanel));
const editor = $('#editor');
const escapeHtml = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let pendingGrade = null;
function syncExecutionButtons() {
  const busy = Boolean(pendingGrade) || (current().language === 'javascript' && javascriptHostBusy());
  $('#execution-state').hidden = current().language !== 'javascript' || !javascriptHostBusy() || Boolean(pendingGrade);
  $('#check-code').disabled = busy;
  $('#run-preview').disabled = current().language === 'javascript' && busy;
  $('#run-preview').title = current().language === 'javascript' && javascriptHostBusy() ? '停止処理を待っています。数秒後に再実行できます。' : '';
}
function waitForHost() { syncExecutionButtons(); void javascriptHostReady().then(syncExecutionButtons); }
function cancelGrade() { const pending = pendingGrade; pendingGrade = null; pending?.abort(); $('#stop-code').hidden = true; if (pending) renderResult(); waitForHost(); }
const current = () => lessons.find(l => l.id === state.lessonId);
const entry = () => state.lessons[state.lessonId];
function save() { $('#save-status').textContent = repository.save() ? '保存済み' : '保存できません。この画面内のみ保持します'; }
function closeMenu() { $('#sidebar').classList.remove('open'); $('.menu-button').setAttribute('aria-expanded', 'false'); }
function showView(name, { focus = false, history = true } = {}) {
  cancelGrade();
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
  if (current().language === 'javascript') { $('#preview').srcdoc = ''; return; }
  const width = $('#preview-width').value;
  $('#preview').style.width = width === 'fit' ? '100%' : `${Number(width)}px`;
  $('#preview').srcdoc = lessonPreview(editor.value, current());
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
  $('#execution-output').textContent = result ? result.map((r,i)=>`${lesson.completionTests[i].label}\n実際: ${r.actual ?? ''}\n期待: ${r.expected ?? ''}\n${r.passed ? '合格' : '修正: '+lesson.hints[0]}`).join('\n\n') : 'コードを実行すると、実際の値と期待値を表示します。';
  $('#attempts').textContent = `確認回数: ${record.attempts}回${record.completed ? ' / 完了履歴あり' : ''}`;
  $('#next-lesson').hidden = !passed;
  $('#next-lesson').textContent = lesson.nextLessonId ? '次のレッスンへ' : '章の進捗を確認する';
}
function renderLesson() {
  cancelGrade();
  const lesson = current();
  $('.editor-panel header span').textContent = lesson.language === 'css' ? 'style.css' : lesson.language === 'javascript' ? 'lesson.js' : 'index.html';
  $('.editor-panel header b').textContent = lesson.language.toUpperCase();
  editor.setAttribute('aria-label', `${lesson.language.toUpperCase()}コード入力欄`);
  const chapter = chapters.find(c => c.id === lesson.chapterId);
  $('#lesson-content').innerHTML = `<header><p class="eyebrow">${chapter.language ?? 'HTML'} / CHAPTER ${chapter.number}</p><h1 id="lesson-title">${escapeHtml(lesson.title)}</h1></header><section><h2>今回の目標</h2><ul class="goals">${lesson.objectives.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></section>${lesson.contentBlocks.map(b => `<section><h2>${escapeHtml(b.title)}</h2><p>${escapeHtml(b.text)}</p></section>`).join('')}${lesson.markup ? `<section><h2>このCSSを適用するHTML</h2><div class="code"><pre><code>${escapeHtml(lesson.markup)}</code></pre></div><p>HTMLは用意されています。入力欄にはCSSだけを書きます。</p></section>` : ''}<section><h2>コード例</h2><div class="code"><header><span>${lesson.language === 'css' ? 'style.css' : lesson.language === 'javascript' ? 'lesson.js' : 'index.html'}</span><button type="button" data-copy-code>コピー</button></header><pre><code>${escapeHtml(lesson.example)}</code></pre></div></section><footer class="lesson-next"><p>例を参考に自分で入力し、完了条件を確認しましょう。</p><button class="primary" type="button" data-view="practice">入力演習へ進む</button></footer>`;
  $('#practice-title').textContent = lesson.title;
  $('.practice-head small').textContent = `WEB基礎 / ${lesson.id.toUpperCase()} / PRACTICE`;
  $('[data-view-panel="lesson"] .breadcrumb span:last-child').textContent = lesson.id.toUpperCase();
  $('#task-title').textContent = lesson.title;
  $('#practice-hint').textContent = lesson.hints.join(' ');
  const isJavaScript = lesson.language === 'javascript';
  $('#preview').hidden = isJavaScript; $('#execution-output').hidden = !isJavaScript; waitForHost();
  $('.preview-panel header span').textContent = isJavaScript ? '実行結果' : 'ブラウザプレビュー';
  $('#run-preview').textContent = isJavaScript ? 'コードを実行' : 'プレビュー更新';
  $('#preview-controls').hidden = lesson.language !== 'css';
  const widths = lesson.viewports ?? [375,768,1280];
  $('#preview-width').innerHTML = '<option value="fit">表示領域に合わせる</option>' + widths.map(width => `<option value="${width}">${width}px</option>`).join('');
  $('#preview-width-note').textContent = `採点幅: ${(lesson.viewports ?? [800]).join(' / ')}px。広いプレビューは枠内で横にスクロールできます。`;
  $('#preview').title = lesson.language === 'css' ? 'CSSを適用したHTMLプレビュー' : 'HTMLプレビュー';
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
editor.addEventListener('input', () => { cancelGrade(); entry().code = editor.value; renderResult(); save(); });
editor.addEventListener('keydown', e => {
  // Preserve normal Tab navigation; Ctrl/Command+Enter provides a keyboard preview shortcut.
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); if (current().language === 'javascript') $('#check-code').click(); else renderPreview(); }
});
$('#run-preview').addEventListener('click', () => { if (current().language === 'javascript') $('#check-code').click(); else renderPreview(); });
$('#stop-code').addEventListener('click', () => { cancelGrade(); $('#result-title').textContent = '実行を停止しました'; });
$('#preview-width').addEventListener('change', renderPreview);
$('#check-code').addEventListener('click', async () => {
  cancelGrade();
  const record = entry(), lesson = current(), code = editor.value;
  const controller = new AbortController(); pendingGrade = controller;
  record.code = code;
  syncExecutionButtons(); $('#stop-code').hidden = lesson.language !== 'javascript';
  $('#result-title').textContent = '完了条件を確認しています';
  try {
    const result = lesson.language === 'javascript' ? await gradeJavaScript(code, lesson, {signal:controller.signal}) : lesson.language === 'css' ? await gradeCss(code, lesson, {signal:controller.signal}) : gradeHtml(code, lesson.completionTests);
    if (controller.signal.aborted || current().id !== lesson.id || record.code !== code) return;
    record.result = result; record.checkedCode = code; record.attempts++;
    if (result.every(r => r.passed)) record.completed = true;
    progress(); renderResult(); renderPreview(); save();
  } catch (error) {
    if (error.name !== 'AbortError') {
      record.result = null; record.checkedCode = null;
      renderResult(); save();
      $('#result-title').textContent = '確認できませんでした';
      $('#result-message').textContent = lesson.language === 'javascript' ? '構文・変数名・戻り値を確認し、もう一度実行してください。実行上限は2秒、コード上限は32KiBです。入力内容は保持されています。' : 'もう一度、完了条件を確認してください。入力内容は保持されています。';
    }
  } finally { if (pendingGrade === controller) { pendingGrade = null; $('#stop-code').hidden = true; waitForHost(); } }
});
$('#reset-code').addEventListener('click', () => {
  cancelGrade();
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
