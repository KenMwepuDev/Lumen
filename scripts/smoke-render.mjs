import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Dynamic import of built ESM bundle is awkward due to CSS side-effect.
// Smoke-test by transforming via Vite SSR instead.
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const root = path.resolve('demo');
const server = await createServer({
  root,
  configFile: false,
  plugins: [react()],
  resolve: {
    alias: {
      'lumen-ds': path.resolve('src/index.ts'),
      'lumen-ds/styles.css': path.resolve('src/styles/lumen.css'),
    },
  },
  server: { middlewareMode: true },
  appType: 'custom',
});

try {
  const mod = await server.ssrLoadModule('/src/App.tsx');
  const html = renderToString(createElement(mod.App));
  const checks = [
    ['Lumen Design System', html.includes('Lumen Design System')],
    ['Dynamics chip', html.includes('Dynamics 365')],
    ['Process stepper', html.includes('Gabriele Cannata')],
    ['Data grid', html.includes('Factures')],
    ['SIREN', html.includes('SIREN')],
    ['lumen class', html.includes('lumen')],
    ['Primary button', html.includes('btn p') || html.includes('Primaire')],
  ];
  let ok = true;
  for (const [name, pass] of checks) {
    console.log(`${pass ? 'OK' : 'FAIL'}  ${name}`);
    if (!pass) ok = false;
  }
  console.log(`HTML length: ${html.length}`);
  if (!ok) process.exit(1);
} finally {
  await server.close();
}
