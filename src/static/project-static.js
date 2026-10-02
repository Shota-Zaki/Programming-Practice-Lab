import { createProjectSnapshot } from './project-files.js';
import { containsCssResource } from './project-css-values.js';

// Trusted parser only. Learner HTML/CSS are data; learner JavaScript is never evaluated.
function staticParser(hasResourceFunction) {
  const nonce = document.currentScript.nonce;
  addEventListener('message', event => {
    if (event.source !== parent || !event.ports[0]) return;
    const port = event.ports[0];
    try {
      const files = event.data;
      const doc = new DOMParser().parseFromString(files['index.html'], 'text/html');
      const all = [...doc.querySelectorAll('*')];
      if (all.length > 2000) throw new Error('静的確認は2000要素までです');
      const hasText = node => Boolean(node?.textContent.trim());
      const unique = id => doc.querySelectorAll(`[id="${id}"]`).length === 1;
      const topic = doc.querySelector('select#topic');
      const checks = [
        { label: 'doctype、lang、title', passed: doc.doctype?.name.toLowerCase() === 'html' && Boolean(doc.documentElement.lang) && hasText(doc.querySelector('title')) },
        { label: '見出し・紹介文・学習内容リスト', passed: hasText(doc.querySelector('body main h1')) && hasText(doc.querySelector('body main p')) && [...doc.querySelectorAll('body main li')].filter(hasText).length >= 2 },
        { label: 'labelと学習テーマのselect', passed: Boolean(topic && unique('topic') && !topic.disabled && [...doc.querySelectorAll('label')].some(node => node.htmlFor === 'topic' && hasText(node)) && ['html', 'css', 'javascript'].every(value => [...topic.options].some(option => option.value === value && hasText(option)))) },
        { label: '表示先と忘れるボタン', passed: Boolean(unique('topic-message') && doc.querySelector('p#topic-message') && unique('forget') && hasText(doc.querySelector('button#forget[type="button"]:not(:disabled)'))) },
        { label: '同じフォルダのCSSとJS参照', passed: doc.querySelectorAll('script').length === 1 && Boolean(doc.querySelector('script[src="./app.js"][defer]:not([type])')) && Boolean(doc.querySelector('link[rel="stylesheet"][href="./styles.css"]')) }
      ];
      const activeTags = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'BASE', 'IFRAME', 'IMG', 'SVG', 'MATH', 'OBJECT', 'EMBED', 'AUDIO', 'VIDEO', 'SOURCE', 'TEMPLATE']);
      const expectedReference = node => (node.tagName === 'SCRIPT' && node.getAttribute('src') === './app.js' && node.hasAttribute('defer') && !node.textContent.trim())
        || (node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet' && node.getAttribute('href') === './styles.css')
        || (node.tagName === 'META' && (node.hasAttribute('charset') || node.getAttribute('name') === 'viewport'));
      const unsafeMarkup = all.some(node => (activeTags.has(node.tagName) && !expectedReference(node))
        || [...node.attributes].some(attr => /^on/i.test(attr.name) || ['style', 'action', 'formaction', 'srcdoc'].includes(attr.name))
        || (node.tagName === 'A' && node.hasAttribute('href') && !node.getAttribute('href').startsWith('#')));
      const style = document.createElement('style'); style.nonce = nonce; style.textContent = files['styles.css']; document.head.append(style);
      let omittedCss = false;
      const serializeRules = rules => [...rules].map(rule => {
        if (rule.type === CSSRule.STYLE_RULE) {
          const declarations = [];
          for (const property of rule.style) {
            const value = rule.style.getPropertyValue(property);
            // CSSOM has parsed the declarations. URL-bearing declarations are omitted from this display copy.
            if (hasResourceFunction(value)) { omittedCss = true; continue; }
            declarations.push(`${property}:${value}${rule.style.getPropertyPriority(property) ? '!important' : ''};`);
          }
          return `${rule.selectorText}{${declarations.join('')}}`;
        }
        if (rule.type === CSSRule.MEDIA_RULE) return `@media ${rule.conditionText}{${serializeRules(rule.cssRules)}}`;
        omittedCss = true; return '';
      }).join('\n');
      const css = serializeRules(style.sheet.cssRules); style.remove();
      checks.push({ label: '追加script・外部resource・イベント属性を使わない', passed: !unsafeMarkup && !omittedCss });
      const output = document.implementation.createHTMLDocument('自己紹介サイトの静的表示');
      const safeTags = new Set(['MAIN', 'SECTION', 'HEADER', 'FOOTER', 'NAV', 'ARTICLE', 'ASIDE', 'DIV', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'P', 'UL', 'OL', 'LI', 'LABEL', 'SELECT', 'OPTION', 'BUTTON', 'STRONG', 'EM', 'SMALL', 'PRE', 'CODE', 'BR', 'HR', 'A']);
      const safeAttrs = new Set(['id', 'class', 'lang', 'title', 'for', 'value', 'selected', 'disabled', 'aria-label', 'aria-describedby']);
      const copy = (node, target) => {
        if (node.nodeType === Node.TEXT_NODE) { target.append(output.createTextNode(node.textContent)); return; }
        if (node.nodeType !== Node.ELEMENT_NODE || activeTags.has(node.tagName)) return;
        let container = target;
        if (safeTags.has(node.tagName)) {
          container = output.createElement(node.tagName.toLowerCase());
          for (const attr of node.attributes) if (safeAttrs.has(attr.name)) container.setAttribute(attr.name, attr.value);
          if (node.tagName === 'BUTTON') container.type = 'button';
          target.append(container);
        }
        for (const child of node.childNodes) copy(child, container);
      };
      for (const child of doc.body.childNodes) copy(child, output.body);
      // Escape '<' in the CSS text before HTML serialization so a literal </style> cannot end the trusted style element.
      const displayStyle = output.createElement('style'); displayStyle.nonce = nonce; displayStyle.textContent = css.replaceAll('<', '\\3c '); output.head.append(displayStyle);
      const policy = output.createElement('meta'); policy.httpEquiv = 'Content-Security-Policy';
      policy.content = "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; connect-src 'none'; base-uri 'none'; form-action 'none'";
      output.head.prepend(policy); output.documentElement.lang = 'ja';
      const viewport = output.createElement('meta'); viewport.name = 'viewport'; viewport.content = 'width=device-width, initial-scale=1'; output.head.append(viewport);
      port.postMessage({ checks, preview: '<!doctype html>' + output.documentElement.outerHTML });
    } catch (error) { port.postMessage({ error: String(error.message).slice(0,160) }); }
    finally { port.close(); }
  }, { once: true });
}

export function inspectProjectFiles(files, { signal } = {}) {
  const snapshot = createProjectSnapshot(files);
  if (signal?.aborted) return Promise.reject(new DOMException('取り消しました', 'AbortError'));
  return new Promise((resolve, reject) => {
    const frame = document.createElement('iframe'); frame.hidden = true; frame.dataset.projectParser = '';
    frame.setAttribute('sandbox', 'allow-scripts'); frame.title = '成果物の静的解析';
    const channel = new MessageChannel();
    const nonce = crypto.randomUUID().replaceAll('-', '');
    let ended = false;
    const finish = (error, value) => {
      if (ended) return; ended = true; clearTimeout(timer); signal?.removeEventListener('abort', abort);
      channel.port1.close(); channel.port2.close(); frame.remove(); error ? reject(error) : resolve(value);
    };
    const abort = () => finish(new DOMException('取り消しました', 'AbortError'));
    const timer = setTimeout(() => finish(new Error('静的確認が時間内に終わりませんでした。入力は保持されています')), 2000);
    signal?.addEventListener('abort', abort, { once: true });
    channel.port1.onmessage = ({ data }) => {
      if (data?.error) finish(new Error(data.error));
      else if (Array.isArray(data?.checks) && typeof data.preview === 'string') finish(null, data);
      else finish(new Error('静的確認結果を読み取れませんでした'));
    };
    frame.addEventListener('load', () => {
      if (!ended) frame.contentWindow.postMessage(snapshot, '*', [channel.port2]);
    }, { once: true });
    frame.srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'none'; base-uri 'none'; form-action 'none'"><script nonce="${nonce}">(${staticParser.toString()})(${containsCssResource.toString()})<\/script>`;
    document.body.append(frame);
  });
}
