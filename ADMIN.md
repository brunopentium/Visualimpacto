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

## Próximas etapas
4. Produção, versões e entregas.
5. Financeiro: cobranças e recebimentos separados, caixa e custo.
6. Marketing e indicadores por período de entrada no funil.

Não há disparos, publicações, contratação ou cobrança automática.
