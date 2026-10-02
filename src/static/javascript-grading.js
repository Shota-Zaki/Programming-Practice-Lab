import { createExecutionController } from './javascript-execution.js';
import { createOpaqueWorker, javascriptHostBusy } from './javascript-host.js';
export async function gradeJavaScript(code, lesson, {signal, timeoutMs=2000}={}) {
  if (javascriptHostBusy()) throw new Error('JavaScript host is still stopping');
  if (signal?.aborted) throw new DOMException('Cancelled','AbortError');
  if (typeof code !== 'string' || new TextEncoder().encode(code).length > 32768) throw new Error('JavaScript code exceeds 32KiB');
  if (!lesson.completionTests.length || lesson.completionTests.length > 16) throw new Error('Invalid JavaScript tests');
  const spec = {parameters:lesson.parameters, returnExpression:lesson.returnExpression, inputs:lesson.completionTests.map(t=>t.inputs)};
  let worker;
  const controller = createExecutionController({createWorker:()=>worker=createOpaqueWorker(spec)});
  const abort = () => controller.stop();
  signal?.addEventListener('abort', abort, {once:true});
  try {
    const outcome = await controller.run({code,timeoutMs});
    if (outcome.status === 'cancelled' || signal?.aborted) throw new DOMException('Cancelled','AbortError');
    if (outcome.status !== 'success') throw new Error(outcome.status === 'timeout' ? 'JavaScript timed out' : 'JavaScript execution failed');
    return lesson.completionTests.map((test,i)=>{
      const actual = outcome.value[i];
      const passed = actual.type === 'number' && typeof actual.value === 'number' && Number.isFinite(actual.value) && Math.abs(actual.value-test.expected)<=1e-9;
      return {id:test.id,passed,actual:actual.value === undefined ? actual.type : `${actual.type}: ${actual.value}`,expected:`number: ${test.expected}`};
    });
  } finally {
    // Host cleanup/grace has its own slot; do not delay the result deadline.
    signal?.removeEventListener('abort',abort);
  }
}
