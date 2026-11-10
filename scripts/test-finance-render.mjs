import {build} from 'esbuild';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const p=resolve('node_modules/.cache/finance-render-test.mjs');await build({entryPoints:['app/finance.tsx'],bundle:true,format:'esm',platform:'node',outfile:p,external:['react','react-dom','react/jsx-runtime','lucide-react'],jsx:'automatic'});const {default:F}=await import(pathToFileURL(p));const full=renderToStaticMarkup(createElement(F)),compact=renderToStaticMarkup(createElement(F,{compact:true}));for(const t of ['Previsão a receber','Despesa prevista','Extrato de caixa','Movimentos no período','Caixa registrado'])assert(full.includes(t),t);assert(compact.includes('Financeiro para acompanhar'));assert(!compact.includes('<dialog'));console.log('Finance UI SSR smoke passed.');
