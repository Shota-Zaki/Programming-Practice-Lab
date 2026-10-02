import { createExecutionController } from './javascript-execution.js';
import { reserveJavaScriptHost, javascriptHostBusy } from './javascript-host.js';

// Learner-facing API is a restricted bridge, not a native Worker document.
function domWorker(token) {
  'use strict';
  const send = globalThis.postMessage.bind(globalThis), compile = Function;
  const apply = Reflect.apply, define = Object.defineProperty, freeze = Object.freeze;
  const create = Object.create, stringify = String;
  const slice = Function.prototype.call.bind(String.prototype.slice);
  const own = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
  const stop = Function.prototype.call.bind(Event.prototype.stopImmediatePropagation);
  const ProxyClass = Proxy, PromiseClass = Promise;
  const nodes = create(null), listeners = create(null);
  let listenerCount = 0;
  for (const name of ['Worker','SharedWorker','postMessage','close']) define(globalThis,name,{value:undefined,writable:false,configurable:false});
  const quiet = () => {};
  define(globalThis,'console',{value:freeze({log:quiet,info:quiet,warn:quiet,error:quiet,debug:quiet,table:quiet}),writable:false,configurable:false});
  const emit = message => send({token,...message});
  const restricted = object => new ProxyClass(freeze(object), {
    get(target,key) { if (!own(target,key)) throw new TypeError('Unsupported DOM bridge API: '+stringify(key)); return target[key]; },
  });
  const update = state => {
    for (let i=0;i<state.length;i++) {
      const item=state[i];
      if (!own(nodes,item.selector)) {
        const cached={textContent:item.textContent,value:item.value,hasValue:item.hasValue};
        const base=create(null);
        for (const property of ['textContent','value']) define(base,property,{
          enumerable:true,
          get() { if(property==='value'&&!cached.hasValue)throw new TypeError('value is unsupported on this element');return cached[property]; },
          set(value) { if(property==='value'&&!cached.hasValue)throw new TypeError('value is unsupported on this element');if(!['string','number','boolean'].includes(typeof value))throw new TypeError('DOM bridge writes require string, number or boolean');const text=slice(stringify(value),0,160);cached[property]=text;emit({kind:'write',selector:item.selector,property,value:text}); },
        });
        define(base,'addEventListener',{value(type,handler,options) {
          if(!['click','input'].includes(type)||typeof handler!=='function'||options!==undefined)throw new TypeError('DOM bridge supports click/input function listeners without options');
          const key=item.selector+'|'+type;
          const list=listeners[key]??(listeners[key]=[]);
          for(let i=0;i<list.length;i++)if(list[i]===handler)return;
          if(listenerCount>=16)throw new Error('DOM bridge listener limit');
          list[list.length]=handler;listenerCount++;
          if(list.length===1)emit({kind:'listen',selector:item.selector,type});
        }});
        nodes[item.selector]={cached,element:restricted(base)};
      }
      nodes[item.selector].cached.textContent=item.textContent;nodes[item.selector].cached.value=item.value;
    }
  };
  addEventListener('message',async event=>{
    if (!event.isTrusted) return; // Guest dispatchEvent cannot impersonate the private host.
    stop(event);
    try {
      const data=event.data;update(data.state);
      if(data.kind==='start') {
        const document=restricted(Object.assign(create(null),{querySelector(selector) {
          if(typeof selector!=='string'||!/^#[A-Za-z][\w-]{0,63}$/.test(selector))throw new TypeError('DOM bridge selectors must be simple IDs');
          return own(nodes,selector)?nodes[selector].element:null;
        }}));
        await apply(compile,null,['document','"use strict";\n'+data.code])(document);
      } else {
        const target=nodes[data.selector]?.element;if(!target)throw new Error('Invalid event target');
        let currentTarget=target;const eventBase=Object.assign(create(null),{type:data.type,target});define(eventBase,'currentTarget',{get:()=>currentTarget,enumerable:true});const eventObject=restricted(eventBase);
        const list=listeners[data.selector+'|'+data.type]??[];
        const length=list.length; // Registrations during dispatch start with the next event.
        try {for(let i=0;i<length;i++){const result=apply(list[i],target,[eventObject]);if(result instanceof PromiseClass)await result;}}finally{currentTarget=null;}
      }
      emit({kind:'done'});
    } catch { emit({kind:'error'}); }
  });
}

// Only trusted code can touch native DOM or produce snapshots in this realm.
function domFrame(workerSource, token) {
  'use strict';
  addEventListener('message',event=>{
    if(event.source!==parent||!event.ports[0])return;
    const port=event.ports[0];let worker,url,finished=false,operations=0,step=0;
    const fixture=event.data.fixture, snapshots=[], nodes=new Map(), subscriptions=new Set();
    const cleanup=()=>{worker?.terminate();if(url)URL.revokeObjectURL(url);};
    addEventListener('pagehide',cleanup,{once:true});
    const finish=(status,value)=>{if(finished)return;finished=true;cleanup();port.postMessage({id:event.data.id,status,value,terminated:true});port.close();};
    const snapshot=()=>fixture.selectors.map(selector=>{const node=nodes.get(selector);return {selector,textContent:String(node.textContent).slice(0,160),value:'value'in node?String(node.value).slice(0,160):'',hasValue:'value'in node};});
    try {
      document.body.innerHTML=fixture.markup; // Trusted fixture, never learner text.
      for(const selector of fixture.selectors){const node=document.querySelector(selector);if(!node||document.querySelectorAll(selector).length!==1)throw new Error('Fixture element must have one unique ID');nodes.set(selector,node);}
      for(const [selector,node] of nodes){if(String(node.textContent).length>160||('value'in node&&String(node.value).length>160)||[...nodes].some(([other,child])=>other!==selector&&node.contains(child)))throw new Error('Fixture targets must be bounded and independent');}
      for(const action of fixture.steps){const node=nodes.get(action.selector);if(node.matches(':disabled')||node.closest('[inert]')||(action.type==='click'&&(!(node instanceof HTMLButtonElement)||node.type!=='button'))||(action.type==='input'&&!((node instanceof HTMLInputElement&&node.type==='text')||node instanceof HTMLTextAreaElement))||(action.type==='input'&&node.readOnly))throw new Error('Unsupported interactive fixture');}
      url=URL.createObjectURL(new Blob([workerSource],{type:'text/javascript'}));worker=new Worker(url);
      const forward=(selector,type)=>worker.postMessage({kind:'event',selector,type,state:snapshot()});
      worker.onmessage=({data})=>{
        if(finished||data?.token!==token)return;
        try {
          if(++operations>256)throw new Error('Operation limit');
          if(data.kind==='write') {
            const node=nodes.get(data.selector);
            if(!node||!['textContent','value'].includes(data.property)||typeof data.value!=='string'||data.value.length>160||(data.property==='value'&&!('value'in node)))throw new Error('Invalid write');
            node[data.property]=data.value;
          } else if(data.kind==='listen') {
            const node=nodes.get(data.selector),key=data.selector+'|'+data.type;
            if(!node||!['click','input'].includes(data.type)||subscriptions.size>=16)throw new Error('Invalid listener');
            if(!subscriptions.has(key)){subscriptions.add(key);node.addEventListener(data.type,()=>forward(data.selector,data.type));}
          } else if(data.kind==='done') {
            snapshots.push(snapshot());
            if(step===fixture.steps.length){finish('success',snapshots);return;}
            const action=fixture.steps[step++],node=nodes.get(action.selector);
            if(action.type==='click')node.click();else{node.value=action.value;node.dispatchEvent(new Event('input',{bubbles:true}));}
            // No subscriber is a valid wrong answer; snapshot the unchanged state.
            if(!subscriptions.has(action.selector+'|'+action.type))forward(action.selector,action.type);
          } else { throw new Error('Worker failed'); }
        } catch { finish('error'); }
      };
      worker.onerror=e=>{e.preventDefault();finish('error');};worker.onmessageerror=()=>finish('error');
      port.onmessage=({data})=>{if(data?.stop)finish('cancelled');};
      worker.postMessage({kind:'start',code:event.data.code,state:snapshot()});
    } catch { finish('error'); }
  },{once:true});
}

function createDomWorker(fixture) {
  const frame=document.createElement('iframe');frame.dataset.domHost='';frame.hidden=true;frame.tabIndex=-1;frame.title='DOM演習実行';frame.setAttribute('aria-hidden','true');frame.setAttribute('sandbox','allow-scripts');
  const channel=new MessageChannel();
  const secret=()=>[...crypto.getRandomValues(new Uint8Array(16))].map(n=>n.toString(16).padStart(2,'0')).join('');
  const nonce=secret(),token=secret();const slot=reserveJavaScriptHost();let ready=false,released=false,stopped=false,message,timer;
  const release=()=>{if(released)return;released=true;clearTimeout(timer);channel.port1.close();channel.port2.close();frame.remove();slot.release(Boolean(ready&&message));};
  const adapter={onmessage:null,onerror:null,onmessageerror:null,
    postMessage(job){message={...job,fixture};if(ready&&!stopped)send();},
    terminate(){if(stopped)return;stopped=true;if(!ready){release();return;}if(!released){channel.port1.postMessage({stop:true});timer=setTimeout(release,1000);}},
  };
  const send=()=>frame.contentWindow.postMessage(message,'*',[channel.port2]);
  channel.port1.onmessage=event=>{if(event.data?.terminated)release();if(!stopped)adapter.onmessage?.(event);};
  channel.port1.onmessageerror=event=>{if(!stopped)adapter.onmessageerror?.(event);};
  frame.onload=()=>{ready=true;if(message&&!stopped)send();};
  const source=`(${domWorker.toString()})(${JSON.stringify(token)})`;
  frame.srcdoc=`<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}' 'unsafe-eval'; worker-src blob:; connect-src 'none'; base-uri 'none'; form-action 'none'"><script nonce="${nonce}">(${domFrame.toString()})(${JSON.stringify(source).replaceAll('<','\\u003c')},${JSON.stringify(token)})<\/script>`;
  try{document.body.append(frame);}catch(error){release();throw error;}
  return adapter;
}

export async function executeDomLesson(code,fixture,{signal,timeoutMs=2000}={}) {
  if(signal?.aborted)throw new DOMException('Cancelled','AbortError');
  const byteLength=text=>new TextEncoder().encode(text).length;
  if(typeof code!=='string'||byteLength(code)>32768)throw new Error('DOM bridge code exceeds32KiB');
  if(typeof fixture?.markup!=='string'||byteLength(fixture.markup)>32768||!Array.isArray(fixture.selectors)||fixture.selectors.length<1||fixture.selectors.length>8||new Set(fixture.selectors).size!==fixture.selectors.length||fixture.selectors.some(s=>typeof s!=='string'||!/^#[A-Za-z][\w-]{0,63}$/.test(s))||!Array.isArray(fixture.steps)||fixture.steps.length>16||fixture.steps.some(s=>!fixture.selectors.includes(s.selector)||!['click','input'].includes(s.type)||(s.type==='input'&&(typeof s.value!=='string'||s.value.length>160))))throw new Error('Invalid DOM fixture');
  if(javascriptHostBusy())throw new Error('JavaScript host is still stopping');
  const controller=createExecutionController({createWorker:()=>createDomWorker(fixture)});
  const abort=()=>controller.stop();signal?.addEventListener('abort',abort,{once:true});
  try {
    const result=await controller.run({code,timeoutMs});
    if(result.status==='cancelled'||signal?.aborted)throw new DOMException('Cancelled','AbortError');
    if(result.status!=='success')throw new Error(result.status==='timeout'?'DOM execution timed out':'DOM execution failed: supported bridge APIs are simple ID querySelector, textContent/value and click/input function listeners');
    const snapshots=result.value;
    if(!Array.isArray(snapshots)||snapshots.length!==fixture.steps.length+1||snapshots.some(state=>!Array.isArray(state)||state.length!==fixture.selectors.length||state.some((node,i)=>node.selector!==fixture.selectors[i]||typeof node.textContent!=='string'||node.textContent.length>160||typeof node.value!=='string'||node.value.length>160||typeof node.hasValue!=='boolean')))throw new Error('Invalid DOM snapshots');
    return snapshots;
  } finally {signal?.removeEventListener('abort',abort);}
}
