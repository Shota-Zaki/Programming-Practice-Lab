import { gradeHtml } from './grading.js';
import { gradeCss } from './css-grading.js';
import { gradeJavaScript } from './javascript-grading.js';
import { gradeDomLesson } from './dom-grading.js';
import { toLegacyLesson } from './lesson-format.js';

const cancelError = () => new DOMException('Cancelled', 'AbortError');
function freeze(value) {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
function modeOf(lesson) {
  if (lesson.executionMode === 'dom' && lesson.language === 'javascript') return 'dom';
  if (lesson.executionMode === undefined && ['html', 'css', 'javascript'].includes(lesson.language)) return lesson.language;
  throw new TypeError('Unsupported grading mode');
}
function requestCopy(request) {
  if (!request || Object.keys(request).length !== 3 || !['lessonId','code','runId'].every(key => Object.hasOwn(request,key))
      || typeof request.lessonId !== 'string' || typeof request.code !== 'string'
      || !Number.isSafeInteger(request.runId) || request.runId < 1) throw new TypeError('Invalid grading request');
  return Object.freeze({lessonId:request.lessonId,code:request.code,runId:request.runId});
}
function resultCopy(results, lesson) {
  if (!Array.isArray(results) || results.length !== lesson.completionTests.length) throw new TypeError('Mismatched grading result');
  return Object.freeze(Array.from(results,(row,i) => {
    if (row?.id !== lesson.completionTests[i].id || typeof row.passed !== 'boolean'
        || ['actual','expected'].some(key => Object.hasOwn(row,key) && typeof row[key] !== 'string')) throw new TypeError('Mismatched grading result');
    const copy = {id:row.id,passed:row.passed};
    for (const key of ['actual','expected']) if (Object.hasOwn(row,key)) copy[key]=row[key];
    return Object.freeze(copy);
  }));
}
// Correlation guard at the UI/save boundary. Only result rows enter the legacy store.
export function acceptGradingOutcome(outcome, request, lesson) {
  if(Object.hasOwn(lesson,'version'))lesson=toLegacyLesson(lesson);
  const input=requestCopy(request);
  if (!outcome || Object.keys(outcome).length !== 6 || !['version','lessonId','code','runId','mode','results'].every(key=>Object.hasOwn(outcome,key)) || outcome.version !== 1
      || outcome.lessonId !== input.lessonId || lesson.id !== input.lessonId || outcome.code !== input.code
      || outcome.runId !== input.runId || outcome.mode !== modeOf(lesson)) throw new TypeError('Mismatched grading outcome');
  return resultCopy(outcome.results,lesson);
}
function waitForResult(operation, signal) {
  return new Promise((resolve,reject) => {
    let settled=false;
    const finish=(error,value) => { if(settled)return;settled=true;signal?.removeEventListener('abort',abort);error?reject(error):resolve(value); };
    const abort=()=>finish(cancelError());
    signal?.addEventListener('abort',abort,{once:true});
    if(signal?.aborted)abort();
    Promise.resolve(operation).then(value=>finish(signal?.aborted?cancelError():null,value),error=>finish(error));
  });
}
export function createGradingAdapter(lessons, {html=gradeHtml,css=gradeCss,javascript=gradeJavaScript,dom=gradeDomLesson}={}) {
  if(!Array.isArray(lessons)||!lessons.length)throw new TypeError('Invalid grading registry');
  const registry=new Map();
  for(const source of lessons) {
    const lesson=Object.hasOwn(source,'version')?toLegacyLesson(source):freeze(structuredClone(source));
    if(typeof lesson?.id!=='string'||!lesson.id||registry.has(lesson.id)
        || !Array.isArray(lesson.completionTests)||!lesson.completionTests.length
        ||Array.from(lesson.completionTests).some(test=>typeof test?.id!=='string'||!test.id)
        ||new Set(lesson.completionTests.map(test=>test.id)).size!==lesson.completionTests.length)throw new TypeError('Invalid grading registry');
    const mode=modeOf(lesson);
    registry.set(lesson.id,{lesson,mode});
  }
  const graders={html,css,javascript,dom};
  if(Object.values(graders).some(fn=>typeof fn!=='function'))throw new TypeError('Invalid grading adapter');
  return Object.freeze({async grade(request,{signal}={}) {
    const input=requestCopy(request),registration=registry.get(input.lessonId);
    if(!registration)throw new TypeError('Unknown grading lesson');
    if(signal?.aborted)throw cancelError();
    const {lesson,mode}=registration;
    const operation=mode==='html'?html(input.code,lesson.completionTests):graders[mode](input.code,lesson,{signal});
    const results=resultCopy(await waitForResult(operation,signal),lesson);
    return Object.freeze({version:1,...input,mode,results});
  }});
}
