import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const {chromium}=await import('file:///C:/Users/shota/Documents/Codex/2026-10-03/task-2/test-tools/node_modules/playwright/index.mjs');
const root=resolve('ppl/docs'),server=createServer(async(req,res)=>{try{if(req.url==='/probe'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><title>Task-owned DB probe</title>');return;}const file=resolve(root,'.'+req.url);if(!file.startsWith(root+sep))throw Error();res.setHeader('Content-Type',{'.js':'text/javascript','.css':'text/css','.html':'text/html'}[extname(file)]||'text/plain');res.end(await readFile(file));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true});
try{const context=await browser.newContext(),page=await context.newPage();await page.goto(`http://127.0.0.1:${server.address().port}/probe`);
const result=await page.evaluate(async()=>{
 const {lessons}=await import('/lessons.js'),{createIndexedProgressRepository}=await import('/indexed-progress.js');
 const raw=JSON.stringify({version:1,lessonId:'html03',view:'practice',lessons:{html03:{code:'legacy retained code',attempts:9,completed:true,result:null,checkedCode:null}}});localStorage.setItem('ppl.foundation.progress.v1',raw);
 const first=await createIndexedProgressRepository(()=>localStorage,lessons,()=>indexedDB);first.close();
 await new Promise((resolve,reject)=>{const req=indexedDB.open('ppl.foundation.progress',1);req.onsuccess=()=>{const db=req.result,tx=db.transaction('records','readwrite'),store=tx.objectStore('records'),get=store.get('foundation');get.onsuccess=()=>{const value=get.result,cycle={};cycle.self=cycle;value.state.lessons.html03.code='corrupt DB code';value.state.lessons.html03.result=lessons.find(l=>l.id==='html03').completionTests.map(t=>({id:t.id,passed:true,actual:cycle}));store.put(value,'foundation');};tx.oncomplete=()=>{db.close();resolve()};tx.onabort=()=>{db.close();reject(tx.error)};};req.onerror=()=>reject(req.error)});
 const second=await createIndexedProgressRepository(()=>localStorage,lessons,()=>indexedDB);const output={status:second.status,restoredCode:second.state.lessons.html03.code,legacyRawUnchanged:localStorage.getItem('ppl.foundation.progress.v1')===raw};second.close();return output;
});await mkdir('db-review',{recursive:true});await writeFile(`db-review/cyclic-${process.argv[2]||'current'}.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result));await context.close();
}finally{await browser.close();await new Promise(r=>server.close(r));}
