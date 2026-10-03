// Only for disposable Playwright contexts served by the local test server.
export async function readFoundationState(page) {
  await page.waitForFunction(() => document.querySelector('#save-status')?.dataset.state === 'saved');
  return page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('ppl.foundation.progress', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result; db.onversionchange = () => db.close();
      const transaction = db.transaction('records'), read = transaction.objectStore('records').get('foundation');
      transaction.oncomplete = () => { db.close(); resolve(read.result.state); };
      transaction.onabort = () => { db.close(); reject(transaction.error); };
    };
  }));
}
export async function discardTestProgress(page) {
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide'));
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase('ppl.foundation.progress');
      request.onsuccess = resolve; request.onerror = () => reject(request.error);
      request.onblocked = () => reject(Error('Test database still open'));
    });
  });
}
