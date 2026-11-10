import {build} from 'esbuild';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const p=resolve('node_modules/.cache/marketing-render-test.mjs');await build({entryPoints:['app/marketing.tsx'],bundle:true,format:'esm',platform:'node',outfile:p,external:['react','react-dom','react/jsx-runtime','lucide-react'],jsx:'automatic'});const {default:M}=await import(pathToFileURL(p));const full=renderToStaticMarkup(createElement(M)),compact=renderToStaticMarkup(createElement(M,{compact:true}));for(const t of ['Planejar, divulgar, aprender.','Calendário','Campanhas e origem','Conteúdo','uma publicação por canal'.toLowerCase()])assert(full.toLowerCase().includes(t.toLowerCase()),t);assert(compact.includes('Divulgação em dia'));assert(!compact.includes('<dialog'));console.log('Marketing UI SSR smoke passed; authenticated visual QA still required.');
