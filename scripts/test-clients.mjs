import {Miniflare} from 'miniflare';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=resolve('dist/server');const modules=readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.js')).map(f=>({type:'ESModule',path:resolve(root,f)}));modules.sort((a,b)=>a.path===resolve(root,'index.js')?-1:b.path===resolve(root,'index.js')?1:0);
const mf=new Miniflare({modules,modulesRoot:root,compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:['DB'],r2Buckets:['BUCKET']});
const checks=[],cookie='__Host-vi-session=local-test-only';
try{
const db=await mf.getD1Database('DB');for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())for(const sql of readFileSync('drizzle/'+f,'utf8').split('--> statement-breakpoint').filter(s=>s.trim()))await db.prepare(sql).run();
await db.prepare('INSERT INTO sessions (token_hash,expires_at) VALUES (?,?)').bind(createHash('sha256').update('local-test-only').digest('hex'),Date.now()+600000).run();
const req=(path,body,origin='https://local.test')=>mf.dispatchFetch('https://local.test'+path,{method:body?'POST':'GET',headers:{Origin:origin,Cookie:cookie,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
const save=body=>req('/api/clients',body);const get=async()=>await(await req('/api/clients')).json();
for(const p of ['/api/clients','/api/assets?id=x'])assert.equal((await mf.dispatchFetch('https://local.test'+p)).status,401);checks.push('Anonymous clients and original denied');
assert.equal((await save({op:'saveClient',client:{name:'Sem segmento'}})).status,400);checks.push('Client validation');
const leadResp=await req('/api/crm',{op:'saveLead',lead:{name:'QA Loja',segment:'Moda',stage:'Em conversa'}});const leadId=(await leadResp.json()).id;
const client={leadId,name:'QA Loja',segment:'Moda',contactName:'Teste',phone:'',email:'',brandNotes:'Preservar logo',notes:''};let r=await save({op:'saveClient',client});assert.equal(r.status,200,await r.clone().text());const clientId=(await r.json()).id;
assert.equal((await save({op:'saveClient',client})).status,409);assert.equal((await(await req('/api/crm')).json()).leads[0].stage,'Em conversa');checks.push('Lead linked once without fabricating sale');
assert.equal((await req('/api/clients',{op:'saveClient',client},'https://other.test')).status,403);checks.push('Cross-origin write rejected');
let data=await get(),c=data.clients[0];assert.equal((await save({op:'saveClient',client:{...c,updatedAt:'stale'}})).status,409);checks.push('Concurrent client update protected');
const contract={clientId,plan:'Vitrine',quantity:999,priceCents:1,periodStart:'2026-11-10',periodEnd:'2026-12-09',dueDate:'2026-11-15',status:'Ativo',agreement:'',briefing:'CTA confirmado'};
assert.equal((await save({op:'saveContract',contract})).status,400);contract.agreement='Confirmação registrada para teste isolado';r=await save({op:'saveContract',contract});assert.equal(r.status,200,await r.clone().text());const contractId=(await r.json()).id;data=await get();assert.equal(data.contracts[0].priceCents,69700);assert.equal(data.contracts[0].quantity,4);checks.push('Agreement required and official price/quantity enforced');
assert.equal((await save({op:'saveContract',contract:{...contract,periodEnd:'2026-11-01'}})).status,400);checks.push('Period validation');
const bytes=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aGasAAAAASUVORK5CYII=','base64');
async function upload({filename='logo.png',content=bytes,authorization='Autorizado',rightsNotes='Cliente autorizou uso no teste',cid=clientId,kid=contractId}={}){const form=new FormData();form.set('file',new File([content],filename));form.set('clientId',cid);form.set('contractId',kid);form.set('category','Logo');form.set('authorization',authorization);form.set('rightsNotes',rightsNotes);form.set('required','true');const encoded=new Response(form);return mf.dispatchFetch('https://local.test/api/assets',{method:'POST',headers:{Origin:'https://local.test',Cookie:cookie,'Content-Type':encoded.headers.get('Content-Type')},body:new Uint8Array(await encoded.arrayBuffer())});}
assert.equal((await upload({rightsNotes:''})).status,400);assert.equal((await upload({filename:'logo.svg',content:'<svg></svg>'})).status,400);assert.equal((await upload({filename:'false.png',content:'not an image'})).status,400);checks.push('Authorization source, file extension and signature checked');
assert.equal((await upload({cid:'not-owned'})).status,400);assert.equal((await upload({content:Buffer.alloc(21*1024*1024)})).status,413);checks.push('Client ownership and upload cap enforced');
r=await upload();assert.equal(r.status,200,await r.clone().text());const uploaded=await r.json();assert.equal(uploaded.sha256,createHash('sha256').update(bytes).digest('hex'));data=await get();const asset=data.assets[0];assert.equal(asset.required,1);assert.equal(asset.contractId,contractId);assert(!('objectKey'in asset));checks.push('Original stored privately with category, job and digest');
r=await req('/api/assets?id='+asset.id);assert.equal(r.status,200);assert.deepEqual(Buffer.from(await r.arrayBuffer()),bytes);assert.match(r.headers.get('content-disposition'),/^attachment/);assert.equal(r.headers.get('x-content-type-options'),'nosniff');checks.push('Downloaded bytes exactly match uploaded original');
await db.prepare("INSERT INTO assets SELECT 'foreign','another-owner',client_id,contract_id,object_key,filename,mime,size,sha256,category,authorization,rights_notes,required,archived,created_at,updated_at FROM assets WHERE id=?").bind(asset.id).run();assert.equal((await req('/api/assets?id=foreign')).status,404);checks.push('Foreign-owner file denied');
assert.equal((await save({op:'updateAsset',asset:{...asset,required:true,updatedAt:'stale'}})).status,409);checks.push('Concurrent material classification protected');
assert.equal((await save({op:'archiveAsset',id:asset.id})).status,200);data=await get();assert.equal(data.assets[0].archived,1);assert.equal((await req('/api/assets?id='+asset.id)).status,200);await save({op:'restoreAsset',id:asset.id});checks.push('File archive reversible, original preserved');
await save({op:'archiveClient',id:clientId});assert.equal((await upload()).status,400);assert.equal((await save({op:'saveContract',contract})).status,400);await save({op:'restoreClient',id:clientId});checks.push('Archived client cannot receive new service or upload');
data=await get();assert.equal(data.clients[0].archived,0);const backup=await(await req('/api/export')).json();assert.equal(backup.schemaVersion,7);assert.equal(backup.clients.length,1);assert.equal(backup.contracts.length,1);assert.equal(backup.assets.length,1);assert.equal(backup.filesIncluded,false);assert(!('objectKey'in backup.assets[0]));assert(!('ownerId'in backup.assets[0]));checks.push('Export contains records, not binaries or storage keys');
console.log(JSON.stringify({checks,passed:checks.length,productionDataTouched:false}));
}finally{await mf.dispose();}
