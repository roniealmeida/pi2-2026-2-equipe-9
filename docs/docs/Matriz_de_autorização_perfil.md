#  Matriz de Autorização por Perfil (REQ-04)
**Projeto:** AnalisaAI - Identificação de Plantas Tóxicas  
**Instituição:** Universidade Federal do Ceará (UFC) - Campus Crateús  
**Semestre:** 2026.2  

---

##  Visão Geral

Este documento detalha o mapeamento de **controle de acesso (RBAC - Role-Based Access Control)** do sistema **AnalisaAI**. O objetivo é especificar as permissões e restrições de cada perfil de usuário sobre as **telas (interfaces)** e **rotas da API (endpoints REST)** da aplicação.

---

##  Perfis de Acesso

1. **Cliente (Produtor Rural):** Perfil externo focado na captura/upload de fotos de plantas tóxicas, consulta do histórico de análises e gestão do próprio perfil.
2. **Administrador (Interno):** Perfil de gestão responsável por listar, buscar, bloquear e desbloquear clientes, além de monitorar as métricas de uso da plataforma no dashboard.
3. **Superadministrador (Super Admin):** Perfil de mais alto nível no ecossistema, detentor de acesso completo a todas as funções administrativas e permissão exclusiva para gerenciar contas de Administradores.

---

##  Matriz de Autorização (Telas x Rotas x Perfis)

| Módulo / Funcionalidade | Interface / Tela | Rota / Endpoint (API REST) | Cliente | Administrador | Superadmin |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Cadastro de Clientes** | Tela Inicial / Form. Cadastro | `POST /api/v1/users/register` | ✅ Permitido | ❌ Negado | ❌ Negado |
| **Autenticação (Login)** | Tela de Login | `POST /api/v1/auth/login` | ✅ Permitido | ✅ Permitido | ✅ Permitido |
| **Recuperação de Senha** | Tela de Recuperação de Senha | `POST /api/v1/auth/recover-password` | ✅ Permitido | ✅ Permitido | ✅ Permitido |
| **Envio/Análise de Plantas** | Tela de Upload e Pré-visualização | `POST /api/v1/plants/analyze` | ✅ Permitido | ❌ Negado | ❌ Negado |
| **Configuração de Perfil** | Tela "Meu Perfil" | `PUT /api/v1/users/profile` | ✅ Permitido | ❌ Negado | ❌ Negado |
| **Histórico de Consultas** | Tela "Meu Histórico" | `GET /api/v1/plants/history` | ✅ Permitido | ❌ Negado | ❌ Negado |
| **Logout (Encerrar Sessão)** | Opção "Sair" do Menu | `POST /api/v1/auth/logout` | ✅ Permitido | ✅ Permitido | ✅ Permitido |
| **Gestão de Clientes** | Painel de Gestão (Usuários) | `GET /api/v1/admin/users`<br>`PATCH /api/v1/admin/users/{id}/status` | ❌ Negado | ✅ Permitido | ✅ Permitido |
| **Monitoramento do Sistema** | Dashboard de Métricas | `GET /api/v1/admin/metrics` | ❌ Negado | ✅ Permitido | ✅ Permitido |
| **Gestão de Admins** | Painel de Gestão (Admins) | `POST /api/v1/superadmin/users`<br>`DELETE /api/v1/superadmin/users/{id}` | ❌ Negado | ❌ Negado | ✅ Permitido *(Exclusivo)* |

---

##  Regras de Segurança Aplicadas

* **RN04 (Restrição de Criação de Admins):** Administradores não podem se cadastrar publicamente; apenas o Superadministrador autenticado pode criar ou revogar perfis administrativos via painel de gestão.
* **RNF004 (Controle de Acesso):** O middleware de autenticação da API valida o token JWT e bloqueia automaticamente qualquer tentativa de requisição a rotas `/admin/*` ou `/superadmin/*` originada por perfis do tipo Cliente.
* **Sessões Sensíveis:** A alteração de dados cadastrais sensíveis (ex: senha/PIN) exige a reautenticação com a credencial atual.
