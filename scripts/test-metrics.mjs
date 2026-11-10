import {readFileSync} from 'node:fs';
import {transformSync} from 'esbuild';
import assert from 'node:assert/strict';
const{code}=transformSync(readFileSync('app/crm-model.ts','utf8'),{loader:'ts',format:'esm'});const{metrics}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const l=[{id:'a',archived:0},{id:'b',archived:0},{id:'c',archived:1}];const event=(id,type,date,extra={})=>({leadId:id,type,date,cancelled:0,...extra});
const e=[event('a','Abordagem','2026-11-02'),event('a','Abordagem','2026-11-03'),event('a','Resposta','2026-11-05'),event('a','Resposta','2026-11-06'),event('a','Retorno','2026-11-07'),event('b','Abordagem','2026-10-01'),event('b','Resposta','2026-11-06'),event('c','Abordagem','2026-11-03'),event('a','Demonstração autorizada','2026-11-04',{cancelled:1})];
const m=metrics(l,e,'2026-11-02','2026-11-08');assert.equal(m.newContacts,1);assert.equal(m.responses,2);assert.equal(m.responseRate,100);assert.equal(m.followups,1);assert.equal(m.demos,0);assert.equal(metrics([],[],'2026-11-02','2026-11-08').responseRate,null);console.log('Metrics passed: unique first contact, response cohort, archive, cancelled events, zero denominators.');
