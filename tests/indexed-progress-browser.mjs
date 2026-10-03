import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import assert from 'node:assert/strict';
import { readFoundationState, discardTestProgress } from './progress-browser-tools.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=resolve('docs'), evidence=process.env.EVIDENCE_DIR || 'evidence/2026-10-03-indexeddb/browser';
await mkdir(evidence,{recursive:true});
const server=createServer(async(req,res)=>{try{const name=new URL(req.url,'http://local').pathname.replace(/^\/Programming-Practice-Lab\//,'/');const path=resolve(root,'.'+(name==='/'?'/index.html':name));if(!path.startsWith(root+sep))throw Error();res.setHeader('Content-Type',{'.js':'text/javascript','.html':'text/html','.css':'text/css'}[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`, url=origin+'/Programming-Practice-Lab/', browser=await chromium.launch({headless:true}), results=[], contexts=[];
const saved=page=>page.waitForFunction(()=>document.querySelector('#save-status')?.dataset.state==='saved');
const failed=page=>page.waitForFunction(()=>document.querySelector('#save-status')?.dataset.state==='error');
const raw=page=>page.evaluate(()=>({legacy:localStorage.getItem('ppl.foundation.progress.v1'),single:localStorage.getItem('ppl.foundation.html01'),view:localStorage.getItem('ppl.foundation.view'),topic:localStorage.getItem('ppl.profile.v1.topic'),unrelated:localStorage.getItem('unrelated')}));
const record=page=>page.evaluate(()=>new Promise((resolve,reject)=>{
  const request=indexedDB.open('ppl.foundation.progress',1);request.onerror=()=>reject(request.error);
  request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>db.close();const tx=db.transaction('records'),read=tx.objectStore('records').get('foundation');tx.oncomplete=()=>{db.close();resolve(read.result??null)};tx.onabort=()=>{db.close();reject(tx.error)};};
}));
async function session({width=1280,fault='',single=false,corrupt=false,waitReady=true}={}) {
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});contexts.push(context);
  await context.addInitScript(({fault,single,corrupt})=>{
    if(window.top!==window)return;
    if(!localStorage.getItem('qa-seeded')) {
      localStorage.setItem('qa-seeded','1');localStorage.setItem('ppl.profile.v1.topic','css');localStorage.setItem('unrelated','keep');
      if(single){localStorage.setItem('ppl.foundation.html01','<p>old single input</p>');localStorage.setItem('ppl.foundation.view','practice');}
      else localStorage.setItem('ppl.foundation.progress.v1',corrupt?'{broken':JSON.stringify({version:1,lessonId:'html03',view:'practice',lessons:{html03:{code:'<h1>Preserved old input</h1>',attempts:9,completed:true,result:null,checkedCode:'old checked snapshot'},js04:{code:'old DOM draft',attempts:4,completed:true,result:null,checkedCode:null}}}));
    }
    fault=localStorage.getItem('qa-next-fault')||fault;
    window.__dbFault=fault;window.__dbAcks=[];window.__holdDbAcks=fault==='startup-held';
    const put=IDBObjectStore.prototype.put, transaction=IDBDatabase.prototype.transaction;
    IDBObjectStore.prototype.put=function(...args){
      if(this.transaction.db.name==='ppl.foundation.progress') {
        if(window.__dbFault==='quota')throw new DOMException('synthetic quota','QuotaExceededError');
        if(window.__dbFault==='refusal')throw new DOMException('synthetic refusal','SecurityError');
        const request=put.apply(this,args);
        if(window.__dbFault==='abort')request.addEventListener('success',()=>this.transaction.abort());
        return request;
      }
      return put.apply(this,args);
    };
    IDBDatabase.prototype.transaction=function(...args){if(this.name==='ppl.foundation.progress'&&args[1]==='readwrite'&&window.__dbFault==='transaction')throw new DOMException('synthetic transaction refusal','SecurityError');return transaction.apply(this,args);};
    const get=IDBObjectStore.prototype.get;
    IDBObjectStore.prototype.get=function(...args){const request=get.apply(this,args);if(this.transaction.db.name==='ppl.foundation.progress'&&this.transaction.mode==='readwrite'&&window.__dbFault==='timeout'){const keepAlive=()=>{const next=get.apply(this,args);next.onsuccess=()=>{if(window.__dbFault==='timeout')keepAlive();};};request.addEventListener('success',keepAlive);}return request;};
    const complete=Object.getOwnPropertyDescriptor(IDBTransaction.prototype,'oncomplete');
    Object.defineProperty(IDBTransaction.prototype,'oncomplete',{configurable:true,get:complete.get,set(listener){complete.set.call(this,function(event){if(this.db.name==='ppl.foundation.progress'&&this.mode==='readwrite'&&window.__holdDbAcks){window.__dbAcks.push(()=>listener.call(this,event));}else listener.call(this,event);});}});
    if(fault==='unavailable')Object.defineProperty(window,'indexedDB',{get(){throw new DOMException('synthetic unavailable','SecurityError')}});
    if(fault==='open-refusal')IDBFactory.prototype.open=function(){throw new DOMException('synthetic open refusal','SecurityError')};
    if(fault==='legacy-refusal')Object.defineProperty(window,'localStorage',{get(){throw new DOMException('synthetic legacy refusal','SecurityError')}});
  },{fault,single,corrupt});
  const page=await context.newPage(),errors=[],external=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/*',route=>{const target=route.request().url();if(target.startsWith(origin)||target.startsWith('data:'))return route.continue();external.push(target);return route.abort();});
  await page.goto(url+'#practice');
  try { if(waitReady){await page.locator('#editor').waitFor();await page.waitForFunction(()=>!document.querySelector('#editor').disabled);} }
  catch (error) { await writeFile(`${evidence}/session-failure.json`,JSON.stringify({fault,width,errors,url:page.url(),status:await page.locator('#save-status').textContent(),body:await page.locator('body').innerText()},null,2));throw error; }
  return {context,page,errors,external};
}
try {
  {
    const {context,page}=await session({fault:'startup-held',waitReady:false});
    await page.waitForFunction(()=>window.__dbAcks.length===1&&document.querySelector('#editor').disabled);
    const before=await raw(page);assert.match(await page.locator('#view-kicker').textContent(),/復元/);
    await page.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide'));window.__holdDbAcks=false;window.__dbAcks.shift()();});
    await page.waitForTimeout(100);assert.equal(await page.locator('#editor').isDisabled(),true);assert.notEqual(await page.locator('#save-status').getAttribute('data-state'),'saved');assert.deepEqual(await raw(page),before);
    results.push({case:'pagehide during initial migration rejects late bootstrap and saved indication',syntheticDelivery:true,passed:true});await context.close();
  }
  for(const width of [375,768,1280]) {
    const {context,page,errors,external}=await session({width});await saved(page);
    const legacy=await raw(page), first=await record(page);
    assert.equal(first.revision,1);assert.equal(first.state.lessons.html03.code,'<h1>Preserved old input</h1>');assert.equal(first.state.lessons.html03.attempts,9);assert.equal(first.state.lessons.html03.completed,true);assert.equal(first.state.lessons.html03.checkedCode,'old checked snapshot');assert.equal(first.state.lessons.js04.attempts,4);assert.equal(first.state.lessons.js04.completed,true);
    const example=await page.evaluate(async()=>(await import('./lessons.js')).lessons.find(lesson=>lesson.id==='html03').example);
    await page.locator('#editor').fill(example);await page.locator('#check-code').click();await page.getByText('演習を完了しました',{exact:true}).waitFor();await saved(page);
    const completed=await record(page);assert.equal(completed.state.lessons.html03.attempts,10);assert.equal(completed.state.lessons.html03.checkedCode,example);assert.equal(completed.state.lessons.html03.result.every(row=>row.passed),true);assert.deepEqual(await raw(page),legacy);
    await page.reload();await saved(page);assert.deepEqual(await record(page),completed);assert.equal(await page.locator('#editor').inputValue(),example);
    await page.evaluate(()=>localStorage.setItem('ppl.foundation.progress.v1',JSON.stringify({version:1,lessonId:'html01',view:'home',lessons:{html03:{code:'late legacy overwrite',attempts:0,completed:false}}})));
    await page.reload();await saved(page);assert.deepEqual(await record(page),completed);assert.equal(await page.locator('#editor').inputValue(),example);
    // Actual transaction commits, but its success delivery is held. A later input must remain pending.
    await page.evaluate(()=>window.__holdDbAcks=true);await page.locator('#editor').fill(example+'\n<!-- first pending -->');await page.waitForFunction(()=>window.__dbAcks.length===1);
    assert.equal(await page.locator('#save-status').getAttribute('data-state'),'pending');await page.locator('#editor').fill(example+'\n<!-- latest pending -->');
    await page.evaluate(()=>{window.__holdDbAcks=false;window.__dbAcks.shift()();});await saved(page);
    assert.equal((await record(page)).state.lessons.html03.code,example+'\n<!-- latest pending -->');
    // Abort after native put success: neither DB value nor saved indication may advance.
    const beforeAbort=await record(page);await page.evaluate(()=>window.__dbFault='abort');await page.locator('#editor').fill('interrupted write');await failed(page);
    assert.deepEqual(await record(page),beforeAbort);assert.match(await page.locator('#save-status').textContent(),/中断/);assert.equal(await page.locator('#editor').inputValue(),'interrupted write');
    await page.evaluate(()=>window.__dbFault='');await page.locator('#editor').fill('recovered input');await saved(page);assert.equal((await record(page)).state.lessons.html03.code,'recovered input');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:`${evidence}/saved-${width}.png`,fullPage:true});
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);results.push({case:'migration/repeat/authority/real grade/reload/late ack/abort/retry',width,passed:true});await context.close();
  }
  {
    const {context,page}=await session({single:true});await saved(page);const before=await raw(page);assert.equal(before.legacy,null);assert.equal((await record(page)).state.lessons.html01.code,'<p>old single input</p>');await page.locator('#editor').fill('new DB input');await saved(page);await page.reload();await saved(page);assert.equal(await page.locator('#editor').inputValue(),'new DB input');assert.deepEqual(await raw(page),before);results.push({case:'single legacy migration',passed:true});await context.close();
  }
  for(const fault of ['unavailable','open-refusal','legacy-refusal','quota','refusal','transaction','abort']) {
    const {context,page,errors}=await session({fault,width:375});await failed(page);assert.match(await page.locator('#save-status').textContent(),/保存できません/);
    if(fault!=='legacy-refusal'){const before=await raw(page);assert.equal(await page.locator('#editor').inputValue(),'<h1>Preserved old input</h1>');await page.locator('#editor').fill('memory only edit');assert.deepEqual(await raw(page),before);await page.reload();await failed(page);assert.equal(await page.locator('#editor').inputValue(),'<h1>Preserved old input</h1>');if(['quota','refusal','transaction','abort'].includes(fault))assert.equal(await record(page),null);}
    assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    const layout=await page.locator('.practice-head').evaluate(head=>{const back=head.querySelector('button').getBoundingClientRect(),status=head.querySelector('#save-status').getBoundingClientRect();return {backHeight:back.height,backWidth:back.width,separateRow:status.top>=back.bottom};});assert.ok(layout.backHeight<=50&&layout.backWidth>=100&&layout.separateRow,JSON.stringify(layout));
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:`${evidence}/error-${fault}.png`,fullPage:true});results.push({case:'first migration failure: '+fault,synthetic:true,passed:true});await context.close();
  }
  {
    const {context,page}=await session({corrupt:true});await failed(page);await page.locator('#editor').fill('memory input');assert.equal((await raw(page)).legacy,'{broken');assert.equal(await record(page),null);results.push({case:'corrupt legacy retained',passed:true});await context.close();
  }
  for(const fault of ['quota','refusal','transaction']) {
    const {context,page}=await session();await saved(page);const before=await record(page),legacy=await raw(page);await page.evaluate(fault=>window.__dbFault=fault,fault);await page.locator('#editor').fill('unsaved '+fault);await failed(page);assert.deepEqual(await record(page),before);assert.deepEqual(await raw(page),legacy);await page.evaluate(()=>window.__dbFault='');await page.locator('#editor').fill('retry '+fault);await saved(page);assert.equal((await record(page)).state.lessons.html03.code,'retry '+fault);results.push({case:'save failure/retry: '+fault,synthetic:true,passed:true});await context.close();
  }
  {
    const {context,page}=await session();await saved(page);const baseline=await record(page),legacy=await raw(page), second=await context.newPage();await second.goto(url+'#practice');await saved(second);assert.deepEqual(await record(page),baseline);
    await page.locator('#editor').fill('first tab new input');await saved(page);const winner=await record(page);await second.locator('#editor').fill('second tab stale input');await failed(second);assert.match(await second.locator('#save-status').textContent(),/別の画面/);assert.equal(await second.locator('#editor').inputValue(),'second tab stale input');assert.deepEqual(await record(page),winner);assert.deepEqual(await raw(page),legacy);await second.reload();await saved(second);assert.equal(await second.locator('#editor').inputValue(),'first tab new input');results.push({case:'two native tabs / CAS conflict / reload',passed:true});await context.close();
  }
  {
    const {context,page}=await session();await saved(page);await discardTestProgress(page);
    const second=await context.newPage();await Promise.all([page.reload(),second.goto(url+'#practice')]);await Promise.all([saved(page),saved(second)]);
    const first=await record(page);assert.equal(first.revision,1);assert.deepEqual(await record(second),first);assert.equal(first.state.lessons.html03.attempts,9);results.push({case:'simultaneous first native migration is idempotent',passed:true});await context.close();
  }
  {
    const {context,page}=await session();await saved(page);const before=await record(page);
    await page.evaluate(()=>localStorage.setItem('qa-next-fault','legacy-refusal'));await page.reload();await saved(page);assert.equal(await page.locator('#editor').inputValue(),before.state.lessons.html03.code);await page.locator('#editor').fill('DB works despite legacy read refusal');await saved(page);assert.equal((await record(page)).state.lessons.html03.code,'DB works despite legacy read refusal');results.push({case:'valid DB remains authoritative when legacy getter is refused',synthetic:true,passed:true});await context.close();
  }
  {
    const {context,page}=await session();await saved(page);const before=await record(page),legacy=await raw(page);
    await page.evaluate(()=>window.__dbFault='timeout');await page.locator('#editor').fill('transaction must time out');await failed(page);assert.match(await page.locator('#save-status').textContent(),/時間内/);assert.deepEqual(await record(page),before);assert.deepEqual(await raw(page),legacy);await page.evaluate(()=>window.__dbFault='');await page.locator('#editor').fill('retry after timeout');await saved(page);assert.equal((await record(page)).state.lessons.html03.code,'retry after timeout');results.push({case:'native transaction kept active / deadline abort / retry',syntheticKeepAlive:true,passed:true});await context.close();
  }
  {
    const {context,page}=await session();await saved(page);
    const corrupt={version:999,revision:123,state:'future data retained'};
    await page.evaluate(value=>new Promise((resolve,reject)=>{const req=indexedDB.open('ppl.foundation.progress',1);req.onsuccess=()=>{const db=req.result,tx=db.transaction('records','readwrite');tx.objectStore('records').put(value,'foundation');tx.oncomplete=()=>{db.close();resolve()};tx.onabort=()=>{db.close();reject(tx.error)};};req.onerror=()=>reject(req.error)}),corrupt);
    await page.locator('#editor').fill('must not replace future record');await failed(page);assert.deepEqual(await record(page),corrupt);await page.reload();await failed(page);assert.equal(await page.locator('#editor').inputValue(),'<h1>Preserved old input</h1>');assert.deepEqual(await record(page),corrupt);results.push({case:'invalid/unknown DB record retained on save and reload',passed:true});await context.close();
  }
  {
    const {context,page}=await session();await saved(page);const before=await record(page), holder=await context.newPage();await holder.goto(origin+'/Programming-Practice-Lab/project-preview.html');
    await holder.evaluate(()=>new Promise((resolve,reject)=>{const req=indexedDB.open('ppl.foundation.progress',1);req.onerror=()=>reject(req.error);req.onsuccess=()=>{window.__heldDB=req.result;window.__heldDB.onversionchange=()=>{};window.__upgrade=indexedDB.open('ppl.foundation.progress',2);window.__upgrade.onblocked=resolve;window.__upgrade.onerror=()=>{};window.__upgrade.onsuccess=()=>window.__upgrade.result.close();};}));
    await page.reload();await failed(page);assert.match(await page.locator('#save-status').textContent(),/時間内/);assert.equal(await page.locator('#editor').inputValue(),'<h1>Preserved old input</h1>');
    await holder.evaluate(()=>window.__heldDB.close());await page.waitForTimeout(100);assert.equal(await page.locator('#save-status').getAttribute('data-state'),'error');
    const preserved=await holder.evaluate(()=>new Promise((resolve,reject)=>{const req=indexedDB.open('ppl.foundation.progress',2);req.onerror=()=>reject(req.error);req.onsuccess=()=>{const db=req.result,tx=db.transaction('records'),get=tx.objectStore('records').get('foundation');tx.oncomplete=()=>{db.close();resolve(get.result)};};}));assert.deepEqual(preserved,before);results.push({case:'native queued open deadline behind blocked foreign upgrade / late result ignored',passed:true});await context.close();
  }
  {
    const {context,page}=await session();await saved(page);const before=await record(page),legacy=await raw(page);
    await page.evaluate(()=>new Promise((resolve,reject)=>{const req=indexedDB.open('ppl.foundation.progress',1);req.onsuccess=()=>{const db=req.result,tx=db.transaction('records','readwrite'),store=tx.objectStore('records'),get=store.get('foundation');get.onsuccess=()=>{const value=get.result,cycle={};cycle.self=cycle;value.state.lessons.html03.code='cyclic DB code';value.state.lessons.html03.result=value.state.lessons.html03.result??[{id:'placeholder',passed:true}];value.state.lessons.html03.result[0].actual=cycle;store.put(value,'foundation');};tx.oncomplete=()=>{db.close();resolve()};tx.onabort=()=>{db.close();reject(tx.error)};};req.onerror=()=>reject(req.error)}));
    // Set matching completion IDs so rejection is caused by non-JSON data, not another schema fault.
    await page.evaluate(async()=>{const {lessons}=await import('./lessons.js');await new Promise((resolve,reject)=>{const req=indexedDB.open('ppl.foundation.progress',1);req.onsuccess=()=>{const db=req.result,tx=db.transaction('records','readwrite'),store=tx.objectStore('records'),get=store.get('foundation');get.onsuccess=()=>{const value=get.result,cycle=value.state.lessons.html03.result[0].actual;value.state.lessons.html03.result=lessons.find(l=>l.id==='html03').completionTests.map(t=>({id:t.id,passed:true,actual:cycle}));store.put(value,'foundation');};tx.oncomplete=()=>{db.close();resolve()};tx.onabort=()=>{db.close();reject(tx.error)};};req.onerror=()=>reject(req.error)});});
    await page.locator('#editor').fill('must not overwrite cyclic DB');await failed(page);const retained=await record(page);assert.equal(retained.revision,before.revision);assert.equal(retained.state.lessons.html03.code,'cyclic DB code');assert.equal(retained.state.lessons.html03.result[0].actual.self,retained.state.lessons.html03.result[0].actual);
    await page.reload();await failed(page);assert.equal(await page.locator('#editor').inputValue(),'<h1>Preserved old input</h1>');assert.match(await page.locator('#save-status').textContent(),/読み取れません/);assert.deepEqual(await raw(page),legacy);results.push({case:'cyclic structured-clone record rejected before adoption or overwrite / legacy fallback truthful',passed:true});await context.close();
  }
  {
    const {context,page}=await session();await saved(page);const before=await record(page);const outcome=await page.evaluate(async()=>{
      const {openProgressDatabase}=await import('./indexed-progress.js'),{lessons}=await import('./lessons.js');
      const hold=await new Promise((resolve,reject)=>{const req=indexedDB.open('ppl.foundation.progress',1);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});hold.onversionchange=()=>{};
      let name;try{await openProgressDatabase(()=>indexedDB,{lessons,version:2,timeoutMs:100});}catch(error){name=error.name;}hold.close();await new Promise(resolve=>setTimeout(resolve,100));return name;
    });assert.equal(outcome,'BlockedError');await failed(page);assert.match(await page.locator('#save-status').textContent(),/版が変わり/);assert.deepEqual(await record(page),before);await page.reload();await saved(page);assert.deepEqual(await record(page),before);results.push({case:'native blocked upgrade / late open abort / versionchange close',passed:true});await context.close();
  }
  {
    const {context,page}=await session();await saved(page);const before=await record(page);await page.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('ppl.foundation.progress',2);request.onsuccess=()=>{request.result.close();resolve()};request.onerror=()=>reject(request.error)}));await failed(page);await page.reload();await failed(page);assert.match(await page.locator('#save-status').textContent(),/版が変わり/);assert.equal(await page.locator('#editor').inputValue(),'<h1>Preserved old input</h1>');const preserved=await page.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('ppl.foundation.progress',2);request.onsuccess=()=>{const db=request.result,tx=db.transaction('records'),read=tx.objectStore('records').get('foundation');tx.oncomplete=()=>{db.close();resolve(read.result)};};request.onerror=()=>reject(request.error)}));assert.deepEqual(preserved,before);results.push({case:'unknown newer DB version retained',passed:true});await context.close();
  }
  {
    const {context,page}=await session();await saved(page);await page.evaluate(()=>{window.__holdDbAcks=true});await page.locator('#editor').fill('actual committed with held ack');await page.waitForFunction(()=>window.__dbAcks.length===1);await page.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide'));window.__holdDbAcks=false;window.__dbAcks.shift()();});await failed(page);assert.notEqual(await page.locator('#save-status').getAttribute('data-state'),'saved');await page.reload();await saved(page);assert.equal(await page.locator('#editor').inputValue(),'actual committed with held ack');results.push({case:'pagehide invalidates stale ack / reload reads actual commit',passed:true});await context.close();
  }
  console.log(JSON.stringify({passed:true,results},null,2));await writeFile(`${evidence}/results.json`,JSON.stringify({passed:true,results},null,2));
} finally { for(const context of contexts)await context.close();await browser.close();await new Promise(resolve=>server.close(resolve)); }
