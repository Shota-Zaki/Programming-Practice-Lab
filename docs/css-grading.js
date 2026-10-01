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
      const measure = (node, property) => {
        if (!node) return '';
        if (property === 'outer-width') return String(node.getBoundingClientRect().width);
        const children = [...node.children];
        const rects = children.map(child => child.getBoundingClientRect());
        let opaque = false; for (let ancestor = node; ancestor; ancestor = ancestor.parentElement) if (Number(getComputedStyle(ancestor).opacity) === 0) opaque = true;
        const visible = !opaque && children.length > 0 && children.every((child, i) => rects[i].width > 0 && rects[i].height > 0 && !['absolute','fixed'].includes(getComputedStyle(child).position) && getComputedStyle(child).visibility === 'visible' && Number(getComputedStyle(child).opacity) > 0)
          && getComputedStyle(node).visibility === 'visible' && Number(getComputedStyle(node).opacity) > 0;
        if (property === 'visible-items') return String(visible);
        if (property === 'columns' || property === 'rows') {
          if (!visible) return '0';
          const positions = [];
          for (const rect of rects) { const pos = property === 'columns' ? rect.left : rect.top; if (!positions.some(n => Math.abs(n-pos) <= 0.5)) positions.push(pos); }
          return String(positions.length);
        }
        if (property === 'equal-columns') return String(visible && Math.max(...rects.map(r => r.width))-Math.min(...rects.map(r => r.width)) <= 1);
        if (property === 'no-overflow') return String(node.scrollWidth <= node.clientWidth + 1 && document.documentElement.scrollWidth <= innerWidth + 1 && node.getBoundingClientRect().right <= innerWidth + 1 && node.getBoundingClientRect().left >= -1);
        return getComputedStyle(node).getPropertyValue(property);
      };
      const results = tests.map(test => {
        const checks = (test.checks ?? [test]).map(check => {
          const node = document.querySelector(check.selector);
          const actual = measure(node, check.property);
          const selectorMatches = !check.requiredSelector || rules.some(rule => rule.selectorText?.split(',').map(s => s.trim()).includes(check.requiredSelector) && rule.style.getPropertyValue(check.property));
          return { passed: Boolean(node && actual === check.expected && selectorMatches), actual, expected: check.expected };
        });
        return { id: test.id, passed: checks.every(check => check.passed), actual: checks.map(check => check.actual).join(' / '), expected: checks.map(check => check.expected).join(' / ') };
      });
      port.postMessage({ results });
    } catch { port.postMessage({ error: true }); }
    finally { port.close(); }
  }, { once: true });
}

function gradeCssAtWidth(css, lesson, { signal, timeoutMs = 2000 } = {}, width = 800) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(new DOMException('Cancelled', 'AbortError')); return; }
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    frame.title = 'CSS採点';
    frame.style.cssText = `position:fixed;left:-10000px;top:0;width:${width}px;height:600px;border:0;pointer-events:none`;
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
    if (settled) frame.remove();
  });
}

export async function gradeCss(css, lesson, options = {}) {
  const widths = lesson.viewports ?? [800];
  if (!widths.length || widths.some(width => !Number.isInteger(width) || width < 320 || width > 1600)) throw new Error('Invalid grading viewport');
  const outcomes = [];
  for (const width of widths) {
    const resolveCheck = check => ({...check, expected:check.byWidth?.[width] ?? check.expected});
    const completionTests = lesson.completionTests.map(test => test.checks ? {...test,checks:test.checks.map(resolveCheck)} : resolveCheck(test));
    outcomes.push(await gradeCssAtWidth(css, {...lesson,completionTests}, options, width));
  }
  return lesson.completionTests.map((test,i) => ({id:test.id,passed:outcomes.every(result => result[i].passed),
    actual:outcomes.map((result,j) => `${widths[j]}px: ${result[i].actual}`).join(' | '),
    expected:outcomes.map((result,j) => `${widths[j]}px: ${result[i].expected}`).join(' | ')}));
}

export function lessonPreview(code, lesson) {
  const content = lesson.language === 'css'
    ? `<style>${code.replaceAll('<', '\\3c ')}</style>${lesson.markup}` : code;
  return `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'none'; base-uri 'none'">${content}`;
}
