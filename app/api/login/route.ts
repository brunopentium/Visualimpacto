import {env} from 'cloudflare:workers';
import {randomBytes} from 'node:crypto';
import {COOKIE,digest,verifyPassword} from '../../auth';
export async function POST(request:Request){
 const headers={'Cache-Control':'no-store'};
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Origem inválida'},{status:403,headers});
 if(!env.DB||!env.ADMIN_USERNAME||!env.ADMIN_PASSWORD_HASH)return Response.json({error:'Acesso em configuração. Tente novamente mais tarde.'},{status:503,headers});
 let b:any;try{const raw=await request.text();if(raw.length>2048)throw Error();b=JSON.parse(raw);}catch{return Response.json({error:'Dados inválidos'},{status:400,headers});}
 if(typeof b?.username!=='string'||typeof b?.password!=='string'||b.password.length>256)return Response.json({error:'Usuário ou senha inválidos'},{status:401,headers});
 // A global, atomic limit for this single-owner admin also bounds untrusted client IPs.
 const window=Math.floor(Date.now()/900000);const limit=await env.DB.prepare('INSERT INTO login_limits (key, window, attempts) VALUES (?, ?, 1) ON CONFLICT(key) DO UPDATE SET attempts = CASE WHEN window = excluded.window THEN attempts + 1 ELSE 1 END, window = excluded.window RETURNING attempts').bind('admin',window).first<{attempts:number}>();
 if((limit?.attempts||0)>12)return Response.json({error:'Muitas tentativas. Aguarde 15 minutos.'},{status:429,headers:{...headers,'Retry-After':'900'}});
 if(b.username!==env.ADMIN_USERNAME||!verifyPassword(b.password))return Response.json({error:'Usuário ou senha inválidos'},{status:401,headers});
 const token=randomBytes(32).toString('hex');const now=Date.now();await env.DB.batch([env.DB.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(now),env.DB.prepare('INSERT INTO sessions (token_hash,expires_at) VALUES (?, ?)').bind(digest(token),now+43200000)]);
 return Response.json({ok:true},{headers:{...headers,'Set-Cookie':`${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=43200`}});
}
