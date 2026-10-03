import { test } from 'node:test';
import assert from 'node:assert/strict';
import { containsCssResource } from '../src/static/project-css-values.js';
test('resource function tokens include string image URLs and CSS escapes', () => {
  for (const value of ['url("/leak")', 'image-set("/leak" 1x)', '-webkit-image-set("/leak" 1x)', 'i\\6d age-set("/leak" 1x)', 'u\\72l("/leak")', '\\75 rl("/leak")', 'var(--asset, image-set("/leak" 1x))', 'cross-fade(image("/leak"),red)', 'paint(example)']) {
    assert.equal(containsCssResource(value), true, value);
  }
});
test('ordinary colors/layout/variables and quoted text remain available', () => {
  for (const value of ['#fff', 'calc(100% - 2rem)', 'var(--tone, green)', 'linear-gradient(red, blue)', '"url(image-set)"', "'image-set(/text)'", '/* image-set("/comment") */ red', '"\\75 rl(/text)"']) {
    assert.equal(containsCssResource(value), false, value);
  }
});
