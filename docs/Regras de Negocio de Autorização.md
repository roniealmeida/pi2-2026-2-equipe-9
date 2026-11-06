#  Regras de Negócio de Autenticação (REQ-03)

**Projeto:** AnalisaAI - Identificação de Plantas Tóxicas  
**Instituição:** Universidade Federal do Ceará (UFC) - Campus Crateús  
**Semestre:** 2026.2  

---

##  Visão Geral

Este documento formaliza as regras de negócio e comportamentos esperados do sistema **AnalisaAI** em cenários de autenticação, tratamento de credenciais inválidas, expiração de sessão e mecanismos de segurança de login.

---

##  Regras de Negócio e Comportamentos

### 1. Tratamento de Credenciais Inválidas
* **Mensagens Genéricas de Erro:** Por motivos de segurança, ao falhar na autenticação, o sistema exibirá uma mensagem genérica como: `Telefone, PIN ou senha incorretos`.
* **Proteção contra Enumeração:** O sistema **nunca** informará especificamente se foi o usuário (telefone) ou a senha/PIN que estava incorreto, impedindo que atacantes confirmem a existência de contas cadastradas.

---

### 2. Expiração de Sessão e Tokens (JWT)
* **Duração do Token:** O token de acesso tem validade máxima de **24 horas**.
* **Comportamento ao Expirar:** 
  * Quando o token expira, requisições às rotas protegidas retornarão status `HTTP 401 Unauthorized`.
  * A aplicação redirecionará o usuário automaticamente para a **Tela de Login** com a mensagem: `Sessão expirada. Por favor, faça login novamente.`

---

### 3. Política de Bloqueio por Tentativas Incorretas (Força Bruta)
* **Limite de Tentativas:** Após **5 tentativas consecutivas incorretas** de login, a conta será temporariamente bloqueada.
* **Duração do Bloqueio:** O bloqueio permanecerá ativo por **15 minutos** (RNF009).
* **Notificação:** Durante o período de bloqueio, qualquer tentativa de login retornará a mensagem: `Conta temporariamente bloqueada por segurança. Tente novamente em X minutos.`

---

### 4. Recuperação e Desbloqueio de Conta
* **Desbloqueio Automático:** Após decorridos os 15 minutos, o bloqueio é removido automaticamente.
* **Recuperação por PIN/Senha:** O usuário pode iniciar o fluxo de recuperação de credenciais enviando um código de verificação via SMS/WhatsApp para o telefone cadastrado.

---

##  Resumo dos Critérios de Aceitação

| Critério | Status | Implementação / Regra |
| :--- | :---: | :--- |
| Definição para credenciais inválidas | ✅ | Mensagem genérica sem revelar o campo incorreto. |
| Tratamento de sessão/token expirado | ✅ | Expiração em 24h e redirecionamento para login (`HTTP 401`). |
| Bloqueio após tentativas consecutivas | ✅ | Bloqueio temporário ativado após 5 erros seguidos. |
| Condições e forma de recuperação | ✅ | Tempo de espera de 15 min ou recuperação via código SMS. |
| Mensagens seguras ao usuário | ✅ | Sem exposição de existência de conta no banco de dados. |
