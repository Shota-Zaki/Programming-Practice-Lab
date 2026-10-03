const fail = () => { throw new TypeError('Invalid common lesson format'); };
const text = (value,empty=false) => { if(typeof value!=='string'||(!empty&&!value.trim()))fail(); };
const object = value => { if(!value||Object.getPrototypeOf(value)!==Object.prototype||Reflect.ownKeys(value).length!==Object.keys(value).length||Object.values(Object.getOwnPropertyDescriptors(value)).some(d=>d.get||d.set))fail(); };
function keys(value,required,optional=[]) {object(value);if(required.some(key=>!Object.hasOwn(value,key))||Object.keys(value).some(key=>![...required,...optional].includes(key)))fail();}
function list(value,visit,empty=false) {if(!Array.isArray(value)||(!empty&&!value.length)||Object.keys(value).length!==value.length||Reflect.ownKeys(value).length!==value.length+1||Object.values(Object.getOwnPropertyDescriptors(value)).some(d=>d.get||d.set))fail();Array.from(value).forEach(visit);}
function json(value,ancestors=new Set()) {
  if(value===null||typeof value==='string'||typeof value==='boolean')return;
  if(typeof value==='number'){if(!Number.isFinite(value))fail();return;}
  if(typeof value!=='object'||ancestors.has(value))fail();
  ancestors.add(value);
  if(Array.isArray(value))list(value,item=>json(item,ancestors),true);
  else {object(value);Object.values(value).forEach(item=>json(item,ancestors));}
  ancestors.delete(value);
}
function freeze(value) {if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
function htmlTest(test) {
  keys(test,['id','label'],['kind','selector','value','count']);
  const kind=test.kind;
  if(kind!==undefined&&!['doctype','main','section','list','fragmentLink','image','form','control','exists','uniqueId'].includes(kind))fail();
  if(Object.hasOwn(test,'selector'))text(test.selector);
  if([undefined,'list','exists','uniqueId'].includes(kind)&&!Object.hasOwn(test,'selector'))fail();
  if(['image','control','uniqueId'].includes(kind))text(test.value);
  if(Object.hasOwn(test,'value'))text(test.value);
  if(Object.hasOwn(test,'count')&&(!Number.isSafeInteger(test.count)||test.count<1))fail();
}
function cssCheck(check,widths) {
  keys(check,['selector','property'],['id','label','expected','requiredSelector','byWidth']);
  text(check.selector);text(check.property);
  if(Object.hasOwn(check,'expected'))text(check.expected,true);
  if(Object.hasOwn(check,'requiredSelector'))text(check.requiredSelector);
  if(Object.hasOwn(check,'byWidth')){object(check.byWidth);if(!Object.keys(check.byWidth).length)fail();for(const [width,value] of Object.entries(check.byWidth)){if(!widths.includes(Number(width))||String(Number(width))!==width)fail();text(value,true);}}
  if(widths.some(width=>typeof (check.byWidth?.[width]??check.expected)!=='string'))fail();
}
function fixtureCheck(fixture) {
  keys(fixture,['markup','selectors','steps']);text(fixture.markup);list(fixture.selectors,selector=>text(selector));
  if(new Set(fixture.selectors).size!==fixture.selectors.length)fail();
  list(fixture.steps,step=>{keys(step,['type','selector'],['value']);if(!['click','input'].includes(step.type)||!fixture.selectors.includes(step.selector))fail();if(step.type==='input')text(step.value,true);else if(Object.hasOwn(step,'value'))fail();},true);
}
export function validateLesson(value) {
  keys(value,['version','id','courseId','chapterId','language','title','learning','exercise','nextLessonId']);
  if(value.version!==1)fail();for(const key of ['id','courseId','chapterId','title'])text(value[key]);
  for(const key of ['id','courseId','chapterId'])if(!/^[a-z][a-z0-9-]{0,63}$/.test(value[key]))fail();
  if(value.nextLessonId!==null)text(value.nextLessonId);
  const learning=value.learning,exercise=value.exercise,mode=exercise?.mode;
  if(!['html','css','javascript','dom'].includes(mode)||value.language!==(mode==='dom'?'javascript':mode))fail();
  keys(learning,['objectives','contentBlocks','example','hints','explanation']);
  list(learning.objectives,item=>text(item));list(learning.hints,item=>text(item));
  list(learning.contentBlocks,block=>{keys(block,['title','text']);text(block.title);text(block.text);});
  text(learning.example,true);text(learning.explanation);
  const payload={html:[],css:['markup'],javascript:['parameters','returnExpression'],dom:['fixture']}[mode];
  keys(exercise,['mode','starterCode','completionTests',...payload],mode==='css'?['viewports']:[]);text(exercise.starterCode,true);
  if(mode==='css'){text(exercise.markup);if(Object.hasOwn(exercise,'viewports'))list(exercise.viewports,width=>{if(!Number.isInteger(width)||width<320||width>1600)fail();});}
  if(mode==='javascript'){list(exercise.parameters,name=>text(name),true);text(exercise.returnExpression);}
  if(mode==='dom')fixtureCheck(exercise.fixture);
  list(exercise.completionTests,test=>{
    text(test?.id);text(test?.label);
    if(mode==='html')htmlTest(test);
    if(mode==='css'){
      if(Object.hasOwn(test,'checks')){keys(test,['id','label','checks']);list(test.checks,check=>cssCheck(check,exercise.viewports??[800]));}
      else cssCheck(test,exercise.viewports??[800]);
    }
    if(mode==='javascript'){keys(test,['id','label','inputs','expected']);if(!Array.isArray(test.inputs)||test.inputs.length!==exercise.parameters.length||!Number.isFinite(test.expected))fail();}
    if(mode==='dom'){keys(test,['id','label','step','selector','property','expected']);if(!Number.isInteger(test.step)||test.step<0||test.step>exercise.fixture.steps.length||!exercise.fixture.selectors.includes(test.selector)||!['textContent','value'].includes(test.property))fail();text(test.expected,true);}
  });
  if(new Set(exercise.completionTests.map(test=>test.id)).size!==exercise.completionTests.length)fail();
  json(value);
  return freeze(structuredClone(value));
}
export function compileLegacyLesson(source) {
  keys(source,['id','courseId','chapterId','language','title','objectives','contentBlocks','example','starterCode','completionTests','hints','explanation','nextLessonId'],['executionMode','markup','viewports','parameters','returnExpression','fixture']);
  const mode=source.executionMode==='dom'&&source.language==='javascript'?'dom':source.executionMode===undefined?source.language:null;
  const common={version:1,id:source.id,courseId:source.courseId,chapterId:source.chapterId,language:source.language,title:source.title,
    learning:{objectives:source.objectives,contentBlocks:source.contentBlocks,example:source.example,hints:source.hints,explanation:source.explanation},
    exercise:{mode,starterCode:source.starterCode,completionTests:source.completionTests},nextLessonId:source.nextLessonId};
  const allowed={html:[],css:['markup','viewports'],javascript:['parameters','returnExpression'],dom:['fixture']}[mode];
  if(!allowed)fail();
  for(const key of ['markup','viewports','parameters','returnExpression','fixture'])if(Object.hasOwn(source,key)){if(!allowed.includes(key))fail();common.exercise[key]=source[key];}
  // Earlier CSS helpers emitted an own optional field with value undefined. It is absent in JSON and unused by the grader.
  if(mode==='css') {
    const clean=check=>{const copy={...check};if(Object.hasOwn(copy,'requiredSelector')&&copy.requiredSelector===undefined)delete copy.requiredSelector;return copy;};
    common.exercise.completionTests=source.completionTests.map(test=>Object.hasOwn(test,'checks')?{...test,checks:test.checks.map(clean)}:clean(test));
  }
  return validateLesson(common);
}
export function toLegacyLesson(source) {
  const lesson=validateLesson(source),{mode,...exercise}=lesson.exercise;
  return freeze({language:lesson.language,courseId:lesson.courseId,chapterId:lesson.chapterId,id:lesson.id,title:lesson.title,
    ...lesson.learning,...exercise,...(mode==='dom'?{executionMode:'dom'}:{}),nextLessonId:lesson.nextLessonId});
}
export function createLessonCatalog(sources) {
  list(sources,()=>{});
  const catalog=sources.map(source=>Object.hasOwn(source,'version')?validateLesson(source):compileLegacyLesson(source)),byId=new Map();
  for(const lesson of catalog){if(byId.has(lesson.id))fail();byId.set(lesson.id,lesson);}
  for(const lesson of catalog){let next=lesson;const visited=new Set();while(next){if(visited.has(next.id))fail();visited.add(next.id);if(next.nextLessonId===null)break;const destination=byId.get(next.nextLessonId);if(!destination||destination.courseId!==lesson.courseId)fail();next=destination;}}
  return Object.freeze(catalog);
}
