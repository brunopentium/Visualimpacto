import fs from 'node:fs';
const p='app/dashboard.tsx';let s=fs.readFileSync(p,'utf8');
s=s.replace("import {useEffect,useState} from 'react';","import {useEffect,useState} from 'react';\nimport Prospecting from './prospecting';");
const start=s.indexOf("{tab==='Meu dia'?<>"),end=s.indexOf(":tab==='Configurações'?",start);if(start<0||end<0)throw Error('Unexpected dashboard shape');
s=s.slice(0,start)+"{tab==='Meu dia'||tab==='Prospecção'?<Prospecting home={tab==='Meu dia'} onProspecting={()=>setTab('Prospecção')} onSettings={()=>setTab('Configurações')} targets={values}/>"+s.slice(end);
s=s.replace('Exporte configurações e histórico em JSON. Esta etapa ainda não contém clientes, trabalhos ou arquivos.','Exporte configurações, comércios, atividades e histórico em JSON. Guarde o arquivo em local privado.').replace('Etapa 1 · Sem envios ou cobranças automáticas','Etapa 2 · Sem envios ou cobranças automáticas');
fs.writeFileSync(p,s);
