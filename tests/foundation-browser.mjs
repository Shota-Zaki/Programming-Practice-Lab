import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = resolve('docs');
const server = createServer(async (req,res) => {
  try { const path = resolve(root, '.' + (req.url === '/' ? '/index.html' : req.url)); if (!path.startsWith(root + '/')) throw Error(); const body = await readFile(path); res.setHeader('Content-Type', {'.js':'text/javascript','.html':'text/html','.css':'text/css'}[extname(path)] || 'text/plain'); res.end(body); } catch {res.writeHead(404);res.end();}
});
await new Promise(r => server.listen(0,'127.0.0.1',r));
const browser = await chromium.launch({headless:true});
const origin = `http://127.0.0.1:${server.address().port}`;
const results = [];
await mkdir('evidence/2026-10-02', {recursive:true});
try {
  for (const width of [375,768,1280]) {
    const page = await browser.newPage({viewport:{width,height:900}});
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin);
    const lessons = await page.evaluate(async()=> (await import('/lessons.js')).lessons);
    await page.locator('.hero [data-view="lesson"]').click();
    for (let i=0;i<7;i++) {
      await page.locator('#lesson-content [data-view="practice"]').click();
      await page.locator('#check-code').click();
      assert.match(await page.locator('#result-title').textContent(),/未達成/);
      await page.locator('#editor').fill(lessons[i].example);
      await page.locator('#check-code').click();
      assert.equal(await page.locator('#result-title').textContent(),'演習を完了しました');
      assert.match(await page.locator('#attempts').textContent(),/2回/);
      await page.reload();
      assert.equal(await page.locator('#editor').inputValue(),lessons[i].example);
      assert.equal(await page.locator('#result-title').textContent(),'演習を完了しました');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true);
      await page.frameLocator('#preview').locator('h1').waitFor({state:'visible'});
      await page.screenshot({path:`evidence/2026-10-02/practice-${width}-${i+1}.png`,fullPage:true});
      await page.locator('#next-lesson').click();
    }
    assert.equal(await page.locator('.course-side [data-chapter-progress]').textContent(),'3 / 3');
    assert.equal(await page.locator('.course-side [data-course-progress]').textContent(),'7 / 24');
    await page.locator('.course-hero [data-lesson="html01"]').click();
    assert.equal(await page.locator('.toc [data-chapter-progress]').textContent(),'4 / 4');
    await page.locator('#lesson-picker [data-lesson="html01"]').click();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true);
    await page.screenshot({path:`evidence/2026-10-02/lesson-${width}.png`,fullPage:true});
    await page.locator('#lesson-content [data-view="practice"]').click();
    await page.locator('#editor').fill('<p>changed</p>');
    assert.equal(await page.locator('#result-status').textContent(),'未確認');
    await page.reload();
    assert.equal(await page.locator('#result-status').textContent(),'未確認');
    await page.locator('#reset-code').click();
    assert.equal(await page.locator('#editor').inputValue(),lessons[0].starterCode);
    assert.match(await page.locator('#attempts').textContent(),/2回.*完了履歴あり/);
    await page.locator('#editor').focus(); await page.keyboard.press('Tab');
    assert.equal(await page.locator('#run-preview').evaluate(e=>document.activeElement===e),true);
    const checks=await page.evaluate(async()=>{
      const {gradeHtml}=await import('/grading.js');const {lessons}=await import('/lessons.js');
      return [gradeHtml('<!-- <!doctype html> --><title>T</title><h1>X</h1><p>P</p>',lessons[0].completionTests)[0].passed,gradeHtml(lessons[1].example.replace('</body>','<p id="intro">duplicate</p></body>'),lessons[1].completionTests).at(-1).passed];
    });
    assert.deepEqual(checks,[false,false]);
    assert.deepEqual(errors,[]);results.push({width,lessons:7,reload:true,reset:true,noOverflow:true,errors});await page.close();
  }
  const grading = await browser.newPage(); await grading.goto(origin);
  const matrix = await grading.evaluate(async () => {
    const {gradeHtml} = await import('/grading.js'); const {lessons} = await import('/lessons.js');
    const check = (index, code, id) => gradeHtml(code, lessons[index].completionTests).find(r => r.id === id).passed;
    const structure = lessons[4].example, media = lessons[5].example, form = lessons[6].example;
    return {
      extraMain: check(4, structure.replace('</body>', '<main>extra</main></body>'), 'main'),
      outsideHeading: check(4, structure.replace('<h2>HTMLの役割</h2>', '').replace('</main>', '<h2>outside</h2></main>'), 'section'),
      divSection: check(4, structure.replaceAll('section', 'div'), 'section'),
      emptyItems: check(5, media.replace('<li>読書</li><li>絵を描くこと</li>', '<li> </li><li> </li>'), 'unordered'),
      oneItemEach: check(5, media.replace('<ul><li>読書</li><li>絵を描くこと</li></ul>', '<ul><li>A</li></ul><ul><li>B</li></ul>'), 'unordered'),
      missingTarget: check(5, media.replace('href="#steps"','href="#missing"'), 'link'),
      duplicateTarget: check(5, media.replace('</body>', '<p id="steps">duplicate</p></body>'), 'link'),
      emptyLink: check(5, media.replace('学習手順へ</a>', ' </a>'), 'link'),
      badFragment: check(5, media.replace('href="#steps"','href="#%zz"'), 'link'),
      emptyAlt: check(5, media.replace('alt="学習計画を表す青いノート"','alt=" "'), 'image'),
      foreignImage: check(5, media.replace(/src="[^"]+"/, 'src="https://example.invalid/image.png"'), 'image'),
      missingLabel: check(6, form.replace('<label for="email">メールアドレス</label>', ''), 'emailInput'),
      mismatchedLabel: check(6, form.replace('for="email"','for="other"'), 'emailInput'),
      duplicateControlId: check(6, form.replace('</body>', '<p id="email">duplicate</p></body>'), 'emailInput'),
      duplicateName: check(6, form.replace('name="email"','name="nickname"'), 'form'),
      missingRequired: check(6, form.replaceAll(' required',''), 'form'),
      disabledControl: check(6, form.replace('type="email"','type="email" disabled'), 'form'),
      disabledGroup: check(6, form.replace('<form>', '<form><fieldset disabled>').replace('</form>', '</fieldset></form>'), 'form'),
      externalOwner: check(6, form.replace('type="email"', 'type="email" form="other"'), 'form'),
      splitForms: check(6, form.replace('<label for="email">', '</form><form><label for="email">'), 'form'),
      wrongButton: check(6, form.replace('type="submit"','type="button"'), 'form'),
      blankButton: check(6, form.replace('内容を送信</button>',' </button>'), 'form'),
      examples: lessons.map(l => gradeHtml(l.example, l.completionTests).every(r => r.passed)),
      starters: lessons.map(l => gradeHtml(l.starterCode, l.completionTests).every(r => r.passed)),
    };
  });
  assert.deepEqual(matrix.examples, Array(7).fill(true));
  assert.deepEqual(matrix.starters, Array(7).fill(false));
  for (const [name, passed] of Object.entries(matrix)) if (!['examples','starters'].includes(name)) assert.equal(passed, false, name);
  assert.equal(await grading.locator('#preview').getAttribute('sandbox'), '');
  assert.match(await grading.locator('#preview').getAttribute('srcdoc'), /form-action 'none'/);
  // Old v1 records remain intact when newly added lesson IDs are initialized.
  await grading.evaluate(async () => {
    const {lessons} = await import('/lessons.js'); const {STATE_KEY} = await import('/progress.js');
    localStorage.setItem(STATE_KEY, JSON.stringify({version:1, lessonId:'html03', view:'practice', lessons:{html03:{code:lessons[2].example, attempts:9, completed:true}}}));
    history.replaceState(null, '', '#practice');
  });
  await grading.reload();
  assert.match(await grading.locator('#attempts').textContent(), /9回.*完了履歴あり/);
  await grading.goto(origin + '/#lesson');
  await grading.locator('#lesson-picker [data-lesson="html05"]').click();
  assert.equal(await grading.locator('.toc [data-chapter-progress]').textContent(),'0 / 3');
  assert.equal(await grading.locator('#lesson-picker [data-lesson="html03"]').textContent(),'3. 見出しと段落 ✓ 完了');
  await grading.locator('#lesson-picker [data-lesson="html06"]').click();
  await grading.locator('#lesson-content [data-view="practice"]').click();
  const imageExample = await grading.evaluate(async () => (await import('/lessons.js')).lessons[5].example);
  await grading.locator('#editor').fill(imageExample); await grading.locator('#run-preview').click();
  const preview = grading.frameLocator('#preview');
  await preview.locator('img').waitFor();
  assert.equal(await preview.locator('img').evaluate(img => img.complete && img.naturalWidth > 0), true);
  await grading.close();
  const legacy=await browser.newPage();await legacy.goto(origin);
  await legacy.evaluate(()=>{localStorage.clear();localStorage.setItem('ppl.foundation.html01','<p>legacy</p>');localStorage.setItem('ppl.foundation.view','practice');});
  await legacy.reload(); assert.equal(await legacy.locator('#editor').inputValue(),'<p>legacy</p>'); await legacy.close();
  for (const mode of ['corrupt','denied']) {
    const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(mode=>{if(window.top!==window)return;if(mode==='denied'){Object.defineProperty(window,'localStorage',{get(){throw Error('denied')}});}else localStorage.setItem('ppl.foundation.progress.v1','{broken');},mode);
    await page.goto(origin);await page.locator('.hero [data-view="lesson"]').click();await page.locator('#lesson-content [data-view="practice"]').click();await page.locator('#check-code').click();
    if(mode==='denied')assert.match(await page.locator('#save-status').textContent(),/保存できません/);
    assert.deepEqual(errors,[]);await page.close();
  }
  console.log(JSON.stringify({results,gradingRegressions:22,oldV1Upgrade:true,inlineImage:true,legacyMigration:true,corruptStorage:true,deniedStorage:true},null,2));
} finally { await browser.close();await new Promise(r=>server.close(r)); }
