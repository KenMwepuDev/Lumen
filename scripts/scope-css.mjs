import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'Lumen Design System v2.html'), 'utf8');
const match = html.match(/<style>([\s\S]*?)<\/style>/);
if (!match) throw new Error('No <style> block found');

let css = match[1];

css = css.replace(/:root/g, '.lumen');
css = css.replace(/data-d=/g, 'data-density=');
css = css.replace(/\[data-d\]/g, '[data-density]');
css = css.replace(/\[data-style=d365\] body/g, '.lumen[data-style=d365]');
css = css.replace(/(?<!\.lumen)\[data-style=d365\]/g, '.lumen[data-style=d365]');
css = css.replace(/html\{/g, '.lumen-root{');
css = css.replace(
  /body\{margin:0;background:var\(--bg\);color:var\(--tx\);font:14px\/20px var\(--font\)\}/,
  '.lumen{margin:0;background:var(--bg);color:var(--tx);font:14px/20px var(--font)}',
);
css = css.replace(/\*\{box-sizing:border-box\}/, '.lumen,.lumen *{box-sizing:border-box}');
css = css.replace(/:focus-visible\{/, '.lumen :focus-visible{');
css = css.replace(
  /@media\(prefers-reduced-motion:reduce\)\{\*\{/,
  '@media(prefers-reduced-motion:reduce){.lumen,.lumen *{',
);
css = css.replace(/#toast/g, '.lumen-toast');
// Ensure toast is scoped under .lumen for token inheritance (prefixer skips .lumen*)
css = css.replace(/(?<![^\s{,])\.lumen-toast\{/g, '.lumen .lumen-toast{');

function prefixSelList(sel) {
  return sel
    .split(',')
    .map((s) => {
      s = s.trim();
      if (!s) return s;
      if (s.startsWith('.lumen') || s.startsWith('@')) return s;
      if (s.includes('.lumen')) return s;
      return `.lumen ${s}`;
    })
    .join(',');
}

function prefixSelectors(cssText) {
  const parts = [];
  let i = 0;
  while (i < cssText.length) {
    while (i < cssText.length && /\s/.test(cssText[i])) {
      parts.push(cssText[i]);
      i++;
    }
    if (i >= cssText.length) break;

    if (cssText.startsWith('/*', i)) {
      const end = cssText.indexOf('*/', i);
      parts.push(cssText.slice(i, end + 2));
      i = end + 2;
      continue;
    }

    if (cssText.startsWith('@keyframes', i) || cssText.startsWith('@media', i)) {
      const start = i;
      const brace = cssText.indexOf('{', i);
      let depth = 1;
      let j = brace + 1;
      while (j < cssText.length && depth > 0) {
        if (cssText[j] === '{') depth++;
        else if (cssText[j] === '}') depth--;
        j++;
      }
      const header = cssText.slice(start, brace + 1);
      const body = cssText.slice(brace + 1, j - 1);
      if (cssText.startsWith('@keyframes', i)) {
        parts.push(header + body + '}');
      } else {
        parts.push(header + prefixSelectors(body) + '}');
      }
      i = j;
      continue;
    }

    const brace = cssText.indexOf('{', i);
    if (brace === -1) {
      parts.push(cssText.slice(i));
      break;
    }
    let depth = 1;
    let j = brace + 1;
    while (j < cssText.length && depth > 0) {
      if (cssText[j] === '{') depth++;
      else if (cssText[j] === '}') depth--;
      j++;
    }
    const sel = cssText.slice(i, brace).trim();
    const body = cssText.slice(brace + 1, j - 1);
    parts.push(`${prefixSelList(sel)}{${body}}`);
    i = j;
  }
  return parts.join('');
}

css = prefixSelectors(css);

// Collapse accidental double .lumen prefixes
css = css.replace(/\.lumen \.lumen(?=[\s{[,:.])/g, '.lumen');
css = css.replace(/\.lumen \.lumen\[/g, '.lumen[');

const out = `/* Lumen Design System v2 — scoped under .lumen */\n${css}\n`;
const outPath = path.join(root, 'src/styles/lumen.css');
fs.writeFileSync(outPath, out);
console.log(`Wrote ${outPath} (${out.length} bytes)`);
