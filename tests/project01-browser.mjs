import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = resolve('docs'), output = process.env.EVIDENCE_DIR || 'evidence/2026-10-03-project01/lesson';
await mkdir(output, { recursive: true });
const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://local').pathname.replace(/^\/Programming-Practice-Lab\//, '/');
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(root + sep)) throw Error('path');
    res.setHeader('Content-Type', { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css' }[extname(file)] || 'text/plain');
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`, browser = await chromium.launch({ headless: true }), results = [];
const setFile = async (page, name, code) => { await page.getByRole('tab', { name, exact: true }).click(); await page.locator('#project-editor').fill(code); };
const inspect = async page => { await page.locator('#project-inspect').click(); await page.getByText(/静的確認を更新しました。JavaScript/).waitFor(); };
try {
  for (const width of [375, 768, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' }), errors = [], leaks = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => {
      const url = route.request().url();
      if ((url.startsWith('http') && !url.startsWith(origin + '/')) || url.includes('/leak')) { leaks.push(url); return route.abort(); }
      return route.continue();
    });
    page.setDefaultTimeout(10000);
    await page.goto(origin + '/Programming-Practice-Lab/#course');
    await page.locator('.curriculum [data-view="project"]').click();
    await page.locator('#project-title').waitFor();
    assert.match(await page.locator('#project-lesson-content').textContent(), /第6章.*限定API/);
    assert.equal(await page.locator('#project-examples details').count(), 3);
    assert.match(await page.locator('#project-editor').inputValue(), /<title><\/title>/);
    await inspect(page);
    assert.match(await page.locator('#project-result').textContent(), /未達成/);
    assert.match(await page.locator('#project-history').textContent(), /1回.*未完了.*0 \/ 3/);
    const example = await page.evaluate(async () => (await import('./project-lessons.js')).project01.exampleFiles);
    const old = await page.evaluate(() => JSON.parse(localStorage.getItem('ppl.foundation.progress.v1')).lessons);
    for (const name of Object.keys(example)) await setFile(page, name, example[name]);
    await setFile(page, 'app.js', 'window.PROJECT01_LEARNER_RAN=true; while(true){}');
    await inspect(page);
    assert.match(await page.locator('#project-result').textContent(), /project01の構造を完了/);
    assert.equal(await page.locator('[data-course-progress]').first().textContent(), '1 / 24');
    assert.match(await page.locator('#project-history').textContent(), /2回.*完了履歴あり.*1 \/ 3/);
    assert.equal(await page.locator('#project-native').isDisabled(), true);
    assert.equal(await page.locator('#project-preview').getAttribute('sandbox'), '');
    assert.equal(await page.evaluate(() => window.PROJECT01_LEARNER_RAN), undefined);
    const preview = page.frameLocator('#project-preview');
    await preview.locator('h1').waitFor();
    assert.equal(await preview.locator('script').count(), 0);
    await preview.locator('select#topic').focus(); await page.keyboard.press('Tab');
    assert.equal(await preview.locator('button#forget').evaluate(node => document.activeElement === node), true);
    await preview.locator('label').click();
    assert.equal(await preview.locator('select#topic').evaluate(node => document.activeElement === node), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: `${output}/lesson-${width}.png`, fullPage: true });
    await page.locator('#project-preview').screenshot({ path: `${output}/preview-${width}.png` });
    await page.reload(); await page.locator('#project-title').waitFor();
    assert.match(await page.locator('#project-result').textContent(), /未確認/);
    assert.match(await page.locator('#project-history').textContent(), /2回.*完了履歴あり/);
    assert.match(await page.locator('#project-editor').inputValue(), /while\(true\)/);
    await setFile(page, 'index.html', example['index.html'].replace('<h1>', '<h1 hidden>'));
    await inspect(page); assert.match(await page.locator('#project-result').textContent(), /未達成/);
    assert.match(await page.locator('#project-history').textContent(), /完了履歴あり/);
    await page.evaluate(() => { location.hash = 'course'; }); await page.locator('#course-title').waitFor();
    await page.evaluate(() => { location.hash = 'lesson'; }); await page.locator('#lesson-title').waitFor();
    await page.locator('#lesson-picker [data-view="project"]').click();
    assert.match(await page.locator('#project-result').textContent(), /未確認/);
    page.once('dialog', dialog => dialog.dismiss()); await page.locator('#project-reset-history').click();
    assert.match(await page.locator('#project-history').textContent(), /完了履歴あり/);
    page.once('dialog', dialog => dialog.accept()); await page.locator('#project-reset-history').click();
    assert.match(await page.locator('#project-history').textContent(), /0回.*未完了/);
    assert.match(await page.locator('#project-editor').inputValue(), /<h1 hidden>/);
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ppl.foundation.progress.v1')).lessons), old);
    assert.equal(await page.locator('#lesson-picker [data-lesson]').count(), 21);
    assert.deepEqual(errors, []); assert.deepEqual(leaks, []);
    results.push({ width, case: 'starter/example/native-disabled/Tab/label/reload/history/edit/move/reset/legacy', pass: true });
    if (width === 375) {
      const grading = await page.evaluate(async () => {
        const { gradeProject01 } = await import('./project-static.js');
        const { project01 } = await import('./project-lessons.js');
        const base = project01.exampleFiles;
        const mutations = [
          ['title', html => html.replace(/<title>.*?<\/title>/, '<title></title>')],
          ['language', html => html.replace('lang="ja"', 'lang=""')],
          ['main', html => html.replace('<main>', '<div>').replace('</main>', '</div>')],
          ['intro', html => html.replace(/<p>.*?<\/p>/, '<p></p>')],
          ['list', html => html.replace(/<li>.*?<\/li>/, '')],
          ['label', html => html.replace('for="topic"', 'for="other"')],
          ['duplicate', html => html.replace('</main>', '<div id="topic"></div></main>')],
          ['disabled', html => html.replace('id="topic"', 'id="topic" disabled')],
          ['negative-tab', html => html.replace('id="topic"', 'id="topic" tabindex="-1"')],
          ['inert', html => html.replace('<main>', '<main inert>')],
          ['option', html => html.replace('value="html"', 'value="other"')],
          ['option-disabled', html => html.replace('value="css"', 'value="css" disabled')],
          ['message', html => html.replace('id="topic-message"', 'id="other"')],
          ['initial-message', html => html.replace('id="topic-message">未選択', 'id="topic-message">完了')],
          ['hidden-second-list-item', html => html.replace('<li>操作', '<li hidden>操作')],
          ['forget', html => html.replace('type="button"', 'type="submit"')],
          ['css-ref', html => html.replace('./styles.css', '/styles.css')],
          ['js-ref', html => html.replace(' defer', '')],
          ['async', html => html.replace(' defer', ' defer async')],
          ['inline-js', html => html.replace('</script>', 'alert(1)</script>')],
          ['resource', html => html.replace('</main>', '<img src="https://example.invalid/leak"></main>')],
        ];
        const results = [];
        for (const [name, mutate] of mutations) results.push({ name, rejected: !(await gradeProject01({ ...base, 'index.html': mutate(base['index.html']) })).checks.every(check => check.passed) });
        for (const css of ['h1{display:none}', 'select{visibility:hidden}', 'button{opacity:0}', '@media(min-width:768px){#topic{display:none}}', 'main{position:absolute;left:-9999px}', 'body{background-image:url(https://example.invalid/leak)}']) {
          results.push({ name: css, rejected: !(await gradeProject01({ ...base, 'styles.css': base['styles.css'] + css })).checks.every(check => check.passed) });
        }
        const controller = new AbortController();
        const pending = gradeProject01(base, { signal: controller.signal }); controller.abort();
        let cancelled = false; try { await pending; } catch (error) { cancelled = error.name === 'AbortError'; }
        return { results, cancelled, frames: document.querySelectorAll('[data-project-parser]').length };
      });
      assert.equal(grading.results.length, 27);
      assert.ok(grading.results.every(result => result.rejected), JSON.stringify(grading));
      assert.equal(grading.cancelled, true); assert.equal(grading.frames, 0);
      assert.deepEqual(leaks, []); results.push({ case: '27-semantic-wrong-answers/cancel/no-network', ...grading, pass: true });
    }
    await page.close();
  }
  for (const fault of ['denied', 'quota', 'corrupt']) {
    const page = await browser.newPage({ viewport: { width: 375, height: 900 } });
    await page.addInitScript(kind => {
      if (window !== window.top) return;
      const key = 'ppl.foundation.project01.progress.v1';
      if (kind === 'corrupt') localStorage.setItem(key, '{bad');
      if (kind === 'denied') Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('denied', 'SecurityError'); } });
      if (kind === 'quota') { const original = Storage.prototype.setItem; Storage.prototype.setItem = function(name, value) { if (name === key) throw new DOMException('full', 'QuotaExceededError'); return original.call(this, name, value); }; }
    }, fault);
    await page.goto(origin + '/#project');
    const example = await page.evaluate(async () => (await import('./project-lessons.js')).project01.exampleFiles);
    for (const name of Object.keys(example)) await setFile(page, name, example[name]);
    await inspect(page); assert.match(await page.locator('#project-result').textContent(), /構造を完了/);
    assert.match(await page.locator('#project-progress-save').textContent(), fault === 'corrupt' ? /履歴を読み取れません/ : /履歴を保存できません/);
    if (fault === 'corrupt') {
      assert.equal(await page.evaluate(() => localStorage.getItem('ppl.foundation.project01.progress.v1')), '{bad');
      page.once('dialog', dialog => dialog.accept()); await page.locator('#project-reset-history').click();
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('ppl.foundation.project01.progress.v1')).completed), false);
    }
    results.push({ case: `controlled-storage-fault/${fault}`, pass: true }); await page.close();
  }
  await writeFile(`${output}/results.json`, JSON.stringify({ browser: browser.version(), results }, null, 2) + '\n');
  console.log(JSON.stringify({ result: 'PASS', browser: browser.version(), cases: results.length, negativeCases: 27 }));
} finally { await browser.close(); await new Promise(done => server.close(done)); }
