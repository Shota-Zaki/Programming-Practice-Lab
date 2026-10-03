import { createProjectSnapshot } from './project-files.js';
import { containsCssResource } from './project-css-values.js';

// Trusted parser only. Learner HTML/CSS are data; learner JavaScript is never evaluated.
function staticParser(hasResourceFunction) {
  const nonce = document.currentScript.nonce;
  addEventListener('message', event => {
    if (event.source !== parent || !event.ports[0]) return;
    const port = event.ports[0];
    try {
      const { files, lessonId } = event.data;
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
      const safeTags = new Set(['MAIN', 'SECTION', 'HEADER', 'FOOTER', 'NAV', 'ARTICLE', 'ASIDE', 'DIV', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'P', 'UL', 'OL', 'LI', 'LABEL', 'SELECT', 'OPTION', 'BUTTON', 'STRONG', 'EM', 'SMALL', 'PRE', 'CODE', 'BR', 'HR', 'A', 'FORM', 'FIELDSET', 'LEGEND', 'DETAILS', 'SUMMARY', 'DIALOG']);
      const safeAttrs = new Set(['id', 'class', 'lang', 'title', 'for', 'value', 'selected', 'disabled', 'hidden', 'inert', 'open', 'tabindex', 'aria-hidden', 'aria-label', 'aria-describedby']);
      const copyAttributes = (source, target) => {
        for (const attr of source.attributes) if (safeAttrs.has(attr.name)) target.setAttribute(attr.name, attr.value);
      };
      const copy = (node, target) => {
        if (node.nodeType === Node.TEXT_NODE) { target.append(output.createTextNode(node.textContent)); return; }
        if (node.nodeType !== Node.ELEMENT_NODE || activeTags.has(node.tagName)) return;
        let container = target;
        if (safeTags.has(node.tagName)) {
          container = output.createElement(node.tagName.toLowerCase());
          copyAttributes(node, container);
          if (node.tagName === 'BUTTON') container.type = 'button';
          target.append(container);
        }
        for (const child of node.childNodes) copy(child, container);
      };
      for (const child of doc.body.childNodes) copy(child, output.body);
      copyAttributes(doc.documentElement, output.documentElement); copyAttributes(doc.body, output.body);
      // Escape '<' in the CSS text before HTML serialization so a literal </style> cannot end the trusted style element.
      const displayStyle = output.createElement('style'); displayStyle.nonce = nonce; displayStyle.textContent = css.replaceAll('<', '\\3c '); output.head.append(displayStyle);
      const policy = output.createElement('meta'); policy.httpEquiv = 'Content-Security-Policy';
      policy.content = "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; connect-src 'none'; base-uri 'none'; form-action 'none'";
      output.head.prepend(policy); output.documentElement.lang = 'ja';
      const viewport = output.createElement('meta'); viewport.name = 'viewport'; viewport.content = 'width=device-width, initial-scale=1'; output.head.append(viewport);
      if (lessonId === 'project01') {
        const permittedSetup = node => {
          if (node.tagName === 'SCRIPT') return expectedReference(node);
          if (node.tagName === 'LINK') return expectedReference(node) && [...node.attributes].every(attr => ['rel', 'href'].includes(attr.name));
          if (node.tagName === 'META') return (node.hasAttribute('charset') && [...node.attributes].every(attr => attr.name === 'charset'))
            || (node.getAttribute('name') === 'viewport' && [...node.attributes].every(attr => ['name', 'content'].includes(attr.name)));
          return false;
        };
        const main = doc.querySelector('body > main');
        const inMain = selector => main?.querySelector(selector);
        const reachable = node => Boolean(node && !node.closest('[hidden],[inert],[aria-hidden="true"]') && !node.matches(':disabled') && !node.hasAttribute('tabindex') && node.tabIndex >= 0);
        const options = topic ? [...topic.options] : [];
        const button = inMain('button#forget[type="button"]');
        const script = doc.querySelector('script');
        checks.splice(0, checks.length,
          { id: 'document', label: 'HTML宣言・本文言語・空でないページ名', passed: doc.doctype?.name.toLowerCase() === 'html' && /^[a-z]{2,3}(-[a-z0-9]+)*$/i.test(doc.documentElement.lang) && hasText(doc.querySelector('head title')) },
          { id: 'structure', label: '一つのmainに主見出しと紹介文', passed: Boolean(doc.querySelectorAll('main').length === 1 && main && main.querySelectorAll('h1').length === 1 && hasText(inMain('h1')) && hasText(inMain('p:not(#topic-message)'))) },
          { id: 'list', label: 'mainのul/olに空でない学習内容を2つ以上', passed: Boolean(main && [...main.querySelectorAll('ul,ol')].some(list => [...list.children].filter(node => node.tagName === 'LI' && hasText(node)).length >= 2)) },
          { id: 'topic', label: '一意なselect#topicと対応する空でないlabel', passed: Boolean(unique('topic') && topic === inMain('select#topic') && reachable(topic) && !topic.multiple && topic.size <= 1 && [...(main?.querySelectorAll('label') ?? [])].some(node => node.htmlFor === 'topic' && hasText(node))) },
          { id: 'options', label: '未選択・HTML・CSS・JavaScriptの4つの選択肢', passed: options.length === 4 && ['', 'html', 'css', 'javascript'].every(value => options.filter(option => option.value === value && hasText(option) && !option.disabled && !option.parentElement.disabled).length === 1) },
          { id: 'message', label: 'mainに一意なp#topic-messageと未選択表示', passed: unique('topic-message') && inMain('p#topic-message')?.textContent.trim() === '未選択' },
          { id: 'forget', label: 'mainに一意なtype=buttonの忘れるボタン', passed: Boolean(unique('forget') && hasText(button) && reachable(button)) },
          { id: 'references', label: 'headの相対CSSとbody末尾の空のdefer script', passed: Boolean(doc.querySelectorAll('link').length === 1 && doc.querySelector('head link[rel="stylesheet"][href="./styles.css"]') && doc.querySelectorAll('script').length === 1 && script === doc.body.lastElementChild && script?.getAttribute('src') === './app.js' && script.hasAttribute('defer') && !script.textContent.trim() && [...script.attributes].every(attr => ['src', 'defer'].includes(attr.name))) },
          { id: 'resources', label: '追加script・外部resource・未対応要素・イベント属性を使わない', passed: !unsafeMarkup && !omittedCss && all.every(node => safeTags.has(node.tagName) || ['HTML', 'HEAD', 'BODY', 'TITLE'].includes(node.tagName) || permittedSetup(node)) }
        );
        // Measure only the sanitized, script-free display copy in the opaque trusted parser.
        const measureStyle = document.createElement('style'); measureStyle.nonce = nonce; measureStyle.textContent = css; document.head.append(measureStyle);
        document.body.replaceChildren(...[...output.body.childNodes].map(node => document.importNode(node, true)));
        copyAttributes(doc.documentElement, document.documentElement); copyAttributes(doc.body, document.body);
        const visible = node => {
          if (!node || node.closest('details:not([open]),dialog:not([open])')) return false;
          for (let current = node; current; current = current.parentElement) {
            const style = getComputedStyle(current);
            if (style.display === 'none' || style.visibility !== 'visible' || Number(style.opacity) === 0 || style.contentVisibility === 'hidden') return false;
          }
          const rect = node.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.left >= 0 && rect.right <= innerWidth + 1;
        };
        const targets = ['main h1', 'main p:not(#topic-message)', 'main li', 'label[for="topic"]', 'select#topic', 'p#topic-message', 'button#forget'];
        const controls = ['select#topic', 'button#forget'];
        const usable = targets.every(selector => {
          const originals = [...doc.querySelectorAll(selector)], copies = [...document.querySelectorAll(selector)];
          return originals.length > 0 && originals.length === copies.length && originals.every((original, index) =>
            !original.closest('[hidden],[inert],[aria-hidden="true"]') && visible(copies[index]));
        }) && controls.every(selector => reachable(doc.querySelector(selector)));
        checks.push({ id: 'visible', label: '必須の内容を表示し、選択欄とボタンを操作できる', passed: usable });
        measureStyle.remove();
      }
      port.postMessage({ checks, preview: '<!doctype html>' + output.documentElement.outerHTML });
    } catch (error) { port.postMessage({ error: String(error.message).slice(0,160) }); }
    finally { port.close(); }
  }, { once: true });
}

export function inspectProjectFiles(files, { signal, lessonId = null, width = 375 } = {}) {
  if (lessonId !== null && lessonId !== 'project01') throw new TypeError('未対応の教材です');
  if (![375, 768, 1280].includes(width)) throw new TypeError('未対応の確認幅です');
  const snapshot = createProjectSnapshot(files);
  if (signal?.aborted) return Promise.reject(new DOMException('取り消しました', 'AbortError'));
  return new Promise((resolve, reject) => {
    const frame = document.createElement('iframe'); frame.dataset.projectParser = '';
    frame.style.cssText = `position:fixed;left:-10000px;top:0;width:${width}px;height:900px;border:0;visibility:hidden;pointer-events:none;`;
    frame.tabIndex = -1; frame.setAttribute('aria-hidden', 'true');
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
      if (!ended) frame.contentWindow.postMessage({ files: snapshot, lessonId }, '*', [channel.port2]);
    }, { once: true });
    frame.srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'none'; base-uri 'none'; form-action 'none'"><script nonce="${nonce}">(${staticParser.toString()})(${containsCssResource.toString()})<\/script>`;
    document.body.append(frame);
  });
}

export async function gradeProject01(files, { signal } = {}) {
  const snapshot = createProjectSnapshot(files), widths = [375, 768, 1280];
  const observations = [];
  for (const width of widths) observations.push(await inspectProjectFiles(snapshot, { signal, lessonId: 'project01', width }));
  return {
    preview: observations[0].preview,
    checks: observations[0].checks.map((check, index) => ({ ...check,
      passed: observations.every(result => result.checks[index].passed),
      actual: widths.map((width, i) => `${width}px: ${observations[i].checks[index].passed ? '確認できました' : '見直してください'}`).join(' / '),
    })),
  };
}
