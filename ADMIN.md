# Visual Impacto — Admin

Etapa 1: acesso próprio por usuário e senha, configurações em D1, histórico de gravações e exportação JSON. Sem dados operacionais fictícios.

## Segurança e operação
- Página de entrada acessível; painel e APIs exigem sessão válida, armazenada por hash em D1. Cookies HttpOnly, Secure e SameSite=Strict, expiração em 12h e logout revogável.
- Senha derivada com PBKDF2 SHA-256 e salt aleatório, segredo apenas no ambiente do servidor. Limite global de 12 tentativas a cada janela de 15 minutos. Um atacante pode consumir esse limite; evoluir para rate limit de borda em implantação independente.
- POST valida origem, formato, tamanho e metas numéricas.
- GitHub contém apenas código. Nunca commitar clientes, uploads, segredos ou exports.
- Exportação manual de configurações e histórico. Ainda não há restauração nem backup automático.
- Segredos necessários: ADMIN_USERNAME e ADMIN_PASSWORD_HASH. Nunca commitar valores. Migrações devem ser aplicadas antes de servir as APIs.

## Etapa 2 entregue
Prospecção e Meu dia: comércios, segmentos e origem livres, funil, eventos com data de realização, próxima ação, arquivo/restauração e cancelamento de registro sem apagar histórico. Exportação inclui comércios e eventos. Sem importação ou disparos.
Métricas usam atividades: primeira abordagem por comércio, respostas únicas no período e resposta da coorte de novos abordados; mudar etapa não fabrica eventos. Metas semanais e indicadores usam America/Sao_Paulo. Arquivados são excluídos dos indicadores, mas preservados no export.

## Etapa 3 entregue
Clientes novos ou vinculados à prospecção, sem fabricar venda ou alterar o funil. Importação de dados é uma cópia inicial. Cada período de plano ou piloto fica em um registro de serviço separado, com quantidade e preço oficiais, prazo opcional, briefing e condições informadas pelo administrador. Ativação exige registro da confirmação. Nenhuma renovação, cobrança ou contrato externo é automático.

Biblioteca usa R2 BUCKET; D1 armazena metadados, categoria, origem/autorização (pendente, autorizado ou restrito), vínculo opcional ao serviço e marca de material obrigatório. Somente o dono autenticado envia e baixa; não há URL pública de arquivos. Download sempre como anexo, com nosniff e política restritiva. Original não é transcodificado ou comprimido: SHA-256 permite verificar igualdade de bytes após download. Até 20 MiB por arquivo; JPG, PNG, WebP, MP4, MOV, PDF e TXT UTF-8. Extensão e assinatura de conteúdo são verificadas, mas não há antivírus nem validação de direitos automática. Não abrir arquivos não confiáveis.

Arquivar preserva dados e originais; não cancela serviços. Remoção definitiva e limpeza de retenção não estão implementadas. JSON inclui todos os cadastros/metadados (inclusive arquivados), não os binários: baixar originais separadamente. Sem restauração automática. Dados, arquivos e segredos nunca entram no GitHub.

## Etapa 4 entregue
Produção por vídeo contratado: planejamento, briefing/prazo, etapas, versões e materiais utilizados, checklist manual de qualidade, tempo e custo de IA por versão, aprovação e entrega registradas pelo administrador. Cada vídeo não cancelado reserva uma vaga; gatilhos SQLite na migração 0004 limitam a quantidade em gravações concorrentes e impedem reduzir plano abaixo do reservado. Preservar esses gatilhos nas migrações futuras.

Versões, aprovações e entregas exigem cliente/serviço ativos. Materiais devem pertencer ao cliente e ao serviço ou ser gerais, ativos e autorizados. Materiais gerais obrigatórios valem para todos os vídeos do cliente; os vinculados valem para aquele serviço. Aprovação/entrega revalidam o conjunto obrigatório e as autorizações atuais. A presença real nas cenas e o checklist são conferidos por pessoa, não por análise automática de vídeo. Nenhum envio, publicação ou pagamento é presumido.

A versão mais recente é a única elegível para aprovação/entrega. Nova versão retorna à revisão. Reabrir uma entrega exige nova versão para nova aprovação; a entrega anterior permanece no histórico. Reabertura ocupa a mesma vaga e não duplica vídeos entregues. Eventos e mudanças são gravados juntos com controle de revisão inteira para evitar conflitos de telas simultâneas. Não há exclusão definitiva de versões/eventos.

Meu dia exibe prazos e quantidades em revisão/aprovadas. Tempo e custo são informados por versão, incluindo retrabalho, não medições ou despesas de caixa automáticas. Exportação JSON inclui produção, versões e eventos, sem arquivos binários. Não há prazo comercial ou limite de revisões imposto pelo sistema.

## Próximas etapas
5. Financeiro: cobranças e recebimentos separados, caixa e custo.
6. Marketing e indicadores por período de entrada no funil.

Não há disparos, publicações, contratação ou cobrança automática.
