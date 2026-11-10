import {build} from 'esbuild';
import {renderToStaticMarkup} from 'react-dom/server';
import {createElement} from 'react';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const path=resolve('node_modules/.cache/prospect-render-test.mjs');await build({entryPoints:['app/prospect-ai.tsx'],bundle:true,platform:'node',format:'esm',outfile:path,external:['react','react-dom','react/jsx-runtime','lucide-react'],jsx:'automatic'});const {default:AI,ResearchDetails}=await import(pathToFileURL(path));const html=renderToStaticMarkup(createElement(AI,{leads:[],onImported:async()=>{}}));for(const value of ['Gerar prompt','Importar lista','Quantidade','Categorias','Critérios adicionais','Capacidade de pagamento','20'])assert(html.includes(value),value);assert.equal(renderToStaticMarkup(createElement(ResearchDetails,{raw:'invalid json'})),'');console.log('Prospect UI SSR smoke passed.');
