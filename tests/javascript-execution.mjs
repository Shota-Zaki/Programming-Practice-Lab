import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createExecutionController } from '../src/static/javascript-execution.js';
function harness() {
 const workers=[];
 const controller=createExecutionController({createWorker(){
  const w={terminated:0,messages:[],postMessage(m){this.messages.push(m)},terminate(){this.terminated++}};
  workers.push(w);return w;
 }});
 return {controller,workers};
}
test('correlated result terminates worker; unrelated message ignored',async()=>{
 const {controller,workers}=harness();const job=controller.run({code:'example',timeoutMs:100});
 const w=workers[0];w.onmessage({data:{id:999,status:'success',value:1}});
 w.onmessage({data:{id:w.messages[0].id,status:'success',value:6}});
 assert.deepEqual(await job,{status:'success',value:6});assert.equal(w.terminated,1);assert.equal(controller.running,false);
});
test('timeout terminates and allows retry',async()=>{
 const {controller,workers}=harness();assert.deepEqual(await controller.run({code:'loop',timeoutMs:10}),{status:'timeout'});
 assert.equal(workers[0].terminated,1);const job=controller.run({code:'next',timeoutMs:100});
 workers[1].onmessage({data:{id:workers[1].messages[0].id,status:'success',value:8}});assert.equal((await job).value,8);
});
test('replacement cancels; stale callback ignored; stop idempotent',async()=>{
 const {controller,workers}=harness();const first=controller.run({code:'old',timeoutMs:100});const stale=workers[0].onmessage;
 const second=controller.run({code:'new',timeoutMs:100});assert.deepEqual(await first,{status:'cancelled'});
 stale({data:{id:workers[0].messages[0].id,status:'success',value:100}});assert.equal(controller.running,true);
 controller.stop();controller.stop();assert.deepEqual(await second,{status:'cancelled'});assert.equal(workers[1].terminated,1);
});
test('error, decode error, malformed reply release worker',async()=>{
 for(const kind of ['error','messageerror','malformed']){
  const {controller,workers}=harness();const job=controller.run({code:'x',timeoutMs:100});const w=workers[0];
  if(kind==='malformed')w.onmessage({data:{id:w.messages[0].id,status:'bad'}});else w['on'+kind]({preventDefault(){}});
  assert.deepEqual(await job,{status:'error'});assert.equal(w.terminated,1);
 }
});
test('creation and send errors resolve and release resources',async()=>{
 const bad=createExecutionController({createWorker(){throw Error('unsupported')}});assert.deepEqual(await bad.run({code:'x'}),{status:'error'});
 let count=0;const clone=createExecutionController({createWorker(){return {terminate(){count++},postMessage(){throw Error('clone')}}}});
 assert.deepEqual(await clone.run({code:'x'}),{status:'error'});assert.equal(count,1);
});
test('invalid arguments never cancel active job',async()=>{
 const {controller,workers}=harness();const active=controller.run({code:'ok',timeoutMs:100});
 for(const options of [{code:1},{code:'x',timeoutMs:0},{code:'x',timeoutMs:Infinity},{code:'x',timeoutMs:30001}])assert.throws(()=>controller.run(options),TypeError);
 assert.equal(workers.length,1);assert.equal(controller.running,true);controller.stop();await active;
});

test('real worker: infinite loop terminates, UI thread remains responsive, retry succeeds',async()=>{
 const {Worker}=await import('node:worker_threads');
 const controller=createExecutionController({createWorker(){
  const real=new Worker(`const {parentPort}=require('node:worker_threads');parentPort.on('message',({id,code})=>{if(code==='loop'){while(true){}}else parentPort.postMessage({id,status:'success',value:6});});`,{eval:true});
  const adapter={postMessage:m=>real.postMessage(m),terminate:()=>{real.terminate();}};
  real.on('message',data=>adapter.onmessage?.({data}));real.on('error',()=>adapter.onerror?.({}));
  return adapter;
 }});
 let responsive=false;
 const loop=controller.run({code:'loop',timeoutMs:150});
 setTimeout(()=>{responsive=true},20);
 assert.deepEqual(await loop,{status:'timeout'});assert.equal(responsive,true);
 assert.deepEqual(await controller.run({code:'result',timeoutMs:1000}),{status:'success',value:6});
 const stopped=controller.run({code:'loop',timeoutMs:1000});controller.stop();
 assert.deepEqual(await stopped,{status:'cancelled'});
});

test('cancel during worker creation terminates the returned host before sending',async()=>{
 let terminated=0,sent=0,controller;
 controller=createExecutionController({createWorker(){controller.stop();return {terminate(){terminated++},postMessage(){sent++}}}});
 assert.deepEqual(await controller.run({code:'x'}),{status:'cancelled'});assert.equal(terminated,1);assert.equal(sent,0);assert.equal(controller.running,false);
});
