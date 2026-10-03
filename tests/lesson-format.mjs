import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lessonCatalog,lessons} from '../src/static/lessons.js';
import {compileLegacyLesson,createLessonCatalog,toLegacyLesson,validateLesson} from '../src/static/lesson-format.js';
import {createGradingAdapter,acceptGradingOutcome} from '../src/static/grading-adapter.js';
import {createProgressRepository,STATE_KEY} from '../src/static/progress.js';
const baseline=JSON.parse(readFileSync(new URL('./fixtures/foundation-legacy.json',import.meta.url),'utf8'));
const lesson=id=>structuredClone(lessonCatalog.find(l=>l.id===id));
const rejects=change=>{const value=lesson('html01');change(value);assert.throws(()=>validateLesson(value),TypeError);};

test('all 21 legacy values, ordering, IDs, content and payload match immutable published baseline',()=>{
  assert.equal(baseline.sourceCommit,'b988b66cc5dc04a1e03591bb921feeee87628da1');
  assert.equal(lessonCatalog.length,21);assert.deepEqual(lessons,baseline.lessons);
  assert.deepEqual(lessonCatalog.map(toLegacyLesson),baseline.lessons);
  assert.deepEqual(createLessonCatalog(baseline.lessons),lessonCatalog);
  assert.deepEqual(lessonCatalog.map(l=>l.exercise.mode),[...Array(7).fill('html'),...Array(8).fill('css'),...Array(3).fill('javascript'),...Array(3).fill('dom')]);
});
test('common JSON roundtrip is exact; returned snapshots are detached and recursively immutable',()=>{
  assert.deepEqual(createLessonCatalog(JSON.parse(JSON.stringify(lessonCatalog))),lessonCatalog);
  const source=lesson('js06'),snapshot=validateLesson(source),view=toLegacyLesson(source);
  source.learning.example='changed';source.exercise.fixture.steps[0].value='changed';
  assert.notEqual(snapshot.learning.example,'changed');assert.equal(snapshot.exercise.fixture.steps[0].value,'太郎');assert.equal(view.fixture.steps[0].value,'太郎');
  assert.equal(Object.isFrozen(snapshot.exercise.fixture.steps[0]),true);assert.equal(Object.isFrozen(view.completionTests),true);
  assert.throws(()=>snapshot.learning.objectives.push('changed'),TypeError);
});
test('required schema, version, identifiers and learning metadata reject malformed definitions',()=>{
  for(const change of [v=>v.version=2,v=>delete v.learning,v=>v.unknown=true,v=>v.id='',v=>v.id='" onclick="x',v=>v.courseId=4,v=>v.nextLessonId=5,
    v=>v.learning.example=4,v=>v.learning.objectives=[],v=>v.learning.objectives=Array(1),v=>v.learning.hints=[4],v=>v.learning.contentBlocks[0].unknown=1,v=>v.learning.contentBlocks[0].text=4])rejects(change);
});
test('unknown/native and mixed mode payloads reject before any grading dependency runs',()=>{
  for(const id of ['html01','css01','js01','js04']){
    for(const change of [v=>v.exercise.mode='native',v=>v.exercise.mode='unknown',v=>v.exercise.extra=true,v=>v.language='python',v=>v.exercise.markup='mixed']){
      const value=lesson(id);change(value);if(id==='css01'&&value.exercise.markup==='mixed'&&!value.exercise.extra)continue;
      let called=false;assert.throws(()=>createGradingAdapter([value],{html(){called=true},css(){called=true},javascript(){called=true},dom(){called=true}}),TypeError);assert.equal(called,false);
    }
  }
});
test('HTML condition kinds, selectors, values, counts and duplicate/sparse rows are checked',()=>{
  for(const change of [v=>v.exercise.completionTests[0].kind='wrong',v=>v.exercise.completionTests[1].selector=4,v=>delete v.exercise.completionTests[1].selector,
    v=>v.exercise.completionTests[0].passed=true,v=>v.exercise.completionTests[0].count=0,v=>v.exercise.completionTests[1].id=v.exercise.completionTests[0].id,v=>v.exercise.completionTests=Array(2)])rejects(change);
});
test('CSS aggregate checks, widths and every per-width expectation retain strict shape',()=>{
  for(const change of [v=>v.exercise.viewports=[],v=>v.exercise.viewports=[319],v=>v.exercise.viewports=[1601],v=>v.exercise.completionTests[0].checks=[],
    v=>v.exercise.completionTests[0].checks[0].expected=4,v=>v.exercise.completionTests[2].byWidth['300']='column',v=>delete v.exercise.completionTests[2].byWidth['375'],v=>v.exercise.completionTests[2].byWidth['375']=true]) {
    const value=lesson('css08');change(value);assert.throws(()=>validateLesson(value),TypeError);
  }
  const legacy=structuredClone(baseline.lessons.find(l=>l.id==='css01'));legacy.completionTests.at(-1).requiredSelector=undefined;
  const common=compileLegacyLesson(legacy);assert.equal(Object.hasOwn(common.exercise.completionTests.at(-1),'requiredSelector'),false);
  legacy.completionTests.at(-1).unknown=undefined;assert.throws(()=>compileLegacyLesson(legacy),TypeError);
});
test('numerical and DOM payloads check expectations, inputs, selectors, steps and properties',()=>{
  for(const change of [v=>v.exercise.parameters=null,v=>v.exercise.returnExpression=4,v=>v.exercise.completionTests[0].expected='300',v=>v.exercise.completionTests[0].expected=NaN,v=>v.exercise.completionTests[0].inputs=[]]){const value=lesson('js01');change(value);assert.throws(()=>validateLesson(value),TypeError);}
  for(const change of [v=>v.exercise.fixture.selectors.push(v.exercise.fixture.selectors[0]),v=>v.exercise.fixture.steps[0].type='keydown',v=>v.exercise.fixture.steps[0].selector='#unknown',v=>delete v.exercise.fixture.steps[0].value,
    v=>v.exercise.completionTests[0].selector='#unknown',v=>v.exercise.completionTests[0].step=99,v=>v.exercise.completionTests[0].property='innerHTML',v=>v.exercise.completionTests[0].expected=5]){const value=lesson('js06');change(value);assert.throws(()=>validateLesson(value),TypeError);}
});
test('non-JSON functions, symbols, hidden/accessor fields and cyclic input cannot be serialized silently',()=>{
  rejects(v=>v.learning.example=()=>{});rejects(v=>v[Symbol('unknown')]='value');rejects(v=>Object.defineProperty(v,'hidden',{value:1}));
  let called=0;rejects(v=>Object.defineProperty(v.learning,'example',{enumerable:true,get(){called++;return 'x'}}));assert.equal(called,0);
  const value=lesson('js01');value.exercise.completionTests[0].inputs[0]=value.exercise.completionTests[0].inputs;assert.throws(()=>validateLesson(value),TypeError);
  const accessor=lesson('html01');Object.defineProperty(accessor.learning.objectives,'0',{enumerable:true,get(){called++;return 'x'}});assert.throws(()=>validateLesson(accessor),TypeError);assert.equal(called,0);
});
test('catalog rejects duplicate, missing, cross-course and cyclic navigation; source order remains unchanged',()=>{
  for(const change of [ls=>ls.push(ls[0]),ls=>ls[0].nextLessonId='missing',ls=>ls[1].courseId='another-course',ls=>ls.at(-1).nextLessonId=ls[0].id]){const value=structuredClone(lessonCatalog);change(value);assert.throws(()=>createLessonCatalog(value),TypeError);}
  const source=structuredClone(lessonCatalog),before=JSON.stringify(source);createLessonCatalog(source);assert.equal(JSON.stringify(source),before);
});
test('real adapter consumes common catalog while legacy API yields identical spec/results for all modes',async()=>{
  const seen=[];const rowResult=(code,spec)=>{const tests=Array.isArray(spec)?spec:spec.completionTests;seen.push({code,spec});return tests.map(t=>({id:t.id,passed:true}));};
  const dependencies={html:rowResult,css:rowResult,javascript:rowResult,dom:rowResult};
  const common=createGradingAdapter(lessonCatalog,dependencies),old=createGradingAdapter(baseline.lessons,dependencies);
  for(const [i,value] of lessonCatalog.entries()){
    const request={lessonId:value.id,code:value.learning.example,runId:i+1};
    const outcome=await common.grade(request),prior=await old.grade(request);
    assert.deepEqual(outcome,prior);assert.deepEqual(seen.at(-2),seen.at(-1));assert.deepEqual(acceptGradingOutcome(outcome,request,value),prior.results);
  }
});
test('common catalog introduces no progress upgrade; incomplete legacy code/results and refusal survive reload',()=>{
  const current=lessons.find(l=>l.id==='js04'),result=current.completionTests.map(t=>({id:t.id,passed:true,actual:t.expected,expected:t.expected}));
  let raw=JSON.stringify({version:1,lessonId:current.id,view:'practice',lessons:{[current.id]:{code:'unfinished learner code',checkedCode:current.example,completed:true,attempts:8,result}}});
  const storage={getItem:key=>key===STATE_KEY?raw:null,setItem:(key,value)=>{assert.equal(key,STATE_KEY);raw=value;}};
  const repository=createProgressRepository(()=>storage,lessons),prior=structuredClone(repository.state.lessons[current.id]);repository.save();
  assert.deepEqual(createProgressRepository(()=>storage,lessons).state.lessons[current.id],prior);
  assert.equal(prior.code,'unfinished learner code');assert.equal(prior.completed,true);assert.equal(prior.attempts,8);
  assert.equal(raw.includes('exercise'),false);assert.equal(raw.includes('schemaVersion'),false);assert.equal(raw.includes('runId'),false);
  const persisted=raw;storage.setItem=()=>{throw new DOMException('quota','QuotaExceededError')};repository.state.lessons[current.id].code='new unsaved';assert.equal(repository.save(),false);assert.equal(raw,persisted);
  assert.equal(createProgressRepository(()=>storage,lessons).state.lessons[current.id].code,'unfinished learner code');
});
