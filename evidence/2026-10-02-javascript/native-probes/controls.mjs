import {createServer} from 'node:http';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
for(const mode of ['idle','finite','infinite','raw-infinite']){
 const events=[];const html=`<script>const w=new Worker(URL.createObjectURL(new Blob([${JSON.stringify(mode==='idle'?'onmessage=()=>postMessage("idle")':mode==='finite'?'onmessage=()=>{const end=Date.now()+1800;while(Date.now()<end){};postMessage("done")}':'onmessage=()=>{while(true){}}')}] ,{type:'text/javascript'})));w.postMessage(1);setTimeout(()=>{w.terminate();document.title='terminated'},100)</script>`;
 const s=createServer((q,r)=>r.end(html));await new Promise(r=>s.listen(0,'127.0.0.1',r));let b;
 try{b=await chromium.launch({headless:true});const c=await b.newBrowserCDPSession();let p;
 if(mode==='raw-infinite'){await c.send('Target.createTarget',{url:`http://127.0.0.1:${s.address().port}`})}else{p=await b.newPage();p.on('worker',w=>{events.push(['worker',w.url()]);w.on('close',()=>events.push(['closed',w.url()]))});await p.goto(`http://127.0.0.1:${s.address().port}`)}
 await delay(600);const a=(await c.send('SystemInfo.getProcessInfo')).processInfo;await delay(500);const z=(await c.send('SystemInfo.getProcessInfo')).processInfo;const targets=(await c.send('Target.getTargets')).targetInfos.map(t=>({id:t.targetId,type:t.type,url:t.url,title:t.title}));await delay(1600);const end=(await c.send('SystemInfo.getProcessInfo')).processInfo;console.log(JSON.stringify({mode,version:b.version(),events,targets,cpu:z.map(x=>({id:x.id,type:x.type,delta:x.cpuTime-(a.find(y=>y.id===x.id)?.cpuTime??x.cpuTime),later:end.find(y=>y.id===x.id)?.cpuTime-x.cpuTime})),workers:p?.workers().length}));
 }finally{await b?.close();await new Promise(r=>s.close(r))}
}
