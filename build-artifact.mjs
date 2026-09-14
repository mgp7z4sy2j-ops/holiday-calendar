// index.html 是完整文档（GitHub Pages 用）。Artifact 要的是不带外壳的片段，
// 由这里剥掉 doctype / html / head / body 生成，避免维护两份 HTML。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const fragment = readFileSync(join(here, 'index.html'), 'utf8')
  .replace(/<!doctype html>\s*/i, '')
  .replace(/<\/?html[^>]*>\s*/gi, '')
  .replace(/<\/?head[^>]*>\s*/gi, '')
  .replace(/<body[^>]*>\s*/i, '')
  .replace(/\s*<\/body>\s*/i, '\n')
  .replace(/<meta\s+charset[^>]*>\s*/i, '')
  .replace(/<meta\s+name="viewport"[^>]*>\s*/i, '')
  .trim() + '\n';

// <header> 不能算命中，所以标签名后必须跟空白或 >
const stray = [
  ['doctype', /<!doctype/i],
  ['html', /<\/?html[\s>]/i],
  ['head', /<\/?head[\s>]/i],
  ['body', /<\/?body[\s>]/i],
].filter(([, re]) => re.test(fragment));
if (stray.length) {
  console.error(`剥离失败，仍含: ${stray.map(([n]) => n).join(', ')}`);
  process.exit(1);
}

const out = join(here, '.artifact');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'index.html'), fragment);
console.log(`${join(out, 'index.html')}  ${fragment.length} 字符，外壳已剥离`);
console.log('发布 Artifact 时用这个文件，files 里带上 events.js');
