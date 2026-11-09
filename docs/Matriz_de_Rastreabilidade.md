# 🗺️ Matriz de Rastreabilidade e Arquitetura de Requisitos — AnalisaAI

**Projeto:** AnalisaAI — Identificação de Plantas Tóxicas  
**Instituição:** Universidade Federal do Ceará (UFC) — Campus Crateús / IFCE — Campus Crateús  
**Semestre:** 2026.2  

**Equipe 9:**
- Allan Cristtian Soares Fialho — 510136
- Ana Cecília Marinho de Paiva — 569481
- Antonio Geovani Cardoso Loureiro — 588053
- Cauã Farias de Oliveira — 540832
- Davi Kelton Rodrigues Lima — 565809
- Maria Eduarda Gomes Araujo — 566733
- Raniel Batista Sousa — 571548
- Ronie de Souza Almeida — 567263

---

## 1. 📖 GLOSSÁRIO

* **LLM (Large Language Model):** Modelo de Inteligência Artificial baseado em linguagem natural utilizado no sistema para processar as imagens enviadas e identificar as espécies de plantas e seus riscos associados.
* **LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018):** Legislação brasileira que rege o tratamento de dados pessoais, exigindo consentimento explícito dos usuários para coleta e armazenamento de informações.
* **PIN / Senha:** Credencial numérica ou alfanumérica de segurança utilizada para autenticação e validação de operações sensíveis do usuário na plataforma.
* **Produtor Rural (Cliente):** Ator externo que utiliza a aplicação no campo para capturar, enviar e consultar análises de plantas potencialmente tóxicas para o gado ou animais de criação.
* **Técnico Agrícola:** Ator interno que contribui com informações sobre espécies de plantas, revisa identificações realizadas pela inteligência artificial e valida informações antes de sua inclusão na base oficial.
* **Planta Tóxica:** Espécie vegetal que possui princípios ativos capazes de causar danos à saúde ou levar à morte animais de criação e seres humanos.
* **Base de Conhecimento:** Conjunto de registros de espécies de plantas, compostos por imagens, nomes popular e científico, características, toxicidade e animais afetados, mantido pelo sistema. Somente registros validados compõem a base oficial.
* **Status de Validação:** Estado de um registro de espécie na base de conhecimento, podendo ser `pendente`, `revisado` ou `validado`.
* **Processamento Assíncrono:** Forma de processamento em que a análise da imagem é executada em segundo plano, sem bloquear a interface, sendo o usuário informado quando o resultado estiver disponível.
* **Log:** Registro de eventos do sistema, como acessos, envios, erros e ações administrativas, utilizado para identificação de falhas e acompanhamento do uso da plataforma.

---

## 2. 👥 PERFIS DE ACESSO

1. **Cliente (Produtor Rural):** Perfil externo responsável por realizar o cadastro na plataforma, atualizar seus dados cadastrais, capturar e enviar imagens de plantas via câmera ou galeria, consultar o histórico de análises, consultar informações sobre as espécies e gerenciar sua sessão de login.
2. **Técnico Agrícola (Interno):** Perfil interno responsável por contribuir com a base de conhecimento do sistema. Pode enviar imagens de plantas, cadastrar informações sobre espécies (nome popular, nome científico, características, toxicidade, animais afetados), revisar e corrigir identificações realizadas pela inteligência artificial e validar informações antes de sua inclusão na base oficial. Suas contas são criadas exclusivamente pelo Superadministrador.
3. **Administrador (Interno):** Perfil com privilégios de gestão. É responsável por cadastrar novos administradores pelo painel de controle, listar e buscar clientes cadastrados, bloquear ou desbloquear usuários e monitorar o uso da plataforma através de dashboards de métricas.
4. **Superadministrador (Super Admin):** Perfil de gestão de nível superior e controle do ecossistema. Possui acesso irrestrito a todas as funcionalidades do sistema e é o único perfil com permissão para cadastrar, editar, conceder privilégios ou revogar acessos de novos Administradores e Técnicos Agrícolas no painel de controle. Também é responsável por gerenciar as informações das espécies, acompanhar os registros (logs) e a utilização do sistema e acessar as configurações administrativas.

---

## 3. 🛡️ REGRAS DE NEGÓCIO (RN)

* **RN01 - Unicidade de Contato:** Cada número de telefone cadastrado deve ser único no sistema, servindo como identificador principal para autenticação.
* **RN02 - Validação de Imagem:** O sistema deve rejeitar o envio de arquivos que ultrapassem 10 MB, estejam fora dos formatos JPG/PNG ou possuam resolução inferior a 300x300 pixels.
* **RN03 - Obrigatoriedade de Consentimento (LGPD):** O cadastro de novos clientes só pode ser efetivado mediante o aceite explícito dos Termos de Uso e da Política de Privacidade.
* **RN04 - Restrição de Criação de Contas Internas:** Contas administrativas e de técnicos agrícolas não podem ser criadas por auto-cadastro público; sua criação e gerenciamento são restritos exclusivamente a usuários com perfil de Superadministrador por meio do painel de gestão.
* **RN05 - Segurança de Credenciais:** As senhas ou PINs numéricos cadastrados devem possuir obrigatoriamente no mínimo 6 caracteres para mitigar riscos de ataques de força bruta.
* **RN06 - Ciclo de Validação de Espécies:** Todo registro de espécie deve seguir o ciclo de status `pendente`, `revisado` e `validado`, nessa ordem. Registros novos são criados com o status `pendente`. Quando reprovado na validação, o registro retorna ao status `pendente`, acompanhado de justificativa.
* **RN07 - Informação de Técnico Não é Verdade Automática:** Nenhuma informação cadastrada por técnico agrícola deve ser considerada verdadeira automaticamente. Somente registros com status `validado` compõem a base oficial e são exibidos aos clientes.
* **RN08 - Cadastro Mínimo de Espécie:** O cadastro de uma espécie exige, no mínimo, o nome da espécie (popular ou científico) e ao menos uma imagem válida, conforme RN02.
* **RN09 - Espécie sem Identificação Definitiva:** É permitido cadastrar uma espécie sem identificação definitiva. Nesse caso, o registro deve ser sinalizado como "identificação não definitiva" e permanecer com o status `pendente` até sua revisão.
* **RN10 - Prevenção de Duplicidade:** O sistema deve evitar cadastros duplicados de usuários (RN01) e de espécies (mesmo nome popular ou científico), bem como solicitações duplicadas de análise de imagem decorrentes de envios repetidos.

---

## 4. 🚀 REQUISITOS FUNCIONAIS (RFs) E DE CONTRATO

| Código | Requisito Funcional | Atores Envolvidos | Regras Relacionadas | RNFs Aplicados | Rota da API (Contract Endpoint) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF001** | Cadastro de Usuários | Cliente, Técnico Agrícola, Administrador, Superadmin | RN01, RN03, RN04, RN05, RN10 | RNF001, RNF012, RNF014 | `POST /api/v1/users/register`<br>`POST /api/v1/superadmin/users` |
| **RF002** | Login no Sistema | Cliente, Técnico Agrícola, Administrador, Superadmin | RN01, RN05 | RNF001, RNF004, RNF009, RNF011 | `POST /api/v1/auth/login` |
| **RF003** | Realizar Envio de Imagens | Cliente, Técnico Agrícola | RN02, RN10 | RNF005, RNF006, RNF008, RNF010, RNF012, RNF015 | `POST /api/v1/plants/analyze` |
| **RF004** | Validação de Formato e Tamanho | Cliente, Técnico Agrícola | RN02 | RNF006, RNF014, RNF015 | `POST /api/v1/plants/analyze` |
| **RF005** | Identificação das Plantas (IA) | Cliente, Técnico Agrícola, API | RN02 | RNF001, RNF002, RNF007, RNF010, RNF011 | `GET /api/v1/plants/analyze/{id}` |
| **RF006** | Configuração de Perfil | Cliente, Técnico Agrícola | RN01, RN05 | RNF001, RNF014 | `PUT /api/v1/users/profile` |
| **RF007** | Listagem de Histórico | Cliente | - | RNF001, RNF004, RNF005 | `GET /api/v1/plants/history` |
| **RF008** | Logout do Sistema | Cliente, Técnico Agrícola, Administrador, Superadmin | - | RNF001, RNF004 | `POST /api/v1/auth/logout` |
| **RF009** | Gerenciar Usuários | Administrador, Superadmin | RN04 | RNF001, RNF004, RNF011 | `GET /api/v1/admin/users`<br>`PATCH /api/v1/admin/users/{id}/status`<br>`DELETE /api/v1/superadmin/users/{id}` |
| **RF010** | Monitoramento do Uso do Sistema | Administrador, Superadmin | - | RNF001, RNF004, RNF011 | `GET /api/v1/admin/metrics`<br>`GET /api/v1/admin/logs` |
| **RF011** | Recuperação de Senha ou PIN | Cliente, Técnico Agrícola, Administrador, Superadmin | RN01, RN05 | RNF001, RNF009, RNF011, RNF014 | `POST /api/v1/auth/recover-password` |
| **RF012** | Cadastro de Espécies | Técnico Agrícola, Superadmin | RN02, RN06, RN07, RN08, RN09, RN10 | RNF001, RNF004, RNF012, RNF013, RNF014 | `POST /api/v1/species` |
| **RF013** | Revisão e Validação de Espécies | Técnico Agrícola, Superadmin | RN06, RN07 | RNF001, RNF004, RNF011, RNF013 | `PATCH /api/v1/species/{id}/status` |
| **RF014** | Revisão de Identificações da IA | Técnico Agrícola | RN06, RN07 | RNF001, RNF004, RNF011, RNF013 | `GET /api/v1/technician/analyses`<br>`PUT /api/v1/technician/analyses/{id}/review` |
| **RF015** | Consulta de Informações sobre Espécies | Cliente, Técnico Agrícola, Superadmin | RN06, RN07 | RNF001, RNF004, RNF005 | `GET /api/v1/species`<br>`GET /api/v1/species/{id}` |
| **RF016** | Gerenciamento de Espécies e Configurações | Superadmin | RN06, RN07 | RNF001, RNF004, RNF011, RNF013 | `PUT /api/v1/species/{id}`<br>`DELETE /api/v1/species/{id}`<br>`GET /api/v1/superadmin/settings`<br>`PUT /api/v1/superadmin/settings` |

---

## 5. ⚙️ REQUISITOS NÃO FUNCIONAIS (RNFs)

* **RNF001 - Tempo de resposta do sistema (Desempenho):** O sistema deve apresentar resposta para operações de cadastro, login e carregamento de telas em no máximo 3 segundos, considerando conexão estável com a internet.
* **RNF002 - Tempo de processamento da análise da imagem (Desempenho):** O sistema deve retornar o resultado da identificação da planta em no máximo 10 segundos após o envio da imagem pelo cliente.
* **RNF003 - Disponibilidade da plataforma (Disponibilidade):** O sistema deve possuir disponibilidade mínima de 99% ao mês, exceto em períodos de manutenção programada.
* **RNF004 - Controle de acesso (Segurança):** O sistema deve restringir o acesso às funcionalidades de administração apenas para usuários logados com perfil de Administrador ou Superadministrador. A Área do Técnico deve ser acessível apenas por perfil de Técnico Agrícola ou Superadministrador.
* **RNF005 - Responsividade da interface (Usabilidade):** O sistema deve adaptar corretamente sua interface para dispositivos móveis e computadores com largura mínima de 360px.
* **RNF006 - Compatibilidade de Imagens (Confiabilidade):** O sistema deve permitir apenas o envio de imagens nos formatos JPG e PNG com tamanho máximo de 10 MB e resolução mínima de 300x300px.
* **RNF007 - Tratamento em caso de falha (Confiabilidade):** Em caso de falha na comunicação com o serviço de inferência da LLM ou indisponibilidade do modelo de IA, o sistema deve exibir mensagem de erro em no máximo 5 segundos.
* **RNF008 - Suporte a Operação Offline e Sincronização (Confiabilidade / Usabilidade):** O sistema deve suportar funcionamento parcial em modo offline, permitindo capturar fotos no campo sem internet, armazenando em cache local para envio automático posterior sem gerar solicitações duplicadas.
* **RNF009 - Proteção contra Força Bruta (Segurança):** O sistema deve implementar bloqueio temporário de conta (ex.: 15 minutos após 5 tentativas consecutivas erradas de login).
* **RNF010 - Processamento assíncrono das análises (Desempenho / Usabilidade):** O sistema deve processar análises de imagem em segundo plano sem bloquear a interface, permitindo uso contínuo enquanto notifica o término da inferência.
* **RNF011 - Registro de logs (Manutenibilidade / Segurança):** O sistema deve registrar logs completos de acessos, erros, envios, análises, validações e ações administrativas, em conformidade com a LGPD (sem gravar senhas ou PINs).
* **RNF012 - Prevenção de duplicidade (Confiabilidade):** O sistema deve evitar cadastros e solicitações duplicadas de usuários, espécies e análises.
* **RNF013 - Rastreabilidade da base de conhecimento (Segurança / Qualidade de dados):** O sistema deve registrar autor, data e histórico completo de alterações e trocas de status de cada espécie.
* **RNF014 - Validação de formulários (Usabilidade / Segurança):** O sistema deve validar dados no cliente e no servidor, exibindo mensagens claras e preservando campos já preenchidos.
* **RNF015 - Tratamento da câmera em dispositivos móveis (Usabilidade):** Tratamento otimizado de câmera mobile (permissões, preferência por câmera traseira e orientação de imagem).

---

## 6. 🔗 MATRIZ DE RASTREABILIDADE MATRICIAL (VISÃO GERAL)

| ID RF | Atores Envolvidos | Regras de Negócio (RN) | Requisitos Não Funcionais (RNF) | Rotas de API Integradas |
| :--- | :--- | :--- | :--- | :--- |
| **RF001** | Cliente, Técnico, Admin, Superadmin | RN01, RN03, RN04, RN05, RN10 | RNF001, RNF012, RNF014 | `POST /api/v1/users/register`, `POST /api/v1/superadmin/users` |
| **RF002** | Cliente, Técnico, Admin, Superadmin | RN01, RN05 | RNF001, RNF004, RNF009, RNF011 | `POST /api/v1/auth/login` |
| **RF003** | Cliente, Técnico Agrícola | RN02, RN10 | RNF005, RNF006, RNF008, RNF010, RNF012 | `POST /api/v1/plants/analyze` |
| **RF004** | Cliente, Técnico Agrícola | RN02 | RNF006, RNF014, RNF015 | `POST /api/v1/plants/analyze` |
| **RF005** | Cliente, Técnico Agrícola, API | RN02 | RNF001, RNF002, RNF007, RNF010, RNF011 | `GET /api/v1/plants/analyze/{id}` |
| **RF006** | Cliente, Técnico Agrícola | RN01, RN05 | RNF001, RNF014 | `PUT /api/v1/users/profile` |
| **RF007** | Cliente | N/A | RNF001, RNF004, RNF005 | `GET /api/v1/plants/history` |
| **RF008** | Cliente, Técnico, Admin, Superadmin | N/A | RNF001, RNF004 | `POST /api/v1/auth/logout` |
| **RF009** | Administrador, Superadmin | RN04 | RNF001, RNF004, RNF011 | `GET /api/v1/admin/users`, `PATCH /api/v1/admin/users/{id}/status`, `DELETE /api/v1/superadmin/users/{id}` |
| **RF010** | Administrador, Superadmin | N/A | RNF001, RNF004, RNF011 | `GET /api/v1/admin/metrics`, `GET /api/v1/admin/logs` |
| **RF011** | Cliente, Técnico, Admin, Superadmin | RN01, RN05 | RNF001, RNF009, RNF011, RNF014 | `POST /api/v1/auth/recover-password` |
| **RF012** | Técnico Agrícola, Superadmin | RN02, RN06, RN07, RN08, RN09, RN10 | RNF001, RNF004, RNF012, RNF013, RNF014 | `POST /api/v1/species` |
| **RF013** | Técnico Agrícola, Superadmin | RN06, RN07 | RNF001, RNF004, RNF011, RNF013 | `PATCH /api/v1/species/{id}/status` |
| **RF014** | Técnico Agrícola | RN06, RN07 | RNF001, RNF004, RNF011, RNF013 | `GET /api/v1/technician/analyses`, `PUT /api/v1/technician/analyses/{id}/review` |
| **RF015** | Cliente, Técnico, Superadmin | RN06, RN07 | RNF001, RNF004, RNF005 | `GET /api/v1/species`, `GET /api/v1/species/{id}` |
| **RF016** | Superadministrador | RN06, RN07 | RNF001, RNF004, RNF011, RNF013 | `PUT /api/v1/species/{id}`, `DELETE /api/v1/species/{id}`, `GET /api/v1/superadmin/settings`, `PUT /api/v1/superadmin/settings` |
