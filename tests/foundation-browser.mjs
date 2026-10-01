import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
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
try {
  for (const width of [375,768,1280]) {
    const page = await browser.newPage({viewport:{width,height:900}});
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin);
    const lessons = await page.evaluate(async()=> (await import('/lessons.js')).lessons);
    await page.locator('.hero [data-view="lesson"]').click();
    for (let i=0;i<4;i++) {
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
      await page.screenshot({path:`evidence/2026-10-01/practice-${width}-${i+1}.png`,fullPage:true});
      await page.locator('#next-lesson').click();
    }
    assert.equal(await page.locator('.course-side [data-chapter-progress]').textContent(),'4 / 4');
    await page.locator('.course-hero [data-view="lesson"]').click();
    await page.locator('[data-lesson="html01"]').click();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true);
    await page.screenshot({path:`evidence/2026-10-01/lesson-${width}.png`,fullPage:true});
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
    assert.deepEqual(errors,[]);results.push({width,lessons:4,reload:true,reset:true,noOverflow:true,errors});await page.close();
  }
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
  console.log(JSON.stringify({results,legacyMigration:true,corruptStorage:true,deniedStorage:true},null,2));
} finally { await browser.close();await new Promise(r=>server.close(r)); }
