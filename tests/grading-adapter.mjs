import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createGradingAdapter,acceptGradingOutcome} from '../src/static/grading-adapter.js';
import {lessons} from '../src/static/lessons.js';
import {createProgressRepository,STATE_KEY} from '../src/static/progress.js';
const row={id:'condition',passed:true};
const definition=(id,language,executionMode)=>({id,language,...(executionMode===undefined?{}:{executionMode}),completionTests:[{id:'condition'}]});
const registry=[definition('html','html'),definition('css','css'),definition('js','javascript'),definition('dom','javascript','dom')];
const request=(lessonId,runId=1,code='unchanged')=>({lessonId,runId,code});
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject};};
function adapters(fn=()=>[row]) {return {html:fn,css:fn,javascript:fn,dom:fn};}

test('four legacy modes dispatch with copied trusted contracts and unchanged result shape',async()=>{
  const calls=[],signal=new AbortController().signal;
  const dependencies=Object.fromEntries(['html','css','javascript','dom'].map(mode=>[mode,(code,spec,options)=>{calls.push({mode,code,spec,options});return [{...row,...(mode==='html'?{}:{actual:'<p>文字</p>',expected:'value'})}];}]));
  const adapter=createGradingAdapter(registry,dependencies);
  for(const [i,lesson] of registry.entries()) {
    const input=request(lesson.id,i+1,'同じコード');
    const outcome=await adapter.grade(input,{signal});
    assert.deepEqual(acceptGradingOutcome(outcome,input,lesson),outcome.results);
    assert.equal(outcome.mode,['html','css','javascript','dom'][i]);
    assert.equal(Object.isFrozen(outcome),true);assert.equal(Object.isFrozen(outcome.results[0]),true);
    const call=calls[i];assert.equal(call.code,input.code);
    assert.deepEqual(call.spec,lesson.language==='html'?lesson.completionTests:lesson);
    assert.notEqual(call.spec,lesson.language==='html'?lesson.completionTests:lesson);
    if(i)assert.equal(call.options.signal,signal);else assert.equal(call.options,undefined);
  }
  assert.deepEqual(calls.map(c=>c.mode),['html','css','javascript','dom']);
});
test('all canonical lessons register without mutation; registry snapshot ignores later caller changes',async()=>{
  const before=JSON.stringify(lessons);createGradingAdapter(lessons);assert.equal(JSON.stringify(lessons),before);
  const source=structuredClone(registry),adapter=createGradingAdapter(source,adapters());
  source[0].completionTests[0].id='tampered';source[0].executionMode='native';
  assert.deepEqual((await adapter.grade(request('html'))).results,[row]);
});
test('unknown and native modes, duplicate IDs and malformed conditions reject before dispatch',()=>{
  let calls=0;const deps=adapters(()=>{calls++;return[row];});
  const bad=[[],[definition('native','javascript','native')],[definition('unknown','rust')],[definition('bad','html','dom')],[definition('bad','css','anything')],
    [registry[0],registry[0]],[{...registry[0],completionTests:[]}],[{...registry[0],completionTests:[{id:'x'},{id:'x'}]}],
    [{...registry[0],completionTests:Array(1)}],[{...registry[0],completionTests:[{}]}]];
  for(const value of bad)assert.throws(()=>createGradingAdapter(value,deps),TypeError);
  assert.equal(calls,0);
});
test('invalid requests and pre-aborted requests never invoke any grader',async()=>{
  let calls=0;const adapter=createGradingAdapter(registry,adapters(()=>{calls++;return[row];}));
  for(const input of [null,{},request('unknown'),{...request('html'),code:1},{...request('html'),runId:0},{...request('html'),runId:Infinity},{...request('html'),mode:'native'}])await assert.rejects(adapter.grade(input),TypeError);
  const controller=new AbortController();controller.abort();await assert.rejects(adapter.grade(request('html'),{signal:controller.signal}),{name:'AbortError'});
  assert.equal(calls,0);
});
test('mismatched, sparse, nonboolean and nonstring result rows cannot become success',async()=>{
  const wrong=[null,[],[row,row],[{...row,id:'other'}],[{...row,passed:1}],[{...row,actual:{html:'unsafe'}}],[{...row,expected:4}],Array(1)];
  for(const result of wrong)for(const lesson of registry)await assert.rejects(createGradingAdapter(registry,adapters(()=>result)).grade(request(lesson.id)),TypeError);
});
test('outcome mismatch guard rejects other run, lesson, code, mode, schema and row ordering',async()=>{
  const input=request('html'),outcome=await createGradingAdapter(registry,adapters()).grade(input);
  for(const mutation of [{runId:2},{lessonId:'css'},{code:'different'},{mode:'native'},{version:2},{results:[{id:'other',passed:true}]},{extra:true}])assert.throws(()=>acceptGradingOutcome({...outcome,...mutation},input,registry[0]),TypeError);
  const inherited=Object.create(outcome);Object.assign(inherited,{a:1,b:2,c:3,d:4,e:5,f:6});assert.throws(()=>acceptGradingOutcome(inherited,input,registry[0]),TypeError);
  const two={...registry[0],completionTests:[{id:'a'},{id:'b'}]};
  assert.throws(()=>acceptGradingOutcome({...outcome,results:[{id:'b',passed:true},{id:'a',passed:true}]},input,two),TypeError);
});
test('request and result snapshots resist mutation after async dispatch and completion',async()=>{
  const gate=deferred(),input=request('css'),rows=[{...row,actual:'before',expected:'value',ignored:'metadata'}];
  const pending=createGradingAdapter(registry,adapters(()=>gate.promise)).grade(input);
  input.code='changed';input.lessonId='dom';input.runId=2;gate.resolve(rows);
  const outcome=await pending;rows[0].passed=false;rows[0].actual='after';
  assert.equal(outcome.code,'unchanged');assert.equal(outcome.lessonId,'css');assert.equal(outcome.runId,1);
  assert.deepEqual(outcome.results,[{...row,actual:'before',expected:'value'}]);
});
test('cancelled slow success never revives; identical-code retry retains new run identity',async()=>{
  const gates=[deferred(),deferred()];let calls=0;
  const adapter=createGradingAdapter(registry,adapters(()=>gates[calls++].promise)),controller=new AbortController();
  const first=adapter.grade(request('css',1),{signal:controller.signal});controller.abort();controller.abort();
  await assert.rejects(first,{name:'AbortError'});const second=adapter.grade(request('css',2));
  gates[0].resolve([row]);gates[1].resolve([{...row,passed:false}]);
  const outcome=await second;assert.equal(outcome.runId,2);assert.equal(outcome.results[0].passed,false);assert.equal(calls,2);
});
test('late errors after cancel are consumed, and synchronous/asynchronous failures permit retry',async()=>{
  const gate=deferred(),controller=new AbortController();let count=0;
  const adapter=createGradingAdapter(registry,adapters(()=>{count++;if(count===1)return gate.promise;if(count===2)throw Error('sync');if(count===3)return Promise.reject(Error('async'));return[row];}));
  const job=adapter.grade(request('css'),{signal:controller.signal});controller.abort();await assert.rejects(job,{name:'AbortError'});gate.reject(Error('late'));
  await assert.rejects(adapter.grade(request('css',2)),/sync/);await assert.rejects(adapter.grade(request('css',3)),/async/);
  assert.deepEqual((await adapter.grade(request('css',4))).results,[row]);
});
test('legacy v1, single input, stale/mismatched result and save denial preserve repository semantics',async()=>{
  const valid=lessons[0],result=valid.completionTests.map(t=>({id:t.id,passed:true}));
  const data=new Map([[STATE_KEY,JSON.stringify({version:1,lessonId:valid.id,view:'practice',lessons:{[valid.id]:{code:valid.example,checkedCode:valid.example,result,attempts:9,completed:true},html02:{code:'old',result:[{id:'other',passed:true}],attempts:4,completed:true}}})],['unrelated','keep']]);
  const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)},repository=createProgressRepository(()=>storage,lessons);
  const prior=structuredClone(repository.state.lessons[valid.id]);
  assert.deepEqual(prior,{code:valid.example,checkedCode:valid.example,result,attempts:9,completed:true});assert.equal(repository.state.lessons.html02.result,null);assert.equal(repository.state.lessons.html02.completed,true);
  const adapter=createGradingAdapter(lessons,{html:()=>result});const input=request(valid.id,1,valid.example),outcome=await adapter.grade(input);
  assert.deepEqual(acceptGradingOutcome(outcome,input,valid),prior.result);repository.save();
  const written=JSON.parse(data.get(STATE_KEY));assert.equal(written.version,1);assert.deepEqual(written.lessons[valid.id],prior);assert.equal('runId' in written.lessons[valid.id],false);assert.equal(data.get('unrelated'),'keep');
  data.delete(STATE_KEY);data.set('ppl.foundation.html01','single old input');assert.equal(createProgressRepository(()=>storage,lessons).state.lessons.html01.code,'single old input');
  data.set(STATE_KEY,'{broken');assert.equal(createProgressRepository(()=>storage,lessons).state.lessons.html01.code,'single old input');
  const denied=createProgressRepository(()=>({getItem(){throw Error('denied');},setItem(){throw Error('denied');}}),lessons);assert.equal(denied.save(),false);assert.equal(denied.state.lessons.html01.code,valid.starterCode);
});
