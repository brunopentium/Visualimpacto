import {env} from 'cloudflare:workers';
import {cookies} from 'next/headers';
import {COOKIE,digest} from '../../auth';
export async function POST(request:Request){if(request.headers.get('origin')!==new URL(request.url).origin)return new Response('Origem inválida',{status:403});const token=(await cookies()).get(COOKIE)?.value;if(token&&env.DB)await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(digest(token)).run();return new Response(null,{status:303,headers:{Location:'/', 'Cache-Control':'no-store','Set-Cookie':`${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`}});}
