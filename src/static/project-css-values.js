// Scan CSSOM declaration tokens, including unparsed custom-property values.
// This is display-copy filtering; the opaque frame and CSP remain the boundary.
export function containsCssResource(value) {
  const resources = new Set(['url', 'src', 'image', 'image-set', '-webkit-image-set', 'cross-fade', '-webkit-cross-fade', 'paint']);
  let index = 0;
  const escape = () => {
    index++; const match = /^[0-9a-f]{1,6}/i.exec(value.slice(index));
    if (!match) return value[index++] ?? '';
    index += match[0].length;
    if (/\s/.test(value[index] ?? '')) index++;
    const point = Number.parseInt(match[0], 16);
    return String.fromCodePoint(point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff) ? point : 0xfffd);
  };
  const nameCharacter = char => Boolean(char && (/[\w-]/.test(char) || char.charCodeAt(0) >= 128));
  while (index < value.length) {
    if (value.startsWith('/*', index)) {
      const end = value.indexOf('*/', index + 2); if (end < 0) return true; index = end + 2; continue;
    }
    if (value[index] === '"' || value[index] === "'") {
      const quote = value[index++];
      while (index < value.length && value[index] !== quote) { if (value[index] === '\\') escape(); else index++; }
      if (index >= value.length) return true; index++; continue;
    }
    if (nameCharacter(value[index]) || value[index] === '\\') {
      let name = '';
      while (index < value.length && (nameCharacter(value[index]) || value[index] === '\\')) name += value[index] === '\\' ? escape() : value[index++];
      if (value[index] === '(' && resources.has(name.toLowerCase())) return true;
    } else index++;
  }
  return false;
}
