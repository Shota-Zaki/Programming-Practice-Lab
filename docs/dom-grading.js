import { executeDomLesson } from './dom-execution.js';
// Expected values remain in the parent, never inside learner execution.
export async function gradeDomLesson(code,lesson,options={}) {
  if(!Array.isArray(lesson?.completionTests)||lesson.completionTests.length<1||lesson.completionTests.length>16||lesson.completionTests.some(test=>!Number.isInteger(test.step)||test.step<0||test.step>lesson.fixture.steps.length||!lesson.fixture.selectors.includes(test.selector)||!['textContent','value'].includes(test.property)||typeof test.expected!=='string'||test.expected.length>160))throw new Error('Invalid DOM grading contract');
  const snapshots=await executeDomLesson(code,lesson.fixture,options);
  return lesson.completionTests.map(test=>{
    const state=snapshots[test.step],node=state?.find(n=>n.selector===test.selector);
    const actual=node?.[test.property];
    return {id:test.id,passed:typeof actual==='string'&&actual===test.expected,actual:actual??'',expected:test.expected};
  });
}

// Reconstruct a script-free display from trusted fixture and parent-validated strings.
// Learner code is never run here; strings are always inserted as text.
export function domLessonPreview(lesson,result) {
  const document=new DOMParser().parseFromString(lesson.fixture.markup,'text/html');
  if(result)lesson.completionTests.forEach((test,i)=>{const node=document.querySelector(test.selector);if(node&&typeof result[i]?.actual==='string')node[test.property]=result[i].actual;});
  return `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'">${document.body.innerHTML}`;
}
