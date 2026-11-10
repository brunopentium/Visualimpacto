import {cookies} from 'next/headers';
import {env} from 'cloudflare:workers';
import {createHash,pbkdf2Sync,timingSafeEqual} from 'node:crypto';
export const COOKIE='__Host-vi-session';
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
export function verifyPassword(password:string){
 const stored=env.ADMIN_PASSWORD_HASH;
 if(!stored)return false;
 const [salt,hash]=stored.split(':');if(!salt||!hash)return false;
 const actual=pbkdf2Sync(password,salt,100000,32,'sha256');const expected=Buffer.from(hash,'hex');
 return actual.length===expected.length&&timingSafeEqual(actual,expected);
}
export async function getAdminUser(){const token=(await cookies()).get(COOKIE)?.value;if(!token||!env.DB)return null;const s=await env.DB.prepare('SELECT token_hash FROM sessions WHERE token_hash = ? AND expires_at > ?').bind(digest(token),Date.now()).first();return s?{userId:'owner'}:null;}
