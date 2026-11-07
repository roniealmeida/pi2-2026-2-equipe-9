#  Matriz de Rastreabilidade e Mapeamento de RNFs
**Projeto:** Identificação de Plantas Tóxicas no Sertão de Crateús  
**Instituição:** Universidade Federal do Ceará (UFC) - Campus Crateús  
**Semestre:** 2026.2  

---

##  Visão Geral

Este documento apresenta a **Matriz de Rastreabilidade de Requisitos** e o **Mapeamento de Requisitos Não Funcionais (RNFs)** do sistema de identificação de plantas tóxicas. 

A rastreabilidade garante a transparência e o alinhamento entre as **Regras de Negócio (RN)**, os **Requisitos Funcionais (RF)**, os **Requisitos Não Funcionais (RNF)** e os **Endpoints da API (Contrato REST)**.

---

## 1.  Matriz de Rastreabilidade de Requisitos

| Código RF | Requisito Funcional | Regras de Negócio (RN) | Requisitos Não Funcionais (RNF) | Atores | Tela | Status | Rota / Endpoint (Contrato API) |
| :---: | :--- | :---: | :---: | :--- | :---: | :--- | :---: |
| **RF001** | Cadastro de usuários | RN01, RN03, RN04, RN05 | RNF001, RNF005 | Cliente, Administrador, Superadministrador | [1 - CADASTRO PROP](https://www.figma.com/design/0W7cbmaywxAIRn9Q8TXnvY/PI?node-id=1177-361&t=fE4Hw1Wnyxpg1z4H-4) e [1 - CADASTRO TEC](https://www.figma.com/design/0W7cbmaywxAIRn9Q8TXnvY/PI?node-id=1347-503&t=fE4Hw1Wnyxpg1z4H-4) |`VALIDADO` | `POST /api/v1/users/register` |
| **RF002** | Login | RN01, RN05 | RNF001, RNF004, RNF009 | Cliente, Administrador | [1 - LOGIN](https://www.figma.com/design/0W7cbmaywxAIRn9Q8TXnvY/PI?node-id=1139-54&t=fE4Hw1Wnyxpg1z4H-4) | `VALIDADO` | `POST /api/v1/auth/login` |
| **RF003** | Realizar envio das imagens | RN02 | RNF005, RNF006, RNF008 | Cliente | [1 - HOME](https://www.figma.com/design/0W7cbmaywxAIRn9Q8TXnvY/PI?node-id=1494-2023&t=fE4Hw1Wnyxpg1z4H-4) |`VALIDADO` | `POST /api/v1/plants/analyze` |
| **RF004** | Validação de formato e tamanho | RN02 | RNF006 | Cliente | [1 - CONFIRMAR IMAGEM](https://www.figma.com/design/0W7cbmaywxAIRn9Q8TXnvY/PI?node-id=1494-2071&t=fE4Hw1Wnyxpg1z4H-4) | `INVALIDADO` | `POST /api/v1/plants/analyze` |
| **RF005** | Identificação das plantas (LLM) | — | RNF002, RNF003, RNF007 | Cliente, API | [1 - RESULTADO ANÁLISE](https://www.figma.com/design/0W7cbmaywxAIRn9Q8TXnvY/PI?node-id=1494-2147&t=fE4Hw1Wnyxpg1z4H-4) | `VALIDADO` | `POST /api/v1/plants/analyze` |
| **RF006** | Configuração de perfil | RN01, RN05 | RNF001, RNF005 | Cliente | [1 - EDITAR PERFIL](https://www.figma.com/design/0W7cbmaywxAIRn9Q8TXnvY/PI?node-id=1494-2372&t=fE4Hw1Wnyxpg1z4H-4) | `INVALIDADO` | `PUT /api/v1/users/profile` |
| **RF007** | Listagem de Histórico | — | RNF001, RNF005, RNF008 | Cliente | [1 - HISTORICO](https://www.figma.com/design/0W7cbmaywxAIRn9Q8TXnvY/PI?node-id=1494-2280&t=fE4Hw1Wnyxpg1z4H-4) | `INVALIDADO` | `GET /api/v1/plants/history` |
| **RF008** | Logout do sistema | — | RNF004 | Cliente, Administrador | [MENU LATERAL PROP](https://www.figma.com/design/0W7cbmaywxAIRn9Q8TXnvY/PI?node-id=1473-1687&t=fE4Hw1Wnyxpg1z4H-4) | `VALIDADO` | `POST /api/v1/auth/logout` |
| **RF009** | Gerenciar usuários | RN04 | RNF004, RNF005 | Administrador | - | `INVALIDADO` | `GET /api/v1/admin/users`<br>`PATCH /api/v1/admin/users/{id}/status` |
| **RF010** | Monitoramento do uso do sistema | RN04 | RNF003, RNF004 | Administrador | - | `NÃO EXECUTADO` | `GET /api/v1/admin/metrics` |
| **RF011** | Recuperação de Senha ou PIN | RN05 | RNF001, RNF009 | Cliente, Administrador | [1 - ALTERAÇÃO SENHA](https://www.figma.com/design/0W7cbmaywxAIRn9Q8TXnvY/PI?node-id=1494-2884&t=fE4Hw1Wnyxpg1z4H-4) | `NÃO EXECUTADO` | `POST /api/v1/auth/recover-password` |

### 🔍 Legenda de Status
* `VALIDADO`: Funcionalidade testada, homologada e aprovada.
* `INVALIDADO`: Funcionalidade implementada, porém apresentou falhas durante a validação ou requer ajustes de fluxo.
* `NÃO EXECUTADO`: Funcionalidade pendente de desenvolvimento ou execução dos testes.

---

## 2.  Mapeamento dos Requisitos Não Funcionais (RNF)

A tabela a seguir descreve a relação direta entre as métricas de qualidade, desempenho, segurança e disponibilidade (RNFs) com os Requisitos Funcionais do sistema.

| Código RNF | Categoria | Descrição / Critério de Aceitação | Requisitos Funcionais Relacionados |
| :---: | :--- | :--- | :--- |
| **RNF001** | **Desempenho** | O sistema deve apresentar resposta para operações de cadastro, login e carregamento de telas em no máximo **3 segundos**, considerando conexão estável com a internet. | RF001, RF002, RF006, RF007, RF011 |
| **RNF002** | **Desempenho** | O sistema deve retornar o resultado da identificação da planta em no máximo **10 segundos** após o envio da imagem pelo cliente. | RF005 |
| **RNF003** | **Disponibilidade** | O sistema deve possuir disponibilidade mínima de **99% ao mês**, exceto em períodos de manutenção programada (no máximo 432 min de indisponibilidade/mês). | RF005, RF010 |
| **RNF004** | **Segurança** | O sistema deve restringir o acesso às funcionalidades de administração apenas para usuários logados com perfil de Administrador ou Superadministrador. | RF002, RF008, RF009, RF010 |
| **RNF005** | **Usabilidade** | O sistema deve adaptar corretamente sua interface para dispositivos móveis e computadores com largura mínima de **360px**. | RF001, RF003, RF006, RF007, RF009 |
| **RNF006** | **Confiabilidade** | O sistema deve permitir apenas o envio de imagens nos formatos **JPG e PNG** com tamanho máximo de **10 MB** e resolução mínima de **300x300px**. | RF003, RF004 |
| **RNF007** | **Confiabilidade** | Em caso de falha na comunicação com o serviço de inferência da LLM ou indisponibilidade da IA, o sistema deve exibir mensagem de erro em no máximo **5 segundos**. | RF003, RF005 |
| **RNF008** | **Confiabilidade / Usabilidade** | O sistema deve suportar funcionamento parcial em **modo offline**, armazenando solicitações em cache local e sincronizando automaticamente quando a conexão for reestabelecida. | RF003, RF007 |
| **RNF009** | **Segurança** | O sistema deve implementar bloqueio temporário de conta (ex: 15 minutos após 5 tentativas erradas) para mitigar ataques de força bruta no PIN/senha. | RF002, RF011 |

---

## 3.  Mapeamento de Regras de Negócio (RN)

* **RN01 - Unicidade de Contato:** Cada número de telefone cadastrado deve ser único, servindo como identificador principal.
* **RN02 - Validação de Imagem:** Rejeição automática de arquivos $> 10$ MB, formatos fora de JPG/PNG ou resolução $< 300\times300$ px.
* **RN03 - Obrigatoriedade de Consentimento (LGPD):** Cadastro só efetivado mediante aceite dos Termos de Uso e Política de Privacidade.
* **RN04 - Restrição de Criação de Administradores:** Contas administrativas são criadas exclusivamente via painel por Superadministradores.
* **RN05 - Segurança de Credenciais:** Senhas e PINs numéricos devem possuir no mínimo 6 caracteres.
