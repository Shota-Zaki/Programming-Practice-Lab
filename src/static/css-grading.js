// This fixed program runs in an opaque-origin frame. Learner CSS is only data.
function gradingFrame() {
  const nonce = document.currentScript.nonce;
  addEventListener('message', event => {
    if (event.source !== parent || !event.ports[0]) return;
    const port = event.ports[0];
    try {
      const { css, markup, tests } = event.data;
      document.body.innerHTML = markup; // Trusted lesson fixture, never learner HTML.
      const style = document.createElement('style');
      style.nonce = nonce;
      style.textContent = css;
      document.head.append(style);
      const rules = [...style.sheet.cssRules];
      const results = tests.map(test => {
        const node = document.querySelector(test.selector);
        const actual = node ? test.property === 'outer-width' ? String(node.getBoundingClientRect().width) : getComputedStyle(node).getPropertyValue(test.property) : '';
        return { id: test.id, passed: Boolean(node && actual === test.expected && (!test.requiredSelector || rules.some(rule => rule.selectorText?.split(',').map(s => s.trim()).includes(test.requiredSelector) && rule.style.getPropertyValue(test.property)))), actual, expected: test.expected };
      });
      port.postMessage({ results });
    } catch { port.postMessage({ error: true }); }
    finally { port.close(); }
  }, { once: true });
}

export function gradeCss(css, lesson, { signal, timeoutMs = 2000 } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(new DOMException('Cancelled', 'AbortError')); return; }
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    frame.title = 'CSS採点';
    frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:800px;height:600px;border:0;pointer-events:none';
    const channel = new MessageChannel();
    let settled = false;
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      channel.port1.close(); channel.port2.close(); frame.remove();
      if (error) reject(error); else resolve(result);
    };
    const abort = () => finish(new DOMException('Cancelled', 'AbortError'));
    const timer = setTimeout(() => finish(new Error('CSS grading timed out')), timeoutMs);
    signal?.addEventListener('abort', abort, { once: true });
    channel.port1.onmessage = ({ data }) => {
      const valid = Array.isArray(data?.results) && data.results.length === lesson.completionTests.length
        && data.results.every((r, i) => r.id === lesson.completionTests[i].id && typeof r.passed === 'boolean');
      finish(valid ? null : new Error('CSS grading failed'), data?.results);
    };
    frame.onload = () => {
      if (!settled) frame.contentWindow.postMessage({ css, markup: lesson.markup, tests: lesson.completionTests }, '*', [channel.port2]);
    };
    const nonce = [...crypto.getRandomValues(new Uint8Array(16))].map(n => n.toString(16).padStart(2, '0')).join('');
    frame.srcdoc = `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; form-action 'none'; base-uri 'none'"><script nonce="${nonce}">(${gradingFrame.toString()})()<\/script></head><body></body></html>`;
    document.body.append(frame);
  });
}

export function lessonPreview(code, lesson) {
  const content = lesson.language === 'css'
    ? `<style>${code.replaceAll('<', '\\3c ')}</style>${lesson.markup}` : code;
  return `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'none'; base-uri 'none'">${content}`;
}
