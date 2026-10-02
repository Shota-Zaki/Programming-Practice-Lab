import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = resolve('docs'), output = process.env.EVIDENCE_DIR || '/tmp/ppl-export-browser';
await mkdir(output, { recursive: true });
const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://local').pathname.replace(/^\/Programming-Practice-Lab\//, '/');
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(root + '/')) throw Error('path');
    res.setHeader('Content-Type', { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css' }[extname(file)] || 'text/plain');
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`, browser = await chromium.launch({ headless: true }), results = [];
const expectDownloads = async page => { await page.locator('#project-downloads button').first().waitFor(); assert.equal(await page.locator('#project-downloads button').count(), 5); };
const open = async page => { await page.goto(origin + '/Programming-Practice-Lab/#project'); await page.locator('#project-title').waitFor(); };
const setFile = async (page, name, text) => { await page.getByRole('tab', { name, exact: true }).click(); await page.locator('#project-editor').fill(text); };
try {
  for (const width of [375, 768, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', acceptDownloads: true });
    try {
      const page = await context.newPage(), errors = [], leaks = [], consoleErrors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
      await context.route('**/*', route => {
        const url = route.request().url();
        if ((url.startsWith('http') && !url.startsWith(origin + '/')) || url.includes('/leak')) { leaks.push(url); return route.abort(); }
        return route.continue();
      });
      await open(page);
      const starter = await page.evaluate(async () => (await import('./project-files.js')).STARTER_FILES);
      assert.equal(await page.getByRole('tab', { name: 'index.html', exact: true }).getAttribute('aria-selected'), 'true');
      await page.getByRole('tab', { name: 'index.html', exact: true }).focus(); await page.keyboard.press('ArrowRight');
      assert.equal(await page.getByRole('tab', { name: 'styles.css', exact: true }).evaluate(node => node === document.activeElement), true);
      await page.keyboard.press('End'); assert.equal(await page.locator('#project-editor').inputValue(), starter['app.js']);
      await page.keyboard.press('Tab'); assert.equal(await page.locator('#project-editor').evaluate(node => node === document.activeElement), true);
      const js = 'window.LEARNER_CODE_RAN=true;\n// 日本語🙂 <script></script> & \\" \\n\nwhile(true){}\n';
      await setFile(page, 'app.js', js);
      await setFile(page, 'index.html', starter['index.html'].replace('学習者の自己紹介', '日本語🙂の自己紹介'));
      await setFile(page, 'styles.css', starter['styles.css'] + 'p::after { content: "日本語🙂"; }\n');
      const expected = await page.evaluate(() => JSON.parse(localStorage.getItem('ppl.foundation.project.v1.profile')).files);
      const oldProgress = await page.evaluate(() => JSON.parse(localStorage.getItem('ppl.foundation.progress.v1')).lessons);
      await page.reload(); assert.equal(await page.locator('#project-editor').inputValue(), expected['styles.css']);
      await page.locator('#project-editor').press('Control+Enter'); await page.getByText(/静的確認を更新しました。JavaScript/).waitFor();
      await page.locator('#project-editor').press('Meta+Enter'); await page.getByText(/静的確認を更新しました。JavaScript/).waitFor();
      assert.equal(await page.locator('#project-checks li').count(), 6);
      assert.equal(await page.locator('#project-checks').textContent().then(text => text.includes('見直してください')), false);
      assert.equal(await page.locator('#project-preview').getAttribute('sandbox'), '');
      assert.equal(await page.locator('#project-native').isDisabled(), true);
      assert.equal(await page.evaluate(() => window.LEARNER_CODE_RAN), undefined);
      assert.equal(await page.frameLocator('#project-preview').locator('script').count(), 0);
      await page.frameLocator('#project-preview').locator('h1').waitFor();
      assert.equal(await page.frameLocator('#project-preview').locator('h1').textContent(), '学習者の自己紹介');
      assert.equal(await page.frameLocator('#project-preview').locator('p').first().evaluate(node => getComputedStyle(node, '::after').content), '"日本語🙂"');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      for (let repeat = 0; repeat < 2; repeat++) {
        await page.locator('#project-export').click(); await expectDownloads(page);
        const bundle = {};
        for (const name of ['index.html', 'styles.css', 'app.js', 'README.txt', 'manifest.json']) {
          const downloadEvent = page.waitForEvent('download');
          await page.getByRole('button', { name: `${name}を取得`, exact: true }).click();
          const download = await downloadEvent; assert.equal(download.suggestedFilename(), name);
          const content = await readFile(await download.path()); bundle[name] = content;
          if (Object.hasOwn(expected, name)) assert.deepEqual(content, Buffer.from(expected[name]));
          await writeFile(`${output}/export-${width}-${repeat}-${name}`, content);
        }
        const manifest = JSON.parse(bundle['manifest.json']);
        for (const file of manifest.files) {
          assert.equal(file.bytes, bundle[file.name].length);
          assert.equal(file.sha256, createHash('sha256').update(bundle[file.name]).digest('hex'));
        }
        assert.match(await page.locator('#project-action-status').textContent(), /保存完了を示しません/);
      }
      await page.screenshot({ path: `${output}/workspace-${width}.png`, fullPage: true });
      await page.locator('#project-preview').scrollIntoViewIfNeeded();
      await page.locator('#project-preview').screenshot({ path: `${output}/static-preview-${width}.png` });
      assert.deepEqual(consoleErrors, [], 'valid input must not emit CSP or application errors');
      const actionContrast = await page.locator('#project-inspect,#project-export,#project-reset').evaluateAll(buttons => {
        const luminance = color => {
          const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
          return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
        };
        return buttons.map(button => {
          const style = getComputedStyle(button), front = luminance(style.color), back = luminance(style.backgroundColor);
          return { id: button.id, contrast: (Math.max(front, back) + .05) / (Math.min(front, back) + .05), height: button.getBoundingClientRect().height };
        });
      });
      for (const button of actionContrast) { assert.ok(button.contrast >= 4.5, JSON.stringify(button)); assert.ok(button.height >= 44, JSON.stringify(button)); }
      results.push({ width, case: 'keyboard/restoration/static/native-disabled/real-downloads/repeat', pass: true });
      for (const expression of ['image-set("https://malicious.example.invalid/leak" 1x)', '-webkit-image-set("https://malicious.example.invalid/leak" 1x)', 'i\\6d age-set("https://malicious.example.invalid/leak" 1x)', 'var(--image)']) {
        await setFile(page, 'index.html', starter['index.html']);
        const variable = expression.startsWith('var(') ? '--image:i\\6d age-set("https://malicious.example.invalid/leak" 1x);' : '';
        await setFile(page, 'styles.css', `body{${variable}background-image:${expression}}`);
        await page.locator('#project-inspect').click(); await page.getByText(/静的確認を更新しました。JavaScript/).waitFor();
        assert.match(await page.locator('#project-checks li').last().textContent(), /見直してください/);
        assert.equal(await page.frameLocator('#project-preview').locator('body').evaluate(node => getComputedStyle(node).backgroundImage), 'none');
      }
      results.push({ width, case: 'image-set-string-url/prefixed/escaped-function', pass: true });
      const hostile = starter['index.html'].replace('</head>', '<base href="https://malicious.example.invalid/leak"><meta http-equiv="refresh" content="0;url=https://malicious.example.invalid/leak"></head>')
        .replace('</main>', '<img src="https://malicious.example.invalid/leak" onerror="parent.LEARNER_CODE_RAN=true"><iframe src="' + origin + '/leak"></iframe><svg onload="alert(1)"></svg><a href="https://malicious.example.invalid/leak" onclick="alert(1)">外部</a></main>');
      await setFile(page, 'index.html', hostile);
      await setFile(page, 'styles.css', '@import "https://malicious.example.invalid/leak";\nbody{background-image:url("' + origin + '/leak")} p::after{content:"</style><meta http-equiv=refresh>"}');
      await page.locator('#project-inspect').click(); await page.getByText(/静的確認を更新しました。JavaScript/).waitFor();
      assert.match(await page.locator('#project-checks').textContent(), /見直してください/);
      assert.equal(await page.frameLocator('#project-preview').locator('script,iframe,img,svg,base,meta[http-equiv="refresh"],a[href],[onclick]').count(), 0);
      assert.deepEqual(leaks, []); assert.equal(await page.evaluate(() => window.LEARNER_CODE_RAN), undefined);
      results.push({ width, case: 'hostile-markup/css/no-network/no-code-evaluation', pass: true });
      await setFile(page, 'index.html', '<p>x</p>'.repeat(2001));
      await page.locator('#project-inspect').click(); await page.getByText(/静的確認できませんでした.*2000/).waitFor();
      assert.equal(await page.locator('#project-editor').inputValue(), '<p>x</p>'.repeat(2001));
      await setFile(page, 'app.js', 'あ'.repeat(10923)); await page.locator('#project-export').click();
      await page.getByText(/書き出せませんでした.*32KiB/).waitFor(); assert.equal(await page.locator('#project-downloads button').count(), 0);
      assert.equal(await page.locator('#project-editor').inputValue(), 'あ'.repeat(10923));
      results.push({ width, case: 'node-limit/utf8-limit/retain-errors', pass: true });
      const parserCancel = await page.evaluate(async () => {
        const { inspectProjectFiles } = await import('./project-static.js');
        const { STARTER_FILES } = await import('./project-files.js');
        const controller = new AbortController(); const job = inspectProjectFiles(STARTER_FILES, { signal: controller.signal }); controller.abort();
        try { await job; return false; } catch (error) { return error.name === 'AbortError' && document.querySelectorAll('[data-project-parser]').length === 0; }
      });
      assert.equal(parserCancel, true); results.push({ width, case: 'parser-immediate-abort/cleanup', pass: true });
      for (const name of Object.keys(starter)) await setFile(page, name, starter[name]);
      for (const action of ['edit', 'cancel', 'move', 'reset']) {
        await page.evaluate(() => {
          const original = crypto.subtle.digest.bind(crypto.subtle);
          let release; const gate = new Promise(resolve => { release = resolve; });
          window.qaReleaseDigest = () => { crypto.subtle.digest = original; release(); };
          crypto.subtle.digest = async (...args) => { await gate; return original(...args); };
        });
        await page.locator('#project-export').click(); await page.locator('#project-cancel').waitFor();
        if (action === 'edit') await page.locator('#project-editor').fill('// changed during digest\n');
        else if (action === 'cancel') await page.locator('#project-cancel').click();
        else if (action === 'move') { await page.evaluate(() => { location.hash = 'course'; }); await page.locator('#course-title').waitFor(); }
        else { page.once('dialog', dialog => dialog.accept()); await page.locator('#project-reset').click(); }
        await page.evaluate(() => window.qaReleaseDigest());
        if (action === 'move') await page.locator('.curriculum [data-view="project"]').click();
        await page.waitForFunction(() => !document.querySelector('#project-export').disabled);
        assert.equal(await page.locator('#project-downloads button').count(), 0);
        results.push({ width, case: `controlled-digest-interruption/${action}`, pass: true });
      }
      await setFile(page, 'app.js', '// retain on cancelled reset\n');
      page.once('dialog', dialog => dialog.dismiss()); await page.locator('#project-reset').click();
      assert.equal(await page.locator('#project-editor').inputValue(), '// retain on cancelled reset\n');
      page.once('dialog', dialog => dialog.accept()); await page.locator('#project-reset').click();
      for (const name of Object.keys(starter)) { await page.getByRole('tab', { name, exact: true }).click(); assert.equal(await page.locator('#project-editor').inputValue(), starter[name]); }
      await page.locator('#project-export').click(); await expectDownloads(page);
      await page.evaluate(() => { location.hash = 'course'; }); await page.locator('#course-title').waitFor();
      await page.locator('.curriculum [data-view="project"]').click(); assert.equal(await page.locator('#project-downloads button').count(), 0);
      assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ppl.foundation.progress.v1')).lessons), oldProgress);
      assert.equal(await page.locator('#lesson-picker [data-lesson]').count(), 21);
      assert.equal(await page.locator('[data-project-parser]').count(), 0);
      assert.deepEqual(errors, []); assert.deepEqual(leaks, []);
      results.push({ width, case: 'reset-confirmation/prepared-cancel/old-progress/cleanup', pass: true, consoleErrors });
    } finally { await context.close(); }
  }
  for (const fault of ['denied', 'quota', 'corrupt', 'digest']) {
    const context = await browser.newContext({ viewport: { width: 375, height: 900 }, reducedMotion: 'reduce' });
    try {
      const page = await context.newPage();
      await page.addInitScript(kind => {
        const key = 'ppl.foundation.project.v1.profile';
        if (kind === 'corrupt') localStorage.setItem(key, '{broken');
        if (kind === 'denied') Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('denied', 'SecurityError'); } });
        if (kind === 'quota') { const original = Storage.prototype.setItem; Storage.prototype.setItem = function(name, value) { if (name === key) throw new DOMException('full', 'QuotaExceededError'); return original.call(this, name, value); }; }
        if (kind === 'digest') crypto.subtle.digest = async () => { throw Error('controlled digest failure'); };
      }, fault);
      await open(page); await setFile(page, 'app.js', '// keep fault input 日本語🙂\n');
      if (fault === 'corrupt') assert.equal(await page.evaluate(() => localStorage.getItem('ppl.foundation.project.v1.profile')), '{broken');
      if (fault === 'digest') { await page.locator('#project-export').click(); await page.getByText(/書き出せませんでした.*controlled digest failure/).waitFor(); }
      else assert.match(await page.locator('#project-save-status').textContent(), /保存できません|保存データを読み取れません/);
      assert.equal(await page.locator('#project-editor').inputValue(), '// keep fault input 日本語🙂\n');
      results.push({ width: 375, case: `controlled-fault/${fault}`, pass: true });
    } finally { await context.close(); }
  }
  await writeFile(`${output}/results.json`, JSON.stringify({ browser: browser.version(), observations: results.length, results }, null, 2) + '\n');
  console.log(JSON.stringify({ result: 'PASS', browser: browser.version(), observations: results.length }));
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
