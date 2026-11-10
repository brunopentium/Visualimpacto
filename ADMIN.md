# Visual Impacto — Admin

## Etapa 6 entregue — marketing interno
Calendário mensal por canal, ideias/rascunhos, campanhas com objetivo, público, datas e orçamento planejado. Planejamento não agenda publicação. “Publicado” exige legenda, registro de aprovação, data real e link; cada rede tem registro independente. Publicações ficam bloqueadas para edição até reabertura explícita com motivo, sem alterar redes externas. O histórico de gravações permanece no export.

Arquivo de cliente é referência privada; exige material autorizado e registro específico da permissão de divulgação pela agência. Autorização de produção não implica autorização de portfólio. Originais não são comprimidos ou publicados pelo módulo.

Métricas são leituras manuais acumuladas e imutáveis; o resumo usa a mais recente por conteúdo e URL de publicação atual. Datas anteriores à publicação e futuras são recusadas. Campos desconhecidos ficam nulos, não zero. Contagens não são pessoas únicas. Cada leitura mantém URL e data, e todas permanecem no backup.

Contato e despesa podem ser atribuídos a uma campanha principal, sem sobrescrever a origem do CRM. Desvincular exige motivo e preserva registro. Contatos atribuídos incluem arquivados no acumulado histórico. Conversão indica cliente vinculado ao contato com serviço Ativo/Encerrado, não apenas mudança de etapa do funil. Custos pagos somam somente movimentos de Pagamento não cancelados das despesas atribuídas; orçamento e previsão não são gastos. Custo por contato é descritivo, não causalidade, ROAS ou promessa de venda. O filtro de canal aplica-se a conteúdos/leituras; atribuições e caixa são acumulados da campanha inteira.

Nenhum envio, postagem, ativação de anúncio, cobrança ou movimentação financeira automática. Controle de revisão evita sobrescritas concorrentes; chaves de formulário evitam repetição de cadastros/leituras. Backup passa a schemaVersion 7 e inclui os quatro conjuntos de marketing. APIs autenticadas, origem exata no POST e arquivos sem URL pública.

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

## Etapa 5 — Financeiro manual
Previsões a receber por período/serviço confirmado (preço oficial do contrato) ou adicional avulso; despesas previstas por categoria e vínculo opcional ao serviço. Previsões não criam lançamentos de caixa. Um serviço tem no máximo uma previsão não cancelada; períodos futuros e parcelas não são gerados automaticamente. Previsão é fotografia do valor combinado, não acompanha alterações posteriores do contrato. Cancelar contrato não cancela previsões nem movimenta caixa automaticamente.

Movimentos: recebimento parcial com bruto e taxa, pagamento de despesa parcial, reembolso ligado ao recebimento original, aporte, retirada e saldo inicial positivo/negativo. Tudo é declaração do administrador sobre movimento já ocorrido, sem integração bancária, Mercado Pago, emissão de nota, cobrança ou transferência real. Nunca armazenar senhas, número completo de cartão ou chaves secretas na referência. Taxas de recebimento não devem ser lançadas novamente como despesa. Valores são centavos inteiros; números negativos só por direção da abertura.

Resultado operacional de caixa do período = recebimentos brutos − reembolsos − taxas − despesas pagas; não é lucro contábil/fiscal, e exclui capital e abertura. Saldo de caixa é acumulado dos registros, não saldo bancário consultado. Contratado usa serviços ativos/encerrados por data de início no período; a receber/a pagar incluem todo o saldo pendente. Financeiro no Meu dia aponta valores e vencimentos sem enviar cobranças.

Reembolso reabre saldo da previsão, preservando a taxa original (sem presumir devolução da taxa). Para encerrar a dívida após reembolso integral, cancelar a previsão explicitamente. Correção/cancelamento de lançamento só ajusta o registro, não executa estorno; originais e motivos permanecem. Valor incorreto exige cancelar e recriar, sem editar o original. Previsões com saldo liquidado não podem ser canceladas sem corrigir/reembolsar; recebimento com reembolso vinculado não pode ser cancelado antes da correção dos dependentes. Não há exclusão definitiva nem restauração automática do lançamento cancelado.

Migrações 0006 e 0007: gatilhos de limites/consistência e índices parciais protegem recebimentos, pagamentos, reembolsos, abertura e cancelamentos inclusive em concorrência; preservar gatilhos em migrações posteriores. Uma abertura ativa e data igual/anterior aos movimentos. Formulários usam chave idempotente por dono para evitar duplicar previsões/movimentos após reenvio; log e registro são transacionais. Exportação JSON v6 inclui financeiro (cancelados também), sem chaves internas de requisição ou segredos. Custos/tempos informados na produção não criam despesas automáticas para evitar contagem duplicada.

## Prospecção assistida por IA
Gerador local de prompt com quantidade (1–50), região livre, segmentos, estratégia Meta, prioridade de independentes, exclusões e critérios adicionais. Não chama IA, API da Meta, busca ou envio de mensagens. Prompt pede navegação real e JSON UTF-8 v1 (app visualimpacto-prospeccao), uma ficha por empresa, fontes e datas, estimativas explícitas. Matriz preservada: decisor 30, recorrência 25, capacidade estimada 20, adequação 15, anúncios ativos confirmados 10. Prioridades A >=75, B >=50 e C abaixo são triagem, não probabilidade. Gap visual e demais inferências são estimativas; não exige comprovação excessiva de acesso ao decisor/orçamento.

Biblioteca Meta: interface pública de anúncios, não promessa de API irrestrita para anúncios comerciais no Brasil. Diferencia ativos_confirmados, nao_encontrados e nao_verificado; só o primeiro recebe 10 pontos e exige link da Biblioteca + data. Registro de evidência não prova gasto, lucro ou intenção de compra. Presença nas fontes é informada pela IA e precisa de revisão humana.

Importação: arquivo é lido no navegador (até 1 MiB/50 empresas), validado e pré-visualizado. Só itens válidos, novos e selecionados seguem ao servidor após confirmação. Servidor revalida todos os campos, reconta score, revisa duplicados (inclusive arquivados) por nome/cidade, telefone normalizado, e-mail ou perfis; não sobrescreve registros. Identidade normalizada tem índice único por dono em lead_research para evitar reenvio/conflito concorrente da mesma empresa. Duplicidade é triagem conservadora: nomes/canais compartilhados podem precisar de revisão manual. Variantes de nome e canais completamente diferentes ainda podem exigir revisão humana; não é resolução universal de entidades.

Cada importação é transacional: cadastros, pesquisa e histórico juntos; entradas entram em A pesquisar, origem Pesquisa IA, sem atividades artificiais. lead_research mantém lote, score calculado e ficha completa; export JSON v5 inclui essas pesquisas. Não guarda o arquivo bruto. Nenhum dado da base é automaticamente anexado ao prompt: exclusões são preenchidas pelo administrador. JSON/template e prompts são gerados no navegador. Não enviar dados privados a IAs externas sem decisão do administrador.
