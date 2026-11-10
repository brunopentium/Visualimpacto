import {Miniflare} from 'miniflare';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=resolve('dist/server');
const modules=readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.js')).map(f=>({type:'ESModule',path:resolve(root,f)}));
modules.sort((a,b)=>a.path===resolve(root,'index.js')?-1:b.path===resolve(root,'index.js')?1:0);
const mf=new Miniflare({modules,modulesRoot:root,compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:['DB']});
const checks=[];try{const db=await mf.getD1Database('DB');for(const file of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort()){for(const sql of readFileSync('drizzle/'+file,'utf8').split('--> statement-breakpoint').filter(s=>s.trim()))await db.prepare(sql).run();}
await db.prepare('INSERT INTO sessions (token_hash,expires_at) VALUES (?,?)').bind(createHash('sha256').update('local-test-only').digest('hex'),Date.now()+60000).run();
async function request(body,authenticated=true){return mf.dispatchFetch('https://local.test/api/crm',{method:body?'POST':'GET',headers:{Origin:'https://local.test','Content-Type':'application/json',...(authenticated?{Cookie:'__Host-vi-session=local-test-only'}:{})},...(body?{body:JSON.stringify(body)}:{})});}
assert.equal((await request(null,false)).status,401);checks.push('Anonymous API denied');
const lead={name:'QA Comércio',segment:'Alimentação',stage:'Qualificado',nextDate:'2026-11-11',nextAction:'Preparar abordagem',notes:'Teste isolado'};
let r=await request({op:'saveLead',lead});assert.equal(r.status,200,await r.clone().text());let{id}=await r.json();assert(id);checks.push('Lead creation');
let data=await(await request()).json();let current=data.leads.find(l=>l.id===id);assert(current);assert.equal(current.name,lead.name);checks.push('Persistent read');
r=await request({op:'saveLead',lead:{...current,updatedAt:'invalid-version',name:'Não salvar'}});assert.equal(r.status,409);checks.push('Concurrent update conflict');
r=await request({op:'saveLead',lead:{...current,stage:'Perdido'}});assert.equal(r.status,400);checks.push('Loss reason required');
r=await request({op:'saveLead',lead:{...current,instagram:'javascript:alert(1)'}});assert.equal(r.status,400);checks.push('Unsafe URL rejected');
const activity={leadId:id,type:'Abordagem',date:'2026-11-01',channel:'WhatsApp',notes:'Portfólio enviado'};
r=await request({op:'addActivity',activity});assert.equal(r.status,200);checks.push('Activity registration');
r=await request({op:'addActivity',activity:{...activity,date:'2099-01-01'}});assert.equal(r.status,400);checks.push('Future activity rejected');
r=await request({op:'addActivity',activity:{...activity,type:'Demonstração autorizada',authorized:false}});assert.equal(r.status,400);checks.push('Demo authorization required');
data=await(await request()).json();const event=data.activities[0];r=await request({op:'cancelActivity',id:event.id});assert.equal(r.status,200);data=await(await request()).json();assert.equal(data.activities[0].cancelled,1);checks.push('Cancellation preserves history');
await request({op:'archive',id});data=await(await request()).json();assert.equal(data.leads[0].archived,1);await request({op:'restore',id});data=await(await request()).json();assert.equal(data.leads[0].archived,0);checks.push('Archive and restore');
const exported=await mf.dispatchFetch('https://local.test/api/export',{headers:{Cookie:'__Host-vi-session=local-test-only'}});const backup=await exported.json();assert.equal(backup.schemaVersion,5);assert.equal(backup.leads.length,1);assert.equal(backup.activities.length,1);assert(!('ownerId'in backup.leads[0]));checks.push('Private full export');
console.log(JSON.stringify({checks,passed:checks.length,productionDataTouched:false}));
}finally{await mf.dispose();}
