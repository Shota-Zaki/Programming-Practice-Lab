// One host slot, no queue. Keep it reserved through observed native shutdown grace.
// This bounds creation rate; the grace is not a browser-independent termination guarantee.
let hostSlot = null;
export const javascriptHostBusy = () => hostSlot !== null;
export const javascriptHostReady = () => hostSlot?.ready ?? Promise.resolve();
const SHUTDOWN_GRACE_MS = 5000;
// Trusted bootstrap; learner code is compiled only inside its dedicated Worker.
function learnerWorker(token) {
  'use strict';
  const send = globalThis.postMessage.bind(globalThis);
  const compile = Function;
  const apply = Reflect.apply;
  const slice = Function.prototype.call.bind(String.prototype.slice);
  const define = Object.defineProperty;
  const noLog = () => {};
  for (const name of ['Worker', 'SharedWorker', 'postMessage', 'close']) {
    define(globalThis, name, { value: undefined, writable: false, configurable: false });
  }
  define(globalThis, 'console', { value: Object.freeze({log:noLog,info:noLog,warn:noLog,error:noLog,debug:noLog,table:noLog}), writable:false, configurable:false });
  const valueOf = value => {
    const type = typeof value;
    if (type === 'number' || type === 'boolean') return { type, value };
    if (type === 'string') return { type, value: slice(value, 0, 160) };
    return { type: value === null ? 'null' : type };
  };
  addEventListener('message', async event => {
    event.stopImmediatePropagation();
    try {
      const { code, spec } = event.data;
      const run = apply(compile, null, [...spec.parameters, '"use strict";\n' + code + '\n;return (' + spec.returnExpression + ');']);
      const values = [];
      for (let i = 0; i < spec.inputs.length; i++) values[i] = valueOf(await apply(run, undefined, spec.inputs[i]));
      send({ token, values });
    } catch { send({ token, error: true }); }
  }, { once: true });
}

function executionFrame(workerSource, token) {
  'use strict';
  addEventListener('message', event => {
    if (event.source !== parent || !event.ports[0]) return;
    const port = event.ports[0];
    let worker, url;
    const cleanup = () => { worker?.terminate(); if (url) URL.revokeObjectURL(url); };
    addEventListener('pagehide', cleanup, {once:true});
    const error = () => { cleanup(); port.postMessage({ id:event.data.id, status:'error', terminated:true }); port.close(); };
    try {
      url = URL.createObjectURL(new Blob([workerSource], {type:'text/javascript'}));
      worker = new Worker(url);
      worker.onmessage = ({data}) => {
        if (data?.token !== token) return;
        const values = data.values;
        if (data.error || !Array.isArray(values) || values.length !== event.data.spec.inputs.length
          || !values.every(v => v && ['number','string','boolean','null','undefined','object','function','symbol','bigint'].includes(v.type)
            && (v.type !== 'string' || (typeof v.value === 'string' && v.value.length <= 160)))) { error(); return; }
        cleanup(); port.postMessage({ id:event.data.id, status:'success', value:values, terminated:true }); port.close();
      };
      worker.onerror = e => { e.preventDefault(); error(); };
      worker.onmessageerror = error;
      // Acknowledge the native termination request; browsers may finish shutdown later.
      port.onmessage = ({data}) => { if (data?.stop) { cleanup(); port.postMessage({terminated:true}); port.close(); } };
      worker.postMessage(event.data);
    } catch { error(); }
  }, { once: true });
}

export function createOpaqueWorker(spec) {
  if (hostSlot) throw new Error('JavaScript host is still stopping');
  const frame = document.createElement('iframe');
  frame.dataset.javascriptHost = '';
  frame.setAttribute('sandbox', 'allow-scripts');
  frame.setAttribute('aria-hidden', 'true'); frame.tabIndex = -1; frame.hidden = true;
  frame.title = 'JavaScript演習実行';
  const channel = new MessageChannel();
  const secret = () => [...crypto.getRandomValues(new Uint8Array(16))].map(n => n.toString(16).padStart(2,'0')).join('');
  const nonce = secret(), token = secret();
  const workerSource = `(${learnerWorker.toString()})(${JSON.stringify(token)})`;
  let ready = false, stopped = false, message, released = false, closeTimer, resolveClosed;
  const closed = new Promise(resolve => { resolveClosed = resolve; });
  let resolveReady;
  const slot = {ready:new Promise(resolve => {resolveReady=resolve;})};
  hostSlot = slot;
  const release = () => {
    if (released) return; released = true; clearTimeout(closeTimer);
    channel.port1.close(); channel.port2.close(); frame.remove(); resolveClosed();
    const finishGrace = () => { if (hostSlot === slot) hostSlot = null; resolveReady(); };
    if (ready && message) setTimeout(finishGrace, SHUTDOWN_GRACE_MS); else finishGrace();
  };
  const adapter = {
    onmessage:null, onerror:null, onmessageerror:null, closed,
    postMessage(job) { message = {...job, spec}; if (ready && !stopped) send(); },
    terminate() {
      if (stopped) return;
      stopped = true;
      if (!ready) { release(); return; }
      if (released) return;
      channel.port1.postMessage({stop:true});
      // Trusted bootstrap must acknowledge termination before its frame is removed.
      // pagehide is a second termination path if the browser never delivers an ack.
      closeTimer = setTimeout(release, 1000);
    },
  };
  const send = () => frame.contentWindow.postMessage(message, '*', [channel.port2]);
  channel.port1.onmessage = event => {
    if (event.data?.terminated) release();
    if (!stopped) adapter.onmessage?.(event);
  };
  channel.port1.onmessageerror = event => { if (!stopped) adapter.onmessageerror?.(event); };
  frame.onload = () => { ready = true; if (message && !stopped) send(); };
  frame.srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}' 'unsafe-eval'; worker-src blob:; connect-src 'none'; base-uri 'none'; form-action 'none'"><script nonce="${nonce}">(${executionFrame.toString()})(${JSON.stringify(workerSource).replaceAll('<','\\u003c')},${JSON.stringify(token)})<\/script>`;
  try { document.body.append(frame); } catch(error) { release(); throw error; }
  return adapter;
}
