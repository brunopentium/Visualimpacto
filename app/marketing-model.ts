export const channels=['Instagram','Facebook','WhatsApp','Site','Outro'];
export const campaignStatuses=['Planejada','Em andamento','Pausada','Encerrada'];
export const contentStatuses=['Ideia','Rascunho','Pronto','Planejado','Publicado','Cancelado'];
export const formats=['Reels','Story','Carrossel','Post','Outro'];
export const metricKeys=['views','reach','likes','comments','shares','saves','clicks'] as const;
export const metricLabels:Record<string,string>={views:'Visualizações',reach:'Alcance',likes:'Curtidas',comments:'Comentários',shares:'Compartilhamentos',saves:'Salvamentos',clicks:'Cliques'};
export type Campaign={id:string;name:string;status:string;goal:string;audience:string;startDate:string;endDate:string;budgetCents:number;notes:string;revision:number;updatedAt:string};
export type Content={id:string;campaignId:string|null;assetId:string|null;title:string;status:string;channel:string;format:string;plannedDate:string;plannedTime:string;caption:string;hashtags:string;cta:string;brief:string;rightsNotes:string;approvalNotes:string;publishedDate:string;url:string;revision:number;updatedAt:string};
export type Reading={id:string;contentId:string;date:string;createdAt:string;notes:string}&Record<typeof metricKeys[number],number|null>;
export type Link={id:string;campaignId:string;leadId:string|null;expenseId:string|null;notes:string;active:number;revision:number};
export function validDate(v:unknown):v is string{return typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v;}
export function safeURL(v:string){try{const u=new URL(v);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password;}catch{return false;}}
export function latestReadings(rows:Reading[]){const map=new Map<string,Reading>();for(const r of rows){const old=map.get(r.contentId);if(!old||r.date>old.date||r.date===old.date&&(r.createdAt>old.createdAt||r.createdAt===old.createdAt&&r.id>old.id))map.set(r.contentId,r);}return [...map.values()];}
export function campaignSummary(id:string,links:Link[],clients:{id:string;leadId:string|null}[],contracts:{clientId:string|null;status:string}[],entries:{expenseId:string|null;kind:string;cancelled:number;amountCents:number}[]){const active=links.filter(l=>l.active&&l.campaignId===id),leads=new Set(active.flatMap(l=>l.leadId?[l.leadId]:[])),expenses=new Set(active.flatMap(l=>l.expenseId?[l.expenseId]:[])),converted=clients.filter(c=>c.leadId&&leads.has(c.leadId)&&contracts.some(k=>k.clientId===c.id&&['Ativo','Encerrado'].includes(k.status))).length,paid=entries.filter(e=>!e.cancelled&&e.kind==='Pagamento'&&e.expenseId&&expenses.has(e.expenseId)).reduce((n,e)=>n+e.amountCents,0);return {leads:leads.size,converted,paid,cpl:leads.size?Math.round(paid/leads.size):null};}
export const emptyCampaign=()=>({name:'',status:'Planejada',goal:'',audience:'',startDate:'',endDate:'',budgetCents:0,notes:''});
export const emptyContent=()=>({campaignId:'',assetId:'',title:'',status:'Ideia',channel:'Instagram',format:'Reels',plannedDate:'',plannedTime:'',caption:'',hashtags:'',cta:'',brief:'',rightsNotes:'',approvalNotes:'',publishedDate:'',url:''});
