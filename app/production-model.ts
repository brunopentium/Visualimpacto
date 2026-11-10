export const productionStages=['Briefing','Em produção','Em revisão','Aprovado','Entregue','Cancelado'];
export const qualityLabels={fidelity:'Aparência real e informações confirmadas preservadas',materials:'Todos os materiais obrigatórios aparecem',audio:'Áudio e licença comercial da música conferidos',resolution:'Arquivo integral, fluidez, resolução e formato 9:16 conferidos',cta:'Logo, textos e CTA revisados'};
export const emptyQuality=()=>({fidelity:false,materials:false,audio:false,resolution:false,cta:false});
export type Job={id:string;contractId:string;title:string;briefing:string;dueDate:string;status:string;revision:number;createdAt:string;updatedAt:string};
export type Version={id:string;jobId:string;assetId:string;sequence:number;sourceIds:string;checks:string;minutes:number;aiCostCents:number;notes:string;approvedBy:string;approvalDate:string;approvalNotes:string;deliveryDate:string;deliveryNotes:string;createdAt:string};
export type ProductionEvent={id:string;jobId:string;action:string;notes:string;createdAt:string};
