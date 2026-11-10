import {pbkdf2Sync,randomBytes} from 'node:crypto';
if(process.stdin.isTTY)process.stdin.setRawMode(true);
let input='';process.stdin.on('data',chunk=>{input+=chunk.toString();if(input.includes('\n')){const salt=randomBytes(16).toString('hex');process.stdout.write(JSON.stringify({hash:salt+':'+pbkdf2Sync(input.trim(),salt,100000,32,'sha256').toString('hex')}));process.exit(0);}});
