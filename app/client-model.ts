export const plans={Piloto:{quantity:1,priceCents:19700},Presença:{quantity:2,priceCents:39700},Vitrine:{quantity:4,priceCents:69700},Destaque:{quantity:8,priceCents:119700}};
export const contractStatuses=['Em preparação','Ativo','Encerrado','Cancelado'];
export const categories=['Logo','Fachada','Ambiente interno','Dono','Funcionário','Produto','Serviço','Referência criativa','Documento','Outro'];
export const authorizations=['Pendente','Autorizado','Restrito'];
export const MAX_FILE_SIZE=20*1024*1024;
export type Client={id:string;leadId:string|null;name:string;segment:string;contactName:string;phone:string;email:string;brandNotes:string;notes:string;archived:number;createdAt:string;updatedAt:string};
export type Contract={id:string;clientId:string;plan:string;quantity:number;priceCents:number;periodStart:string;periodEnd:string;dueDate:string;status:string;agreement:string;briefing:string;createdAt:string;updatedAt:string};
export type Asset={id:string;clientId:string;contractId:string|null;filename:string;mime:string;size:number;sha256:string;category:string;authorization:string;rightsNotes:string;required:number;archived:number;createdAt:string;updatedAt:string};
