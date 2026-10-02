import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=resolve('docs'),evidence='evidence/2026-10-02-javascript';await mkdir(evidence,{recursive:true});
let prohibitedRequests=0;
const server=createServer(async(req,res)=>{
 if(req.url.startsWith('/blocked'))prohibitedRequests++;
 try{let url=new URL(req.url,'http://local').pathname;url=url.replace(/^\/Programming-Practice-Lab\//,'/');const path=resolve(root,'.'+(url==='/'?'/index.html':url));if(!path.startsWith(root+'/'))throw Error();const body=await readFile(path);res.setHeader('Content-Type',{'.js':'text/javascript','.css':'text/css','.html':'text/html'}[extname(path)]||'text/plain');res.end(body)}catch{res.writeHead(404);res.end()}
});server.on('upgrade',(_,socket)=>{prohibitedRequests++;socket.destroy()});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;const browser=await chromium.launch({headless:true});const results={};
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(origin+'/Programming-Practice-Lab/');
 results.semantic=await page.evaluate(async()=>{
  const {lessons}=await import('./lessons.js');const {gradeJavaScript:grade}=await import('./javascript-grading.js');const {javascriptHostReady}=await import('./javascript-host.js');const gradeJavaScript=async(...args)=>{await javascriptHostReady();return grade(...args)};const js=lessons.filter(l=>l.language==='javascript'&&l.executionMode!=='dom');const checks=[];
  for(const lesson of js){const result=await gradeJavaScript(lesson.example,lesson);if(!result.every(r=>r.passed))throw Error(lesson.id+JSON.stringify(result));checks.push({id:lesson.id,example:true,starter:(await gradeJavaScript(lesson.starterCode,lesson)).every(r=>r.passed)})}
  const wrong=[['js01','const total=300;'],['js01','const total="300";'],['js01','const total=NaN;'],['js01','const total=Infinity;'],['js01','const total={valueOf:()=>300};'],['js02','let total=0;for(const score of scores)if(score>60)total+=score;'],['js02','let total=0;for(const score of scores)total+=score;'],['js03','function priceAfterTax(){return 110;}'],['js03','function priceAfterTax(price,rate){console.log(price+price*rate);}']];
  for(const [id,code]of wrong){const lesson=js.find(l=>l.id===id);if((await gradeJavaScript(code,lesson)).every(r=>r.passed))throw Error('Wrong accepted '+code)}
  if(!(await gradeJavaScript('function priceAfterTax(price,rate){return price*(1+rate)}',js[2])).every(r=>r.passed))throw Error('floating point equivalent rejected');
  return {checks,wrongRejected:wrong.length};
 });
 console.log('semantic checks complete');assert(results.semantic.checks.every(r=>!r.starter));
 results.capabilities=await page.evaluate(async(origin)=>{
  const {gradeJavaScript:grade}=await import('./javascript-grading.js');const {javascriptHostReady}=await import('./javascript-host.js');const gradeJavaScript=async(...args)=>{await javascriptHostReady();return grade(...args)};const probe={parameters:[],returnExpression:'probe()',completionTests:[{id:'capabilities',inputs:[],expected:511}]};
  const code=`async function probe(){let flags=[];flags.push(typeof document==='undefined',typeof localStorage==='undefined',typeof Worker==='undefined',typeof SharedWorker==='undefined');try{indexedDB.open('ppl-parent');flags.push(false)}catch(e){flags.push(e.name==='SecurityError')}if(typeof caches==='undefined')flags.push(true);else try{await caches.open('ppl-parent');flags.push(false)}catch(e){flags.push(e.name==='SecurityError')}try{await fetch(${JSON.stringify(origin+'/blocked-fetch')},{method:'POST',body:'should-not-leave'});flags.push(false)}catch{flags.push(true)}flags.push(await new Promise(resolve=>{try{const socket=new WebSocket(${JSON.stringify(origin.replace('http:','ws:')+'/blocked-ws')});socket.onopen=()=>{socket.close();resolve(false)};socket.onerror=()=>resolve(true)}catch{resolve(true)}}));try{importScripts(${JSON.stringify(origin+'/blocked.js')});flags.push(false)}catch{flags.push(true)}return flags.reduce((n,b,i)=>n+(b?2**i:0),0)}`;
  const tested=await gradeJavaScript(code,probe);if(!tested.every(r=>r.passed))throw Error(JSON.stringify(tested));
  const forgery=await gradeJavaScript(`try{DedicatedWorkerGlobalScope.prototype.postMessage.call(self,{token:'guess',values:[{type:'number',value:511}]})}catch{}function probe(){return 0}`,probe);if(forgery.every(r=>r.passed))throw Error('forged result accepted');
  const escaped=await gradeJavaScript('function probe(){return "<img src=x onerror=parent.compromised=true>"}',probe);if(escaped.every(r=>r.passed))throw Error('HTML accepted');
  return {opaqueOriginStorageDenied:true,noDOM:true,noNetwork:true,noWorkerConstructors:true,forgeryRejected:true,htmlRejected:true};
 },origin);
 console.log('capability checks complete');assert.equal(prohibitedRequests,0);
 results.lifecycle=await page.evaluate(async()=>{
  const {lessons}=await import('./lessons.js');const {gradeJavaScript:grade}=await import('./javascript-grading.js');const {javascriptHostReady}=await import('./javascript-host.js');const gradeJavaScript=async(...args)=>{await javascriptHostReady();return grade(...args)};const lesson=lessons.find(l=>l.id==='js01');
  let responsive=false;setTimeout(()=>{responsive=true},20);let timeout=false;try{await gradeJavaScript('while(true){}',lesson,{timeoutMs:150})}catch(e){timeout=e.message.includes('timed out')}
  if(!timeout||!responsive)throw Error('timeout/main responsiveness');
  await javascriptHostReady();const controller=new AbortController();const pending=gradeJavaScript('while(true){}',lesson,{signal:controller.signal});setTimeout(()=>controller.abort(),100);let cancelled=false;try{await pending}catch(e){cancelled=e.name==='AbortError'}if(!cancelled)throw Error('cancel');
  await javascriptHostReady();const late=new AbortController();const old=gradeJavaScript('const total=new Promise(r=>setTimeout(()=>r(300),300))',lesson,{signal:late.signal});setTimeout(()=>late.abort(),80);try{await old}catch(e){if(e.name!=='AbortError')throw e}
  await javascriptHostReady();const early=new AbortController();const append=document.body.append;document.body.append=function(...nodes){const result=append.apply(this,nodes);if(nodes.some(n=>n?.hasAttribute?.('data-javascript-host')))early.abort();return result};
  try{await gradeJavaScript(lesson.example,lesson,{signal:early.signal});throw Error('early cancellation accepted')}catch(e){if(e.name!=='AbortError')throw e}finally{document.body.append=append}
  const retry=await gradeJavaScript(lesson.example,lesson);if(!retry.every(r=>r.passed))throw Error('retry');
  let oversized=false;try{await gradeJavaScript('x'.repeat(32769),lesson)}catch{oversized=true}if(!oversized)throw Error('size');
  await javascriptHostReady();return {timeout,responsive,cancelled,retry:true,earlyCancel:true,oversized,frames:document.querySelectorAll('[data-javascript-host]').length};
 });assert.equal(results.lifecycle.frames,0);
 const cdp=await browser.newBrowserCDPSession();results.rapid={samples:[],noQueue:true,slotBound:1};
 for(const mode of ['cancel','timeout','cancel','timeout']){
  const sample=await page.evaluate(async(mode)=>{
   const {lessons}=await import('./lessons.js');const {gradeJavaScript}=await import('./javascript-grading.js');const {javascriptHostReady}=await import('./javascript-host.js');const lesson=lessons.find(l=>l.id==='js01');
   await javascriptHostReady();const controller=new AbortController();const start=performance.now();const run=gradeJavaScript('while(true){}',lesson,{signal:controller.signal,timeoutMs:150});if(mode==='cancel')setTimeout(()=>controller.abort(),50);
   try{await run;throw Error('runaway passed')}catch(e){if(mode==='cancel' ? e.name!=='AbortError' : !e.message.includes('timed out'))throw e}
   const responseMs=performance.now()-start;if(responseMs>500)throw Error('response deadline delayed by shutdown grace');
   let rejected=0;for(let i=0;i<32;i++)try{await gradeJavaScript(lesson.example,lesson)}catch(e){if(!e.message.includes('still stopping'))throw e;rejected++}
   const frames=document.querySelectorAll('[data-javascript-host]').length;if(frames>1)throw Error('host backlog');return {mode,responseMs,rejected,frames};
  },mode);
  const respondedAt=Date.now();await page.waitForTimeout(400);sample.workersAt400msAfterResponse=page.workers().length;
  while((await cdp.send('Target.getTargets')).targetInfos.some(t=>t.type==='worker')&&Date.now()-respondedAt<5000)await page.waitForTimeout(100);
  assert.equal((await cdp.send('Target.getTargets')).targetInfos.filter(t=>t.type==='worker').length,0,'Worker did not terminate within observed 5-second window');
  assert.equal(page.workers().length,0);sample.targetGoneMsAfterResponse=Date.now()-respondedAt;
  await page.evaluate(async()=>await (await import('./javascript-host.js')).javascriptHostReady());results.rapid.samples.push(sample);
 }
 const before=(await cdp.send('SystemInfo.getProcessInfo')).processInfo;await page.waitForTimeout(500);const after=(await cdp.send('SystemInfo.getProcessInfo')).processInfo;
 results.postGraceRendererCpuSeconds=after.filter(p=>p.type==='renderer').reduce((sum,p)=>sum+Math.max(0,p.cpuTime-(before.find(b=>b.id===p.id)?.cpuTime??p.cpuTime)),0);
 assert(results.postGraceRendererCpuSeconds<0.05,'Task-owned renderer remains busy after Worker target closes');
 assert.deepEqual(errors,[]);results.workerLeaks=0;await page.close();
 for(const width of [375,768,1280]){
  const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const failures=[];p.on('pageerror',e=>failures.push(e.message));await p.goto(origin+'/Programming-Practice-Lab/');await p.locator('.hero [data-view="lesson"]').click();
  const lessons=await p.evaluate(async()=> (await import('./lessons.js')).lessons.filter(l=>l.language==='javascript'&&l.executionMode!=='dom'));
  for(const lesson of lessons){if(await p.locator('[data-view-panel=practice]').isVisible())await p.locator('.practice-head [data-view=lesson]').click();await p.locator(`#lesson-picker [data-lesson="${lesson.id}"]`).click();await p.locator('#lesson-content [data-view="practice"]').click();await p.locator('#editor').fill(lesson.example);await p.locator('#run-preview').click();await p.getByText('演習を完了しました',{exact:true}).waitFor();assert.equal(await p.locator('#preview').isVisible(),false);assert.match(await p.locator('#execution-output').textContent(),/number:/);await p.reload();await p.getByText('演習を完了しました',{exact:true}).waitFor();assert.equal(await p.locator('#editor').inputValue(),lesson.example);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await p.screenshot({path:`${evidence}/${lesson.id}-${width}.png`,fullPage:true})}
  await p.locator('#editor').fill('function priceAfterTax(){return "<img src=x onerror=parent.compromised=true>"}');await p.locator('#run-preview').click();await p.getByText('未達成の条件があります',{exact:true}).waitFor();assert.match(await p.locator('#execution-output').textContent(),/<img src=x/);assert.equal(await p.locator('#execution-output img').count(),0);
  await p.locator('#reset-code').click();assert.equal(await p.locator('#editor').inputValue(),lessons[2].starterCode);assert.equal(await p.locator('#result-status').textContent(),'未確認');
  await p.locator('#editor').fill('while(true){}');await p.locator('#run-preview').click();await p.locator('#stop-code').click();await p.getByText('実行を停止しました',{exact:true}).waitFor();assert.equal(await p.locator('#check-code').isEnabled(),false);await p.locator('#check-code').waitFor({state:'visible'});await p.locator('[data-javascript-host]').waitFor({state:'detached'});
  await p.locator('#run-preview').click();await p.locator('#editor').fill(lessons[2].example+'\n// changed while running');await p.waitForTimeout(200);assert.equal(await p.locator('#result-status').textContent(),'未確認');await p.locator('[data-javascript-host]').waitFor({state:'detached'});
  await p.locator('#editor').fill(lessons[2].example);await p.locator('#run-preview').click();await p.getByText('演習を完了しました',{exact:true}).waitFor();await p.locator('#editor').fill('while(true){}');await p.locator('#run-preview').click();await p.locator('.practice-head [data-view=lesson]').click();await p.locator('#lesson-picker [data-lesson="html01"]').click();await p.locator('[data-javascript-host]').waitFor({state:'detached'});await p.waitForTimeout(200);await p.locator('#lesson-content [data-view="practice"]').click();assert.equal(await p.locator('#preview').isVisible(),true);assert.equal(await p.locator('#execution-output').isVisible(),false);assert.deepEqual(failures,[]);results['ui'+width]={lessons:3,restore:true,stop:true,inputCancel:true,navigationCancel:true,htmlPreviewPreserved:true,htmlOutputEscaped:true,reset:true};console.log('UI '+width+' complete');await p.close();
 }
 await writeFile(evidence+'/javascript-results.json',JSON.stringify({origin,browser:browser.version(),results},null,2)+'\n');console.log(JSON.stringify(results,null,2));
}finally{await browser.close();await new Promise(r=>server.close(r))}
