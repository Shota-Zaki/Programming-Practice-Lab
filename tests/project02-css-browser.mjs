import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = resolve('docs'), output = process.env.EVIDENCE_DIR || 'evidence/2026-10-03-project02-css/browser';
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
const select = page => page.locator('[data-project-lesson="project02-css"]').click();
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
    await page.goto(origin + '/Programming-Practice-Lab/#project');
    const files = await page.evaluate(async () => (await import('./project-lessons.js')).project02Css.exampleFiles);
    for (const [name, source] of Object.entries(files)) await setFile(page, name, source);
    await setFile(page, 'app.js', 'window.CSS_LEARNER_RAN=true;while(true){}');
    const baseline = await page.evaluate(() => ({ old: JSON.parse(localStorage.getItem('ppl.foundation.progress.v1')).lessons, project01: localStorage.getItem('ppl.foundation.project01.progress.v1'), files: JSON.parse(localStorage.getItem('ppl.foundation.project.v1.profile')) }));
    await select(page);
    assert.equal(await page.locator('[data-project-lesson="project02-css"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#project-title').textContent(), '読みやすいレスポンシブCSS');
    assert.equal(await page.locator('#project-examples details').count(), 2);
    assert.match(await page.locator('#project-editor').inputValue(), /while\(true\)/);
    await inspect(page);
    assert.match(await page.locator('#project-result').textContent(), /静的CSS条件を確認できました.*project02全体は未完了/, JSON.stringify(await page.locator('#project-checks li').allTextContents()));
    assert.equal(await page.locator('#project-checks li').count(), 15);
    assert.equal(await page.locator('[data-course-progress]').first().textContent(), '0 / 24');
    assert.equal(await page.locator('#project-native').isDisabled(), true);
    assert.equal(await page.evaluate(() => window.CSS_LEARNER_RAN), undefined);
    assert.equal(await page.locator('#project-preview').getAttribute('sandbox'), '');
    const preview = page.frameLocator('#project-preview');
    await preview.locator('h1').waitFor();
    assert.equal(await preview.locator('script').count(), 0);
    await preview.locator('select#topic').focus(); await page.keyboard.press('Tab');
    assert.equal(await preview.locator('button#forget').evaluate(node => document.activeElement === node), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: `${output}/lesson-${width}.png`, fullPage: true });
    await page.locator('#project-preview').screenshot({ path: `${output}/preview-${width}.png` });
    const after = await page.evaluate(() => ({ old: JSON.parse(localStorage.getItem('ppl.foundation.progress.v1')).lessons, project01: localStorage.getItem('ppl.foundation.project01.progress.v1'), files: JSON.parse(localStorage.getItem('ppl.foundation.project.v1.profile')) }));
    assert.deepEqual(after, baseline);
    await page.locator('#project-export').click(); await page.locator('#project-downloads button').first().waitFor();
    assert.equal(await page.locator('#project-downloads button').count(), 5);
    await page.locator('[data-project-lesson="project01"]').click();
    assert.equal(await page.locator('#project-downloads button').count(), 0);
    await inspect(page);
    const completed = await page.evaluate(() => localStorage.getItem('ppl.foundation.project01.progress.v1'));
    await select(page); await inspect(page);
    assert.equal(await page.evaluate(() => localStorage.getItem('ppl.foundation.project01.progress.v1')), completed);
    assert.equal(await page.locator('[data-course-progress]').first().textContent(), '1 / 24');
    await setFile(page, 'styles.css', files['styles.css'] + '\nmain{width:800px}');
    assert.match(await page.locator('#project-result').textContent(), /未確認/);
    await inspect(page); assert.match(await page.locator('#project-result').textContent(), /未達成/);
    await setFile(page, 'styles.css', files['styles.css']);
    await page.evaluate(() => { document.querySelector('#project-inspect').click(); document.querySelector('[data-project-lesson="project01"]').click(); });
    assert.equal(await page.locator('#project-checks li').count(), 0);
    assert.equal(await page.locator('[data-project-parser]').count(), 0);
    await select(page); await page.reload();
    assert.equal(await page.locator('[data-project-lesson="project01"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#project-editor').inputValue(), files['styles.css']);
    await select(page);
    page.once('dialog', dialog => { assert.match(dialog.message(), /project01の開始コード/); return dialog.dismiss(); });
    await page.locator('#project-reset').click(); assert.equal(await page.locator('#project-editor').inputValue(), files['styles.css']);
    await page.evaluate(() => { document.querySelector('#project-inspect').click(); document.querySelector('#project-cancel').click(); });
    assert.equal(await page.locator('[data-project-parser]').count(), 0); assert.match(await page.locator('#project-result').textContent(), /未確認/);
    await inspect(page); await page.evaluate(() => { location.hash = 'course'; }); await page.locator('#course-title').waitFor();
    await page.evaluate(() => { location.hash = 'project'; }); await page.locator('#project-title').waitFor();
    assert.match(await page.locator('#project-result').textContent(), /未確認/);
    page.once('dialog', dialog => dialog.accept()); await page.locator('#project-reset').click();
    assert.equal(await page.locator('#project-editor').inputValue(), await page.evaluate(async () => (await import('./project-lessons.js')).project01.starterFiles['index.html']));
    assert.equal(await page.evaluate(() => localStorage.getItem('ppl.foundation.project01.progress.v1')), completed);
    assert.deepEqual(errors, []); assert.deepEqual(leaks, []);
    results.push({ width, case: 'shared-input/15-checks/unchanged-progress/no-JS/Tab/reload/reset/cancel/switch/move', pass: true });
    if (width === 375) {
      const grading = await page.evaluate(async () => {
        const { gradeProject02Css } = await import('./project-static.js'), { project02Css } = await import('./project-lessons.js');
        const base = project02Css.exampleFiles, results = [];
        for (const [name, css] of [
          ['outer-margin', 'body{padding:0}'], ['card-padding', 'main{padding:4px}'], ['oversize', 'main{width:900px;max-width:none}'],
          ['not-centered', '@media(min-width:768px){main{margin-left:0}}'], ['small-copy', 'p{font-size:12px}'], ['tight-lines', 'li{line-height:1}'],
          ['small-control', 'button{min-height:0;padding:0;font-size:12px}'], ['small-select', 'select{min-height:0;padding:0}'],
          ['hidden-overflow', 'main{overflow:hidden}'], ['clipped-height', 'main{height:80px;overflow:clip}'], ['nowrap', 'p{white-space:nowrap}'],
          ['tablet-only', '@media(min-width:768px){body{padding:0}}'], ['desktop-only', '@media(min-width:1280px){button{font-size:10px}}'],
          ['hidden-content', 'li{display:none}'], ['resource', 'body{background:url(https://example.invalid/leak)}'],
        ]) { const checks = (await gradeProject02Css({ ...base, 'styles.css': base['styles.css'] + css })).checks; results.push({ name, rejected: !checks.every(check => check.passed), failed: checks.filter(check => !check.passed).map(check => check.id) }); }
        const equivalent = base['styles.css'].replace('padding: 16px', 'padding: 1rem').replace('padding: 24px', 'padding: 1.5rem').replace('max-width: 720px', 'max-width: 45rem').replace('min-height: 44px', 'min-height: 2.75rem');
        results.push({ name: 'rem-equivalent', accepted: (await gradeProject02Css({ ...base, 'styles.css': equivalent })).checks.every(check => check.passed) });
        const long = base['index.html'].replace('HTML', '長い文章と単語'.repeat(40));
        results.push({ name: 'long-wrap', accepted: (await gradeProject02Css({ ...base, 'index.html': long })).checks.every(check => check.passed) });
        return results;
      });
      assert.ok(grading.every(row => row.accepted ?? row.rejected), JSON.stringify(grading));
      assert.deepEqual(leaks, []); results.push({ case: '15-wrong-CSS/2-equivalent-content/no-network', grading, pass: true });
    }
    await page.close();
  }
  for (const fault of ['denied', 'quota', 'corrupt']) {
    const page = await browser.newPage({ viewport: { width: 375, height: 900 } });
    await page.addInitScript(kind => {
      if (window !== window.top) return;
      const key = 'ppl.foundation.project.v1.profile';
      if (kind === 'corrupt') localStorage.setItem(key, '{bad');
      if (kind === 'denied') Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('denied', 'SecurityError'); } });
      if (kind === 'quota') { const original = Storage.prototype.setItem; Storage.prototype.setItem = function(name, value) { if (name === key) throw new DOMException('full', 'QuotaExceededError'); return original.call(this, name, value); }; }
    }, fault);
    await page.goto(origin + '/#project'); await select(page);
    const files = await page.evaluate(async () => (await import('./project-lessons.js')).project02Css.exampleFiles);
    for (const [name, source] of Object.entries(files)) await setFile(page, name, source);
    await inspect(page); assert.match(await page.locator('#project-result').textContent(), /静的CSS条件を確認できました/);
    assert.match(await page.locator('#project-save-status').textContent(), fault === 'corrupt' ? /読み取れません/ : /保存できません/);
    if (fault === 'corrupt') assert.equal(await page.evaluate(() => localStorage.getItem('ppl.foundation.project.v1.profile')), '{bad');
    results.push({ case: `controlled-storage-fault/${fault}`, pass: true }); await page.close();
  }
  await writeFile(`${output}/results.json`, JSON.stringify({ browser: browser.version(), results }, null, 2) + '\n');
  console.log(JSON.stringify({ result: 'PASS', browser: browser.version(), cases: results.length, negativeCases: 15, equivalentCases: 2 }));
} finally { await browser.close(); await new Promise(done => server.close(done)); }
