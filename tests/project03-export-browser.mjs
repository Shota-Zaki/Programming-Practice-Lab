import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep, join } from 'node:path';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = resolve('docs'), output = resolve(process.env.EVIDENCE_DIR || 'evidence/2026-10-03-project03-export/browser');
await mkdir(output,{recursive:true});
const server = createServer(async(req,res)=>{
  try {
    const path = new URL(req.url,'http://local').pathname.replace(/^\/Programming-Practice-Lab\//,'/');
    const file = resolve(root,'.'+(path==='/'?'/index.html':path));
    if (!file.startsWith(root+sep)) throw Error('path');
    res.setHeader('Content-Type',{'.js':'text/javascript','.html':'text/html','.css':'text/css'}[extname(file)]||'text/plain'); res.end(await readFile(file));
  } catch { res.writeHead(404);res.end(); }
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const origin = `http://127.0.0.1:${server.address().port}`, browser = await chromium.launch({headless:true}), results=[];
const setFile = async(page,name,code)=>{ await page.getByRole('tab',{name,exact:true}).click();await page.locator('#project-editor').fill(code); };
const select = page=>page.locator('[data-project-lesson="project03-export"]').click();
const inspect = async page=>{ await page.locator('#project-verify-bundle').click();await page.locator('#project-bundle-result').filter({hasText:/一致しました|不一致があります|照合できません/}).waitFor(); };
try {
  for (const width of [375,768,1280]) {
    const page = await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}), errors=[],leaks=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',route=>{const url=route.request().url();if(url.startsWith('http')&&!url.startsWith(origin+'/')){leaks.push(url);return route.abort();}return route.continue();});
    await page.goto(origin+'/Programming-Practice-Lab/#lesson');
    await page.locator('#lesson-picker [data-project-open="project03-export"]').click();
    assert.equal(await page.locator('#project-title').textContent(),'書き出したファイルを照合する');
    assert.match(await page.locator('#project-breadcrumb').textContent(),/PROJECT03 EXPORT/);
    assert.equal(await page.locator('#project-bundle-panel').isVisible(),true);
    assert.equal(await page.locator('#project-examples details').count(),2);
    const files = await page.evaluate(async()=>({... (await import('./project-lessons.js')).project02Css.exampleFiles,'app.js':'window.PROJECT03_RAN=true;fetch("https://example.invalid/leak");while(true){}\n// </script> 🦉\n'}));
    for (const [name,code] of Object.entries(files)) await setFile(page,name,code);
    await page.evaluate(()=>localStorage.setItem('ppl.profile.v1.topic','css'));
    const baseline = await page.evaluate(()=>({old:localStorage.getItem('ppl.foundation.progress.v1'),project01:localStorage.getItem('ppl.foundation.project01.progress.v1'),native:localStorage.getItem('ppl.profile.v1.topic')}));
    await page.locator('#project-inspect').click();await page.getByText(/静的確認を更新しました。JavaScript/).waitFor();
    assert.match(await page.locator('#project-result').textContent(),/静的CSS条件を確認できました.*project03全体は未完了/);
    assert.equal(await page.locator('[data-course-progress]').first().textContent(),'0 / 24');
    const folder=join(output,`export-${width}`);await mkdir(folder,{recursive:true});
    await page.locator('#project-export').click();await page.locator('#project-downloads button').first().waitFor();
    for (const name of ['index.html','styles.css','app.js','README.txt','manifest.json']) {
      const [download] = await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:`${name}を取得`,exact:true}).click()]);
      assert.equal(download.suggestedFilename(),name);await download.saveAs(join(folder,name));
      if (Object.hasOwn(files,name)) assert.deepEqual(await readFile(join(folder,name)),Buffer.from(files[name],'utf8'));
    }
    const paths = ['index.html','styles.css','app.js','manifest.json','README.txt'].map(name=>join(folder,name));
    await page.locator('#project-bundle-files').setInputFiles(paths);await inspect(page);
    assert.match(await page.locator('#project-bundle-result').textContent(),/一致しました.*project03全体は未完了/);
    assert.equal(await page.locator('#project-bundle-checks li').count(),3);
    assert.ok((await page.locator('#project-bundle-checks li').allTextContents()).every(text=>/manifest一致.*現編集一致/.test(text)));
    assert.equal(await page.locator('[data-course-progress]').first().textContent(),'0 / 24');
    assert.equal(await page.locator('#project-native').isDisabled(),true);
    assert.equal(await page.evaluate(()=>window.PROJECT03_RAN),undefined);
    assert.deepEqual(await page.evaluate(()=>({old:localStorage.getItem('ppl.foundation.progress.v1'),project01:localStorage.getItem('ppl.foundation.project01.progress.v1'),native:localStorage.getItem('ppl.profile.v1.topic')})),baseline);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:join(output,`lesson-${width}.png`),fullPage:true});
    await page.locator('#project-bundle-panel').screenshot({path:join(output,`comparison-${width}.png`)});
    await writeFile(join(folder,'app.js'),files['app.js']+'//changed');
    await page.locator('#project-bundle-files').setInputFiles(paths);await inspect(page);
    assert.match(await page.locator('#project-bundle-checks').textContent(),/app.js.*manifest不一致.*現編集不一致/);
    assert.equal(await page.locator('#project-editor').inputValue(),files['app.js']);
    await writeFile(join(folder,'app.js'),files['app.js']);await page.locator('#project-bundle-files').setInputFiles(paths);
    await setFile(page,'app.js',files['app.js']+'//new editor');await inspect(page);
    assert.match(await page.locator('#project-bundle-checks').textContent(),/app.js.*manifest一致.*現編集不一致/);
    await setFile(page,'app.js',files['app.js']);
    await page.locator('#project-bundle-files').setInputFiles(paths.slice(0,3));await inspect(page);
    assert.match(await page.locator('#project-bundle-result').textContent(),/照合できませんでした/);assert.equal(await page.locator('#project-bundle-checks li').count(),0);
    await page.locator('#project-bundle-files').setInputFiles(paths);await inspect(page);
    page.once('dialog',dialog=>dialog.dismiss());await page.locator('#project-reset').click();
    assert.match(await page.locator('#project-bundle-result').textContent(),/一致しました/);
    if (width===375) {
      for (const action of ['cancel','edit','switch','move','reset','reselect']) {
        for (const [name,code] of Object.entries(files)) await setFile(page,name,code);
        await page.locator('#project-bundle-files').setInputFiles(paths);
        await page.evaluate(()=>{const original=crypto.subtle.digest.bind(crypto.subtle);window._pplOriginalDigest=original;window._pplReleaseDigest=null;crypto.subtle.digest=(...args)=>new Promise(resolve=>window._pplReleaseDigest=()=>original(...args).then(resolve));document.querySelector('#project-verify-bundle').click();});
        await page.waitForFunction(()=>typeof window._pplReleaseDigest==='function');
        if(action==='cancel')await page.locator('#project-cancel').click();
        if(action==='edit')await setFile(page,'app.js',files['app.js']+'//edit while verifying');
        if(action==='switch')await page.locator('[data-project-lesson="project02-css"]').click();
        if(action==='move'){await page.evaluate(()=>location.hash='course');await page.locator('#course-title').waitFor();}
        if(action==='reset'){page.once('dialog',dialog=>dialog.accept());await page.locator('#project-reset').click();}
        if(action==='reselect')await page.locator('#project-bundle-files').setInputFiles(paths.slice(0,4));
        await page.evaluate(async()=>{crypto.subtle.digest=window._pplOriginalDigest;await window._pplReleaseDigest();});
        assert.match(await page.locator('#project-bundle-result').textContent(),/未照合/,action);
        assert.equal(await page.locator('#project-bundle-checks li').count(),0);
        assert.equal(await page.locator('#project-inspect').isDisabled(),false);
        if(action==='move'){await page.evaluate(()=>location.hash='project');await page.locator('#project-title').waitFor();}
        await select(page);results.push({case:`late-digest/${action}`,pass:true});
      }
    }
    await page.reload();await page.locator('#project-title').waitFor();await select(page);
    assert.equal(await page.locator('#project-bundle-files').evaluate(node=>node.files.length),0);
    assert.match(await page.locator('#project-bundle-result').textContent(),/未照合/);
    assert.deepEqual(await page.evaluate(()=>({old:localStorage.getItem('ppl.foundation.progress.v1'),project01:localStorage.getItem('ppl.foundation.project01.progress.v1'),native:localStorage.getItem('ppl.profile.v1.topic')})),baseline);
    assert.deepEqual(errors,[]);assert.deepEqual(leaks,[]);
    results.push({width,case:'actual5downloads/reselect/bytes+manifest+current/read-only/mismatch/reload/no-execution',pass:true});await page.close();
  }
  await writeFile(join(output,'results.json'),JSON.stringify({browser:browser.version(),results},null,2)+'\n');
  console.log(JSON.stringify({result:'PASS',browser:browser.version(),cases:results.length,downloads:15,widths:3,lateRaces:6}));
}finally{await browser.close();await new Promise(done=>server.close(done));}
