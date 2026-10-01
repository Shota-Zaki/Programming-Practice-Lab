export function gradeHtml(code, tests, Parser = DOMParser) {
  const doc = new Parser().parseFromString(code, 'text/html');
  const hasText = node => Boolean(node?.textContent.trim());
  const uniqueId = node => Boolean(node.id.trim()) && [...doc.querySelectorAll('[id]')].filter(other => other.id === node.id).length === 1;
  const validControl = (node, form) => node.form === form && !node.matches(':disabled') && node.required && uniqueId(node)
    && Boolean(node.name.trim())
    && [...form.elements].filter(other => other.name === node.name).length === 1
    && [...form.querySelectorAll('label')].some(label => label.htmlFor === node.id && hasText(label));
  const validForms = [...doc.querySelectorAll('body form')].filter(form =>
    ['text', 'email'].every(type => [...form.querySelectorAll('input')].some(node => node.getAttribute('type')?.toLowerCase() === type && validControl(node, form)))
    && [...form.querySelectorAll('button[type="submit"]')].some(button => button.form === form && !button.matches(':disabled') && hasText(button)));
  return tests.map(test => {
    let passed;
    if (test.kind === 'doctype') passed = doc.doctype?.name.toLowerCase() === 'html';
    else if (test.kind === 'main') passed = doc.querySelectorAll('main').length === 1 && hasText(doc.querySelector('body > main h1'));
    else if (test.kind === 'section') passed = [...doc.querySelectorAll('body > main section')].some(section => hasText(section.querySelector(':scope > h2')) && hasText(section.querySelector(':scope > p')));
    else if (test.kind === 'list') passed = [...doc.querySelectorAll(test.selector)].some(list => [...list.querySelectorAll(':scope > li')].filter(hasText).length >= 2);
    else if (test.kind === 'fragmentLink') passed = [...doc.querySelectorAll('body a[href]')].some(link => {
      const href = link.getAttribute('href');
      if (!hasText(link) || !href.startsWith('#') || href.length < 2) return false;
      try { const target = doc.getElementById(decodeURIComponent(href.slice(1))); return target && doc.body.contains(target) && uniqueId(target); } catch { return false; }
    });
    else if (test.kind === 'image') passed = [...doc.querySelectorAll('body img')].some(node => node.getAttribute('src') === test.value && node.getAttribute('alt')?.trim());
    else if (test.kind === 'form') passed = validForms.length > 0;
    else if (test.kind === 'control') passed = [...doc.querySelectorAll('body form')].some(form => [...form.querySelectorAll('input')].some(node => node.getAttribute('type')?.toLowerCase() === test.value && validControl(node, form)));
    else {
      const nodes = [...doc.querySelectorAll(test.selector)];
      if (test.kind === 'exists') passed = nodes.length > 0;
      else if (test.kind === 'uniqueId') passed = nodes.some(node => node.textContent.trim()) && [...doc.querySelectorAll('[id]')].filter(node => node.id === test.value).length === 1;
      else passed = nodes.filter(node => node.textContent.trim()).length >= (test.count ?? 1);
    }
    return { id: test.id, passed: Boolean(passed) };
  });
}
