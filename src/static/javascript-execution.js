// Lifecycle only: createWorker must provide a separately reviewed execution host.
// A same-origin Worker is not an authority or storage isolation boundary.
export function createExecutionController({ createWorker }) {
  if (typeof createWorker !== 'function') throw new TypeError('createWorker is required');
  let active = null;
  let sequence = 0;
  function finish(job, result) {
    if (active !== job) return;
    active = null;
    clearTimeout(job.timer);
    if (job.worker) {
      job.worker.onmessage = job.worker.onerror = job.worker.onmessageerror = null;
      job.worker.terminate();
    }
    job.resolve(result);
  }
  return {
    get running() { return active !== null; },
    stop() { if (active) finish(active, { status: 'cancelled' }); },
    run({ code, timeoutMs = 2000 }) {
      if (typeof code !== 'string' || !Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 30000) {
        throw new TypeError('code must be text; timeoutMs must be an integer from 1 to 30000');
      }
      if (active) finish(active, { status: 'cancelled' });
      return new Promise(resolve => {
        const job = { id: ++sequence, resolve, worker: null, timer: null };
        active = job;
        try {
          job.worker = createWorker();
          if (active !== job) { job.worker.terminate(); return; }
          job.worker.onmessage = ({ data }) => {
            if (active !== job || !data || data.id !== job.id) return;
            if (data.status === 'success') finish(job, { status: 'success', value: data.value });
            else finish(job, { status: 'error' });
          };
          job.worker.onerror = event => {
            event.preventDefault?.();
            finish(job, { status: 'error' });
          };
          job.worker.onmessageerror = () => finish(job, { status: 'error' });
          job.timer = setTimeout(() => finish(job, { status: 'timeout' }), timeoutMs);
          job.worker.postMessage({ id: job.id, code });
        } catch {
          finish(job, { status: 'error' });
        }
      });
    },
  };
}
