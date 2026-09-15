# Contrato da API — Sprint 1

**Projeto:** AnalisaAI  
**Backend:** Django 5.2 + Django REST Framework  
**Base da API:** `/api/`

## 1. Resumo das rotas

| # | Método | Caminho | Descrição | Requisito / Caso de Uso |
|---|---|---|---|---|
| 1 | POST | `/api/users/` | Cadastrar usuário comum | RF001 / UC01 |
| 2 | POST | `/api/users/login/` | Fazer login | RF002 / UC03 |
| 3 | PATCH | `/api/users/profile/` | Atualizar dados do perfil | RF006 |
| 4 | GET | `/api/users/` | Listar usuários comuns | RF009 / UC05 e UC08 |
| 5 | POST | `/api/users/admins/` | Cadastrar administrador | RF001 / UC02 |
| 6 | GET | `/api/users/admins/list/` | Listar administradores | RF009 |
| 7 | PATCH | `/api/users/status/` | Alterar status de usuário | RF009 / UC05 e UC08 |
| 8 | POST | `/api/analysis/` | Enviar imagem e criar análise | RF003 / RF004 / RF005 / UC04 |
| 9 | GET | `/api/analysis/` | Consultar histórico de análises | RF007 / UC06 |
| 10 | GET | `/api/analysis/{id}/` | Consultar detalhes de uma análise | RF007 / RF005 / UC06 |
| 11 | GET | `/api/analysis/all-analysis/` | Listar análises para monitoramento administrativo | RF010 / UC09 |

## 2. Contrato detalhado

### Rota 01 — Cadastrar usuário comum

**Método:** `POST`  
**Caminho:** `/api/users/`  
**Descrição:** Cria um usuário comum e sua propriedade rural.  
**Requisito / Caso de Uso:** RF001 / UC01 — Fazer Cadastro de Clientes.

#### Entrada

```json
{
  "name": "João da Silva",
  "phone": "+55 88 99999-9999",
  "password": "123456",
  "confirm_password": "123456",
  "farm": {
    "name": "Fazenda Boa Esperança",
    "state": "Ceará",
    "location": "Localidade Rural",
    "municipality": "Crateús"
  }
}
```

Campos obrigatórios: `name`, `phone`, `password`, `confirm_password` e `farm`.

#### Saída — `201 Created`

```json
{
  "user": {
    "id": 1,
    "name": "João da Silva",
    "phone": "+5588999999999",
    "is_admin": false,
    "status": 1,
    "farm": {
      "name": "Fazenda Boa Esperança",
      "state": "Ceará",
      "location": "Localidade Rural",
      "municipality": "Crateús"
    }
  }
}
```

#### Código de resposta

- `201`: cadastro realizado.
- `400`: dados inválidos, confirmação de senha diferente ou telefone já cadastrado.

---

### Rota 02 — Fazer login

**Método:** `POST`  
**Caminho:** `/api/users/login/`  
**Descrição:** Autentica o usuário por telefone e senha e gera um token JWT.  
**Requisito / Caso de Uso:** RF002 / UC03 — Fazer Login.

#### Entrada

```json
{
  "phone": "+55 88 99999-9999",
  "password": "123456"
}
```

#### Saída — `200 OK`

```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "name": "João da Silva",
    "phone": "+5588999999999",
    "is_admin": false,
    "status": 1,
    "farm": {
      "name": "Fazenda Boa Esperança",
      "state": "Ceará",
      "location": "Localidade Rural",
      "municipality": "Crateús"
    }
  }
}
```

#### Código de resposta

- `200`: login realizado.
- `400`: telefone ou senha incorretos / dados inválidos.

---

### Rota 03 — Atualizar perfil

**Método:** `PATCH`  
**Caminho:** `/api/users/profile/`  
**Descrição:** Atualiza parcialmente os dados do usuário e da propriedade.  
**Requisito:** RF006 — Configuração de perfil.

#### Entrada

```json
{
  "user_id": 1,
  "name": "João da Silva",
  "phone": "+55 88 98888-8888",
  "farm_name": "Nova Fazenda",
  "state": "Ceará",
  "location": "Nova Localidade",
  "municipality": "Crateús"
}
```

`user_id` é obrigatório. Os demais campos são opcionais.

#### Saída — `200 OK`

```json
{
  "message": "Dados cadastrais atualizados com sucesso.",
  "user": {
    "id": 1,
    "name": "João da Silva",
    "phone": "+5588988888888",
    "is_admin": false,
    "status": 1,
    "farm": {
      "name": "Nova Fazenda",
      "state": "Ceará",
      "location": "Nova Localidade",
      "municipality": "Crateús"
    }
  }
}
```

#### Código de resposta

- `200`: atualização realizada.
- `400`: dados inválidos ou usuário não encontrado.

> O RF006 também prevê alteração de senha/PIN, mas essa operação não está implementada no endpoint atual.

---

### Rota 04 — Listar usuários comuns

**Método:** `GET`  
**Caminho:** `/api/users/`  
**Descrição:** Lista os usuários comuns. A implementação exige que `requested_by` corresponda a um administrador.  
**Requisito / Caso de Uso:** RF009 / UC05 e UC08 — Gerenciar Usuários.

#### Entrada

```text
/api/users/?requested_by=1
```

`requested_by` deve corresponder a um administrador.

#### Saída — `200 OK`

```json
[
  {
    "id": 2,
    "name": "João da Silva",
    "phone": "+5588999999999",
    "status": 1
  }
]
```

#### Código de resposta

- `200`: lista retornada.
- `400`: solicitante não informado, inexistente ou não é administrador.

> Os filtros por estado, município/cidade, localidade e nome previstos no RF009 não são implementados nessa rota atual.

---

### Rota 05 — Cadastrar administrador

**Método:** `POST`  
**Caminho:** `/api/users/admins/`  
**Descrição:** Cria uma conta de administrador mediante solicitação de um administrador existente.  
**Requisito / Caso de Uso:** RF001 / UC02 — Fazer Cadastro de Administradores.

#### Entrada

```json
{
  "requested_by": 1,
  "name": "Administrador",
  "phone": "+55 88 97777-7777",
  "password": "123456",
  "confirm_password": "123456"
}
```

#### Saída — `201 Created`

```json
{
  "user": {
    "id": 3,
    "name": "Administrador",
    "phone": "+5588977777777",
    "is_admin": true,
    "status": 1,
    "farm": null
  }
}
```

#### Código de resposta

- `201`: administrador criado.
- `400`: dados inválidos, telefone duplicado, solicitante inexistente ou solicitante não administrador.

---

### Rota 06 — Listar administradores

**Método:** `GET`  
**Caminho:** `/api/users/admins/list/`  
**Descrição:** Lista os administradores cadastrados. A implementação exige que `requested_by` corresponda a um administrador.  
**Requisito:** RF009 — Gerenciar Usuários.

#### Entrada

```text
/api/users/admins/list/?requested_by=1
```

#### Saída — `200 OK`

```json
[
  {
    "id": 3,
    "name": "Administrador",
    "phone": "+5588977777777",
    "status": 1
  }
]
```

#### Código de resposta

- `200`: lista retornada.
- `400`: solicitante inexistente ou não administrador.

---

### Rota 07 — Alterar status do usuário

**Método:** `PATCH`  
**Caminho:** `/api/users/status/`  
**Descrição:** Altera o status de um usuário mediante solicitação de um administrador.  
**Requisito / Caso de Uso:** RF009 / UC05 e UC08 — Gerenciar Usuários.

#### Entrada

```json
{
  "requested_by": 1,
  "user_id": 2,
  "status": 2
}
```

Valores de `status`:

- `0` = Inativo
- `1` = Ativo
- `2` = Bloqueado

#### Saída — `200 OK`

```json
{
  "message": "Status atualizado com sucesso."
}
```

#### Código de resposta

- `200`: status alterado.
- `400`: solicitante inválido, usuário inexistente, status inválido ou status já definido.

---

### Rota 08 — Enviar imagem e criar análise

**Método:** `POST`  
**Caminho:** `/api/analysis/`  
**Descrição:** Recebe uma imagem em Base64 Data URI, registra a solicitação e realiza a análise por meio do serviço de IA configurado.  
**Requisito / Caso de Uso:** RF003, RF004 e RF005 / UC04 — Enviar Imagens.

#### Entrada

```json
{
  "image": "data:image/jpeg;base64,<conteúdo-base64>",
  "userId": 1
}
```

O serializer atual exige que `image` comece com `data:image/` e contenha `;base64,`.

> Embora o RF004/RNF006 determine JPG/PNG, tamanho máximo de 10 MB e resolução mínima de 300×300 px, essas validações não são implementadas explicitamente no serializer atual.

#### Saída — `200 OK`

```json
{
  "search_request_id": 10,
  "result_type": 0,
  "analysis_results": [
    {
      "CommonName": "Nome comum da planta",
      "ScientificName": "Nome científico",
      "SusceptibleAnimalSpecies": ["Bovinos"],
      "HumanRisks": "Riscos para humanos",
      "Description": "Descrição da planta",
      "CommonSymptoms": ["Sintoma 1"],
      "RecommendedActions": ["Ação recomendada"],
      "ConfidenceScore": 95
    }
  ],
  "error_message": ""
}
```

Valores de `result_type`:

- `0` = identificação completa
- `1` = identificação parcial
- `3` = não identificada
- `4` = erro

#### Código de resposta

- `200`: requisição processada.
- `400`: dados de entrada inválidos.
- `404`: usuário não encontrado.

> A implementação pode retornar HTTP `200` mesmo quando a análise resulta em identificação parcial, não identificação ou erro tratado durante o processamento.

---

### Rota 09 — Consultar histórico

**Método:** `GET`  
**Caminho:** `/api/analysis/`  
**Descrição:** Retorna o histórico de análises completas realizadas pelo usuário, ordenadas da mais recente para a mais antiga.  
**Requisito / Caso de Uso:** RF007 / UC06 — Consultar Histórico.

#### Entrada

```text
/api/analysis/?userId=1
```

`userId` é obrigatório.

#### Saída — `200 OK`

```json
[
  {
    "search_request_id": 10,
    "status": 3,
    "result_type": 0,
    "request_date": "2026-09-13T10:30:00",
    "finished_at": "2026-09-13T10:30:08",
    "image": "/media/analysis/imagem.jpg",
    "analysis_result": {
      "common_name": "Nome comum da planta",
      "Description": "Descrição da planta"
    }
  }
]
```

#### Código de resposta

- `200`: histórico retornado.
- `400`: `userId` não informado.
- `404`: usuário não encontrado.

> O RF007 prevê filtros por período (dia, semana ou mês), mas a rota atual recebe somente `userId` e não implementa esses filtros.

---

### Rota 10 — Consultar detalhes de uma análise

**Método:** `GET`  
**Caminho:** `/api/analysis/{id}/`  
**Descrição:** Retorna os detalhes de uma análise específica selecionada no histórico.  
**Requisito / Caso de Uso:** RF007 / RF005 / UC06 — Consultar Histórico.

#### Entrada

```text
/api/analysis/10/?userId=1
```

`id` corresponde ao identificador da análise e `userId` ao usuário proprietário.

#### Saída — `200 OK`

```json
{
  "search_request_id": 10,
  "result_type": 0,
  "status": 3,
  "image": "/media/analysis/imagem.jpg",
  "analysis_results": [
    {
      "id": 20,
      "common_name": "Nome comum da planta",
      "scientific_name": "Nome científico",
      "susceptible_animal_species": ["Bovinos"],
      "human_risks": "Riscos para humanos",
      "description": "Descrição da planta",
      "common_symptoms": ["Sintoma 1"],
      "recommended_actions": ["Ação recomendada"],
      "confidence_score": 95.0
    }
  ]
}
```

#### Código de resposta

- `200`: detalhes retornados.
- `400`: `userId` não informado.
- `404`: usuário ou análise não encontrados.

---

### Rota 11 — Listar todas as análises para monitoramento

**Método:** `GET`  
**Caminho:** `/api/analysis/all-analysis/`  
**Descrição:** Lista registros de análises para uso administrativo e monitoramento. A implementação exige que `requested_by` corresponda a um administrador.  
**Requisito / Caso de Uso:** RF010 / UC09 — Monitorar Uso do Sistema.

#### Entrada

```text
/api/analysis/all-analysis/?requested_by=1
```

#### Saída — `200 OK`

```json
[
  {
    "search_request_id": 10,
    "request_date": "2026-09-13T10:30:00",
    "status": 3,
    "result": "Nome comum da planta"
  },
  {
    "search_request_id": 11,
    "request_date": "2026-09-13T10:40:00",
    "status": 4,
    "result": "Erro durante o processamento"
  },
  {
    "search_request_id": 12,
    "request_date": "2026-09-13T10:50:00",
    "status": 1,
    "result": null
  }
]
```

#### Código de resposta

- `200`: análises retornadas.
- `400`: `requested_by` não informado.
- `404`: solicitante não encontrado ou não autorizado.

> O RF010/UC09 prevê gráficos, filtros por período e métricas de uso, requisições à IA e erros. A implementação atual dessa rota fornece somente `search_request_id`, `request_date`, `status` e `result`.
