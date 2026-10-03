import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=resolve('docs'),evidence=process.env.EVIDENCE_DIR||'evidence/2026-10-03-grading-adapter/browser';
await mkdir(evidence,{recursive:true});
const server=createServer(async(req,res)=>{try{const name=new URL(req.url,'http://local').pathname.replace(/^\/Programming-Practice-Lab\//,'/');const file=resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+sep))throw Error();res.setHeader('Content-Type',{'.js':'text/javascript','.html':'text/html','.css':'text/css'}[extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch({headless:true}),results=[];
try {
  for(const width of [375,768,1280]) {
    const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage(),errors=[],external=[];
    page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',route=>{const url=route.request().url();if(url.startsWith(origin)||url.startsWith('data:'))return route.continue();external.push(url);return route.abort();});
    await page.goto(origin+'/Programming-Practice-Lab/');
    const catalog=await page.evaluate(async()=>{
      const {lessonCatalog,lessons}=await import('./lessons.js');const {toLegacyLesson}=await import('./lesson-format.js');
      return {count:lessonCatalog.length,versions:lessonCatalog.every(l=>l.version===1),exactViews:JSON.stringify(lessonCatalog.map(toLegacyLesson))===JSON.stringify(lessons),modes:lessonCatalog.map(l=>l.exercise.mode)};
    });
    assert.equal(catalog.count,21);assert.equal(catalog.versions,true);assert.equal(catalog.exactViews,true);
    assert.deepEqual(catalog.modes,[...Array(7).fill('html'),...Array(8).fill('css'),...Array(3).fill('javascript'),...Array(3).fill('dom')]);
    const seed=await page.evaluate(async()=>{
      const {lessons}=await import('./lessons.js');
      const records={};for(const id of ['html03','css01','js01','js04']){const lesson=lessons.find(l=>l.id===id);records[id]={code:lesson.example,checkedCode:id==='js04'?'stale old code':lesson.example,attempts:7,completed:true,result:lesson.completionTests.map(t=>({id:t.id,passed:true,...(id.startsWith('js')?{actual:String(t.expected),expected:String(t.expected)}:{})}))};}
      localStorage.setItem('ppl.foundation.progress.v1',JSON.stringify({version:1,lessonId:'css01',view:'practice',lessons:records}));localStorage.setItem('ppl.profile.v1.topic','css');localStorage.setItem('unrelated','keep');history.replaceState(null,'','#practice');return records;
    });
    await page.reload();
    const record=id=>page.evaluate(id=>JSON.parse(localStorage.getItem('ppl.foundation.progress.v1')).lessons[id],id);
    assert.deepEqual(await record('css01'),seed.css01);assert.deepEqual(await record('html03'),seed.html03);assert.deepEqual(await record('js04'),seed.js04);
    assert.equal(await page.locator('#result-title').textContent(),'演習を完了しました');
    await page.locator('#check-code').click();await page.getByText('演習を完了しました',{exact:true}).waitFor();
    assert.equal((await record('css01')).attempts,8);
    const cssExample=seed.css01.code;
    const expected=await page.evaluate(async code=>{const {lessons}=await import('./lessons.js');return (await import('./css-grading.js')).gradeCss(code,lessons.find(l=>l.id==='css01'));},cssExample);
    assert.deepEqual((await record('css01')).result,expected);
    // Delay trusted CSS result delivery. No learner code is evaluated by this test hook.
    await page.evaluate(()=>{
      window.__nativeChannel=window.MessageChannel;window.__gateMode='hold';window.__deliveries=[];
      window.MessageChannel=function(){const channel=new window.__nativeChannel(),port=channel.port1,descriptor=Object.getOwnPropertyDescriptor(MessagePort.prototype,'onmessage');let listener;
        Object.defineProperty(port,'onmessage',{configurable:true,get(){return listener;},set(fn){listener=fn;descriptor.set.call(port,event=>{if(window.__gateMode==='hold'){window.__deliveries.push(()=>fn(event));return;}fn(event);});}});return channel;};
    });
    const waitDelivery=()=>page.waitForFunction(()=>window.__deliveries.length>0);
    const release=()=>page.evaluate(()=>window.__deliveries.splice(0).forEach(deliver=>deliver()));
    await page.locator('#check-code').click();await waitDelivery();
    await page.locator('#editor').fill(cssExample+'\n/* interrupted */');
    assert.equal(await page.locator('#result-status').textContent(),'未確認');
    await page.locator('#editor').fill(cssExample);await page.locator('#check-code').click();
    await page.waitForFunction(()=>window.__deliveries.length===2);
    await page.evaluate(()=>window.__deliveries.shift()());
    assert.equal(await page.locator('#result-title').textContent(),'完了条件を確認しています');assert.equal((await record('css01')).attempts,8);
    await release();await page.getByText('演習を完了しました',{exact:true}).waitFor();assert.equal((await record('css01')).attempts,9);
    for(const action of ['reset','lesson','view','reload']) {
      await page.locator('#editor').fill(cssExample);await page.locator('#check-code').click();await waitDelivery();
      if(action==='reset')await page.locator('#reset-code').click();
      if(action==='lesson')await page.evaluate(()=>document.querySelector('[data-lesson="css02"]').click());
      if(action==='view')await page.evaluate(()=>document.querySelector('[data-view="course"]').click());
      if(action==='reload'){await page.reload();}else await release();
      assert.equal((await record('css01')).attempts,9);assert.equal((await record('css01')).completed,true);
      if(action==='reload')break;
      await page.evaluate(()=>document.querySelector('[data-lesson="css01"]').click());await page.locator('#lesson-content [data-view="practice"]').click();
    }
    assert.equal(await page.locator('#check-code').isEnabled(),true);assert.equal(await page.locator('#result-status').textContent(),'未確認');
    // Synthetic trusted dependency returns a foreign condition ID; the real UI adapter/save guard must refuse it.
    // The unchanged dependency is exercised before and after this fault injection.
    const dependency=await readFile(resolve(root,'css-grading.js'),'utf8');
    assert.ok(dependency.includes('return lesson.completionTests.map((test,i) => ({id:test.id'));
    await page.route('**/css-grading.js',route=>route.fulfill({contentType:'text/javascript',body:dependency.replace('return lesson.completionTests.map((test,i) => ({id:test.id','return lesson.completionTests.map((test,i) => ({id:"foreign-condition"')}));
    await page.reload();
    await page.locator('#editor').fill(cssExample);await page.locator('#check-code').click();await page.getByText('確認できませんでした',{exact:true}).waitFor();
    assert.equal((await record('css01')).attempts,9);assert.equal((await record('css01')).result,null);assert.equal((await record('css01')).completed,true);
    await page.unroute('**/css-grading.js');await page.reload();await page.locator('#check-code').click();await page.getByText('演習を完了しました',{exact:true}).waitFor();
    assert.equal((await record('css01')).attempts,10);assert.deepEqual((await record('css01')).result,expected);
    await page.evaluate(()=>document.querySelector('[data-lesson="js04"]').click());await page.locator('#lesson-content [data-view="practice"]').click();
    assert.equal(await page.locator('#result-status').textContent(),'未確認');assert.equal((await record('js04')).completed,true);
    await page.locator('#run-preview').click();await page.getByText('演習を完了しました',{exact:true}).waitFor();assert.equal((await record('js04')).attempts,8);
    const persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('ppl.foundation.progress.v1')));
    assert.equal(persisted.version,1);assert.equal(Object.values(persisted.lessons).some(row=>'runId' in row||'mode' in row||'version' in row),false);
    assert.deepEqual(persisted.lessons.html03,seed.html03);assert.deepEqual(persisted.lessons.js01,seed.js01);
    assert.equal(await page.evaluate(()=>localStorage.getItem('ppl.profile.v1.topic')),'css');assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated')),'keep');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
    await page.screenshot({path:resolve(evidence,`legacy-and-retry-${width}.png`),fullPage:true});
    results.push({width,commonCatalog:catalog,oldV1:true,staleSavedResultHidden:true,exactCssRows:true,sameCodeRetry:true,interruptions:['edit','reset','lesson','view','reload'],syntheticGraderMismatchRefused:true,domRetry:true,noEnvelopePersisted:true,nativeKeyUnchanged:true,noOverflow:true,errors,external});
    await context.close();
  }
  // Real numerical Worker stop/retry retains the existing host cleanup reservation.
  const page=await browser.newPage();await page.goto(origin);
  await page.locator('.hero [data-view="lesson"]').click();await page.locator('#lesson-picker [data-lesson="js01"]').click();await page.locator('#lesson-content [data-view="practice"]').click();
  await page.locator('#editor').fill('while(true){}');await page.locator('#run-preview').click();await page.locator('#stop-code').click();
  assert.equal(await page.locator('#result-title').textContent(),'実行を停止しました');assert.match(await page.locator('#attempts').textContent(),/0回/);
  await page.locator('#check-code').waitFor({state:'visible'});await page.waitForFunction(()=>!document.querySelector('#check-code').disabled);
  const example=await page.evaluate(async()=> (await import('/lessons.js')).lessons.find(l=>l.id==='js01').example);
  await page.locator('#editor').fill(example);await page.locator('#run-preview').click();await page.getByText('演習を完了しました',{exact:true}).waitFor();assert.match(await page.locator('#attempts').textContent(),/1回/);
  await page.close();
  await writeFile(resolve(evidence,'results.json'),JSON.stringify({results,numericStopRetry:true},null,2)+'\n');console.log(JSON.stringify({results,numericStopRetry:true}));
} finally {await browser.close();await new Promise(r=>server.close(r));}
