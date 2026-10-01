export function gradeHtml(code, tests, Parser = DOMParser) {
  const doc = new Parser().parseFromString(code, 'text/html');
  return tests.map(test => {
    let passed;
    if (test.kind === 'doctype') passed = doc.doctype?.name.toLowerCase() === 'html';
    else {
      const nodes = [...doc.querySelectorAll(test.selector)];
      if (test.kind === 'exists') passed = nodes.length > 0;
      else if (test.kind === 'uniqueId') passed = nodes.some(node => node.textContent.trim()) && [...doc.querySelectorAll('[id]')].filter(node => node.id === test.value).length === 1;
      else passed = nodes.filter(node => node.textContent.trim()).length >= (test.count ?? 1);
    }
    return { id: test.id, passed: Boolean(passed) };
  });
}
