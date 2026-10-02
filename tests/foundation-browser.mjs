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
const evidenceDirectory = process.env.EVIDENCE_DIR || 'evidence/2026-10-02-javascript/regression';
await mkdir(evidenceDirectory, {recursive:true});
try {
  for (const width of [375,768,1280]) {
    const page = await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin);
    const lessons = await page.evaluate(async()=> (await import('/lessons.js')).lessons);
    await page.locator('.hero [data-view="lesson"]').click();
    for (let i=0;i<lessons.length;i++) {
      await page.locator('#lesson-content [data-view="practice"]').click();
      await page.locator('#check-code').click();
      await page.getByText('未達成の条件があります', {exact:true}).waitFor();
      await page.locator('#editor').fill(lessons[i].example);
      await page.locator('#check-code').click();
      await page.getByText('演習を完了しました', {exact:true}).waitFor();
      assert.match(await page.locator('#attempts').textContent(),/2回/);
      await page.reload();
      assert.equal(await page.locator('#editor').inputValue(),lessons[i].example);
      await page.getByText('演習を完了しました', {exact:true}).waitFor();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true);
      if (lessons[i].language !== 'javascript') await page.frameLocator('#preview').locator('h1').waitFor({state:'visible'});
      await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:`${evidenceDirectory}/practice-${width}-${i+1}.png`,fullPage:true});
      if (i === 14) {
        for (const previewWidth of ['375','599','600','899','900','1280']) {
          const navigation = page.waitForEvent('framenavigated',{predicate:frame=>frame.parentFrame()===page.mainFrame() && frame.url()==='about:srcdoc'});
          await page.locator('#preview-width').selectOption(previewWidth);
          await navigation;
          await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
          await page.frameLocator('#preview').locator('h1').waitFor();
          const outerWidth = await page.locator('#preview').evaluate(frame=>({width:frame.getBoundingClientRect().width,style:frame.style.width}));
          const layout = await page.frameLocator('#preview').locator('.cards').evaluate(node => ({columns:new Set([...node.children].map(c=>Math.round(c.getBoundingClientRect().left))).size,width:innerWidth}));
          assert.equal(layout.width,Number(previewWidth),JSON.stringify({outerWidth,layout,previewWidth}));
          assert.equal(layout.columns,Number(previewWidth)<600?1:Number(previewWidth)<900?2:3);
          assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true);
        }
        const navigation = page.waitForEvent('framenavigated',{predicate:frame=>frame.parentFrame()===page.mainFrame() && frame.url()==='about:srcdoc'});
        await page.locator('#preview-width').selectOption(String(width));
        await navigation;
        await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        await page.frameLocator('#preview').locator('h1').waitFor();
        await page.locator('#preview').screenshot({path:`${evidenceDirectory}/preview-${width}.png`});
      }
      await page.locator('#next-lesson').click();
    }
    assert.equal(await page.locator('.course-side [data-chapter-progress]').textContent(),'3 / 3');
    assert.equal(await page.locator('.course-side [data-course-progress]').textContent(),'18 / 24');
    await page.locator('.course-hero [data-lesson="html01"]').click();
    assert.equal(await page.locator('.toc [data-chapter-progress]').textContent(),'4 / 4');
    await page.locator('#lesson-picker [data-lesson="html01"]').click();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true);
    await page.screenshot({path:`${evidenceDirectory}/lesson-${width}.png`,fullPage:true});
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
    assert.deepEqual(errors,[]);results.push({width,lessons:18,reload:true,reset:true,noOverflow:true,errors});await page.close();
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
      examples: lessons.slice(0,7).map(l => gradeHtml(l.example, l.completionTests).every(r => r.passed)),
      starters: lessons.slice(0,7).map(l => gradeHtml(l.starterCode, l.completionTests).every(r => r.passed)),
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
  const cssPage = await browser.newPage(); await cssPage.goto(origin);
  const external = []; await cssPage.route('https://example.invalid/**', route => { external.push(route.request().url()); return route.abort(); });
  const cssChecks = await cssPage.evaluate(async () => {
    const {gradeCss} = await import('/css-grading.js'); const {lessons} = await import('/lessons.js');
    const css = lessons.filter(l => l.language === 'css').slice(0,4);
    const all = async (code, l) => (await gradeCss(code, l)).every(r => r.passed);
    const examples = [], starters = [];
    for (const l of css) { examples.push(await all(l.example,l)); starters.push(await all(l.starterCode,l)); }
    const wrong = [];
    wrong.push(await all(css[0].example.replace('.intro', '.missing'), css[0]));
    wrong.push(await all(css[0].example.replace('font-size: 32px;', ''), css[0]));
    wrong.push(await all(css[0].example + '\np {font-size:20px}', css[0]));
    wrong.push(await all(css[1].example + '\n.card {color:red !important}', css[1]));
    wrong.push(await all(css[1].example.replace('1.5','1.5px'), css[1]));
    wrong.push(await all(css[2].example + '\n.card {padding-left:0}', css[2]));
    wrong.push(await all(css[2].example.replace('margin: 16px','margin: 24px'), css[2]));
    wrong.push(await all(css[3].example.replace('border-box','content-box'), css[3]));
    wrong.push(await all(css[3].example.replace('solid','dashed'), css[3]));
    wrong.push(await all(css[3].example + '\n.card {border-right-width:0}', css[3]));
    const equivalent = await all(css[1].example.replace('#14532d','rgb(20, 83, 45)').replace('#f0fdf4','rgb(240, 253, 244)').replace('1.5','27px'), css[1]);
    const important = await all(css[1].example.replace('color: #14532d','color: #14532d !important') + '\n.card {color:red}', css[1]);
    const injected = css[1].example + '\n</style><script>parent.__cssEscape = true</script><img src="https://example.invalid/leak" onerror="parent.__cssEscape=true">';
    await gradeCss(injected, css[1]);
    await gradeCss('@import url("https://example.invalid/import");\n' + css[1].example + '\n.card {background-image:url("https://example.invalid/image")}', css[1]);
    const controller = new AbortController(); const pending = gradeCss(css[0].example, css[0], {signal:controller.signal}); controller.abort();
    let cancelled = false, timedOut = false;
    try { await pending; } catch (e) { cancelled = e.name === 'AbortError'; }
    try { await gradeCss(css[0].example, css[0], {timeoutMs:0}); } catch { timedOut = true; }
    return {examples,starters,wrong,equivalent,important,cancelled,timedOut,noEscape:!window.__cssEscape,frames:document.querySelectorAll('iframe[title="CSS採点"]').length};
  });
  assert.deepEqual(cssChecks.examples, Array(4).fill(true)); assert.deepEqual(cssChecks.starters, Array(4).fill(false));
  assert.deepEqual(cssChecks.wrong, Array(10).fill(false));
  for (const key of ['equivalent','important','cancelled','timedOut','noEscape']) assert.equal(cssChecks[key],true,key);
  assert.equal(cssChecks.frames,0); assert.deepEqual(external,[]);
  await cssPage.goto(origin + '/#lesson'); await cssPage.locator('#lesson-picker [data-lesson="css01"]').click();
  await cssPage.locator('#lesson-content [data-view="practice"]').click();
  const firstCss = await cssPage.evaluate(async()=> (await import('/lessons.js')).lessons.find(l=>l.id==='css01').example);
  await cssPage.locator('#editor').fill(firstCss);
  await cssPage.evaluate(() => { document.querySelector('#check-code').click(); const editor = document.querySelector('#editor'); editor.value = '.intro {}'; editor.dispatchEvent(new Event('input',{bubbles:true})); });
  assert.equal(await cssPage.locator('#result-status').textContent(),'未確認');
  assert.equal(await cssPage.locator('#check-code').isEnabled(),true);
  await cssPage.reload(); assert.equal(await cssPage.locator('#editor').inputValue(),'.intro {}');
  assert.match(await cssPage.locator('#attempts').textContent(),/0回/);
  await cssPage.locator('#editor').fill(firstCss);
  await cssPage.evaluate(() => { document.querySelector('#check-code').click(); document.querySelector('#lesson-picker [data-lesson="css02"]').click(); });
  await cssPage.locator('#lesson-content [data-view="practice"]').click();
  assert.equal(await cssPage.locator('#result-status').textContent(),'未確認');
  assert.match(await cssPage.locator('#attempts').textContent(),/0回/);
  const secondCss = await cssPage.evaluate(async()=> (await import('/lessons.js')).lessons.find(l=>l.id==='css02').example);
  await cssPage.locator('#editor').fill(secondCss);
  await cssPage.evaluate(() => {
    window.originalAppend = document.body.append;
    document.body.append = function(...nodes) { if (nodes.some(n => n.title === 'CSS採点')) return; return window.originalAppend.apply(this,nodes); };
  });
  await cssPage.locator('#check-code').click();
  await cssPage.getByText('確認できませんでした',{exact:true}).waitFor();
  assert.equal(await cssPage.locator('#check-code').isEnabled(),true);
  assert.equal(await cssPage.locator('#editor').inputValue(),secondCss);
  assert.match(await cssPage.locator('#attempts').textContent(),/0回/);
  await cssPage.evaluate(() => { document.body.append = window.originalAppend; delete window.originalAppend; });
  await cssPage.locator('#check-code').click();
  await cssPage.getByText('演習を完了しました',{exact:true}).waitFor();
  assert.match(await cssPage.locator('#attempts').textContent(),/1回/);
  await cssPage.evaluate(() => { document.querySelector('#check-code').click(); document.querySelector('#reset-code').click(); });
  assert.equal(await cssPage.locator('#result-status').textContent(),'未確認');
  assert.match(await cssPage.locator('#attempts').textContent(),/1回/);
  await cssPage.close();
  const layoutPage = await browser.newPage(); await layoutPage.goto(origin);
  const layoutChecks = await layoutPage.evaluate(async () => {
    const {gradeCss} = await import('/css-grading.js'); const {lessons} = await import('/lessons.js');
    const chapters = lessons.filter(l=>l.chapterId==='css-chapter04');
    const all = async (code, lesson) => (await gradeCss(code,lesson)).every(r=>r.passed);
    const examples = [],starters = [];
    for (const lesson of chapters) { examples.push(await all(lesson.example,lesson)); starters.push(await all(lesson.starterCode,lesson)); }
    const [flex,grid,media,combined] = chapters;
    const wrong = [];
    wrong.push(await all(flex.example.replace('direction: row','direction: column'),flex));
    wrong.push(await all(flex.example.replace('.links','.links span'),flex));
    wrong.push(await all(flex.example+'\n.links span:last-child {display:none}',flex));
    wrong.push(await all(grid.example.replace('repeat(2, 1fr)','1fr 2fr'),grid));
    wrong.push(await all(grid.example+'\n.tile {display:none}',grid));
    wrong.push(await all(grid.example+'\n.cards {opacity:0}',grid));
    wrong.push(await all(grid.example+'\n.tile {position:absolute}',grid));
    wrong.push(await all(media.example.replace('600px','601px'),media));
    wrong.push(await all(media.example.replace('min-width','max-width'),media));
    wrong.push(await all(media.example+'\n.cards {width:900px}',media));
    wrong.push(await all(media.example+'\n.cards {grid-template-columns:repeat(2,1fr)}',media));
    wrong.push(await all(combined.example.replace('900px','901px'),combined));
    wrong.push(await all(combined.example.replace('max-width: 960px','width: 960px'),combined));
    wrong.push(await all(combined.example+'\n.page {opacity:0}',combined));
    wrong.push(await all(combined.example+'\n.tile {min-width:900px}\n.page {overflow:hidden}',combined));
    const equivalent = await all(grid.example.replace('repeat(2, 1fr)','1fr 1fr'),grid);
    const onlyWide = media.example+'\n@media (max-width:599px) {.cards {grid-template-columns:repeat(2,1fr)}}';
    const aggregate = await gradeCss(onlyWide,media);
    const widthsReported = [375,599,600,768,1280].every(width=>aggregate.every(row=>row.actual.includes(`${width}px:`)));
    const controller = new AbortController(); const originalAppend = document.body.append; let count=0;
    document.body.append = function(...nodes) { if(nodes.some(n=>n.title==='CSS採点') && ++count===2) controller.abort(); return originalAppend.apply(this,nodes); };
    let cancelled=false;
    try { await gradeCss(combined.example,combined,{signal:controller.signal}); } catch(e) { cancelled=e.name==='AbortError'; } finally {document.body.append=originalAppend;}
    // The abort during append can happen before attachment; adapters must still remove that frame.
    await new Promise(resolve=>setTimeout(resolve,0));
    return {examples,starters,wrong,equivalent,widthsReported,aggregateFailed:!aggregate.every(r=>r.passed),cancelled,framesStarted:count,framesLeft:document.querySelectorAll('iframe[title="CSS採点"]').length};
  });
  assert.deepEqual(layoutChecks.examples,Array(4).fill(true)); assert.deepEqual(layoutChecks.starters,Array(4).fill(false));
  assert.deepEqual(layoutChecks.wrong,Array(15).fill(false));
  for (const key of ['equivalent','widthsReported','aggregateFailed','cancelled']) assert.equal(layoutChecks[key],true,key);
  assert.equal(layoutChecks.framesStarted,2); assert.equal(layoutChecks.framesLeft,0);
  await layoutPage.close();
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
  console.log(JSON.stringify({results,layoutChecks,cssChecks,cssExternalRequests:external,cssUiCancellation:true,cssUiTimeoutRetry:true,gradingRegressions:22,oldV1Upgrade:true,inlineImage:true,legacyMigration:true,corruptStorage:true,deniedStorage:true},null,2));
} finally { await browser.close();await new Promise(r=>server.close(r)); }
