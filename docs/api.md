# Contrato da API atualizado — AnalisaAI

**Projeto:** AnalisaAI  
**Backend:** Django 5.2 + Django REST Framework  
**Base da API:** `/api/`

## 1. Convenções

- **Formato de comunicação:** JSON
- **Autenticação:** JWT (JSON Web Token)
- **Cabeçalho de autenticação:**

```http
Authorization: Bearer <token>
```

- Os parâmetros obrigatórios e opcionais são especificados em cada rota.
- Os códigos HTTP indicam o resultado da operação.

---

# 2. Rotas de Usuários

## 2.1. Registrar novo usuário

**Método:** `POST`

**Caminho:** `/api/users/`

**Descrição:** Cria uma nova conta de usuário, incluindo os dados da fazenda associada. A rota não exige autenticação.

### Entrada

```json
{
  "name": "João da Silva",
  "phone": "+5588999999999",
  "password": "senha123",
  "confirm_password": "senha123",
  "accept_terms": true,
  "farm": {
    "name": "Fazenda São João",
    "state": "CE",
    "location": "Zona rural",
    "municipality": "Crateús"
  }
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | Sim | Nome do usuário |
| `phone` | string | Sim | Telefone no formato brasileiro |
| `password` | string | Sim | Senha com no mínimo 6 caracteres |
| `confirm_password` | string | Sim | Confirmação da senha |
| `accept_terms` | boolean | Sim | Deve ser `true` para aceitar os termos |
| `farm.name` | string | Sim | Nome da fazenda |
| `farm.state` | string | Sim | Estado da fazenda |
| `farm.location` | string | Sim | Localização da fazenda |
| `farm.municipality` | string | Sim | Município da fazenda |

### Saída — sucesso

**HTTP 201 Created**

```json
{
  "user": {
    "id": 1,
    "name": "João da Silva",
    "phone": "+5588999999999",
    "is_admin": false,
    "status": 1,
    "farm": {
      "name": "Fazenda São João",
      "state": "CE",
      "location": "Zona rural",
      "municipality": "Crateús"
    }
  }
}
```

### Códigos de resposta

| Código | Descrição |
|---|---|
| 201 | Usuário cadastrado com sucesso |
| 400 | Dados inválidos, telefone duplicado ou senhas divergentes |

---

## 2.2. Fazer login

**Método:** `POST`

**Caminho:** `/api/users/login/`

**Descrição:** Autentica um usuário por meio do telefone e senha, retornando um token JWT e os dados do usuário.

### Entrada

```json
{
  "phone": "+5588999999999",
  "password": "senha123"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `phone` | string | Sim | Telefone cadastrado |
| `password` | string | Sim | Senha do usuário |

### Saída — sucesso

**HTTP 200 OK**

```json
{
  "token": "<jwt_token>",
  "user": {
    "id": 1,
    "name": "João da Silva",
    "phone": "+5588999999999",
    "is_admin": false,
    "status": 1,
    "farm": {
      "name": "Fazenda São João",
      "state": "CE",
      "location": "Zona rural",
      "municipality": "Crateús"
    }
  }
}
```

### Códigos de resposta

| Código | Descrição |
|---|---|
| 200 | Login realizado com sucesso |
| 400 | Dados inválidos |
| 401 | Telefone ou senha incorretos |

---

## 2.3. Atualizar dados cadastrais

**Método:** `PATCH`

**Caminho:** `/api/users/profile/`

**Descrição:** Atualiza os dados cadastrais e da fazenda do usuário autenticado. Os campos são opcionais, permitindo atualizar somente os dados desejados.

**Autenticação:** JWT obrigatório.

### Entrada

```json
{
  "user_id": 1,
  "name": "João da Silva",
  "phone": "+5588999999999",
  "farm_name": "Fazenda São João",
  "state": "CE",
  "location": "Zona rural",
  "municipality": "Crateús"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `user_id` | integer | Sim | Identificador do usuário autenticado |
| `name` | string | Não | Nome atualizado |
| `phone` | string | Não | Telefone atualizado |
| `farm_name` | string | Não | Nome atualizado da fazenda |
| `state` | string | Não | Estado da fazenda |
| `location` | string | Não | Localização da fazenda |
| `municipality` | string | Não | Município da fazenda |

### Saída — sucesso

**HTTP 200 OK**

```json
{
  "message": "Dados cadastrais atualizados com sucesso.",
  "user": {
    "id": 1,
    "name": "João da Silva",
    "phone": "+5588999999999",
    "is_admin": false,
    "status": 1,
    "farm": {
      "name": "Fazenda São João",
      "state": "CE",
      "location": "Zona rural",
      "municipality": "Crateús"
    }
  }
}
```

### Códigos de resposta

| Código | Descrição |
|---|---|
| 200 | Dados atualizados com sucesso |
| 400 | Dados inválidos ou `user_id` obrigatório |
| 403 | Usuário não tem permissão para alterar o perfil informado |
| 404 | Usuário não encontrado |

---

## 2.4. Listar usuários

**Método:** `GET`

**Caminho:** `/api/users/`

**Descrição:** Retorna a lista de usuários cadastrados. A operação é restrita a administradores.

**Autenticação:** JWT obrigatório.

### Parâmetros de consulta

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `requested_by` | integer | Sim | Identificador do administrador solicitante |

### Exemplo de requisição

```http
GET /api/users/?requested_by=1
```

### Saída — sucesso

**HTTP 200 OK**

```json
[
  {
    "id": 2,
    "name": "Maria Souza",
    "phone": "+5588999999998",
    "status": 1
  },
  {
    "id": 3,
    "name": "Pedro Lima",
    "phone": "+5588999999997",
    "status": 1
  }
]
```

### Códigos de resposta

| Código | Descrição |
|---|---|
| 200 | Usuários listados com sucesso |
| 400 | `requested_by` obrigatório |
| 403 | Acesso negado ou usuário não é administrador |

---

## 2.5. Registrar administrador

**Método:** `POST`

**Caminho:** `/api/users/admins/`

**Descrição:** Cria uma nova conta de administrador. A operação só pode ser realizada por um administrador autenticado.

**Autenticação:** JWT obrigatório.

### Entrada

```json
{
  "requested_by": 1,
  "name": "Administrador",
  "phone": "+5588999999996",
  "password": "senha123",
  "confirm_password": "senha123"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `requested_by` | integer | Sim | Identificador do administrador solicitante |
| `name` | string | Sim | Nome do novo administrador |
| `phone` | string | Sim | Telefone do novo administrador |
| `password` | string | Sim | Senha com no mínimo 6 caracteres |
| `confirm_password` | string | Sim | Confirmação da senha |

### Saída — sucesso

**HTTP 201 Created**

```json
{
  "user": {
    "id": 4,
    "name": "Administrador",
    "phone": "+5588999999996",
    "is_admin": true,
    "status": 1,
    "farm": null
  }
}
```

### Códigos de resposta

| Código | Descrição |
|---|---|
| 201 | Administrador cadastrado com sucesso |
| 400 | Dados inválidos ou telefone duplicado |
| 403 | Acesso negado ou usuário solicitante não é administrador |

---

## 2.6. Listar administradores

**Método:** `GET`

**Caminho:** `/api/users/admins/list/`

**Descrição:** Retorna a lista de administradores cadastrados. A operação é restrita a administradores autenticados.

**Autenticação:** JWT obrigatório.

### Parâmetros de consulta

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `requested_by` | integer | Sim | Identificador do administrador solicitante |

### Exemplo de requisição

```http
GET /api/users/admins/list/?requested_by=1
```

### Saída — sucesso

**HTTP 200 OK**

```json
[
  {
    "id": 1,
    "name": "Administrador Principal",
    "phone": "+5588999999995",
    "status": 1
  }
]
```

### Códigos de resposta

| Código | Descrição |
|---|---|
| 200 | Administradores listados com sucesso |
| 400 | `requested_by` obrigatório |
| 403 | Acesso negado ou usuário não é administrador |

---

## 2.7. Alterar status de usuário

**Método:** `PATCH`

**Caminho:** `/api/users/status/`

**Descrição:** Altera o status de um usuário. A operação é restrita a administradores autenticados.

**Autenticação:** JWT obrigatório.

### Entrada

```json
{
  "requested_by": 1,
  "user_id": 2,
  "status": 2
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `requested_by` | integer | Sim | Identificador do administrador solicitante |
| `user_id` | integer | Sim | Identificador do usuário que terá o status alterado |
| `status` | integer | Sim | Novo status do usuário |

### Saída — sucesso

**HTTP 200 OK**

```json
{
  "message": "Status atualizado com sucesso."
}
```

### Códigos de resposta

| Código | Descrição |
|---|---|
| 200 | Status atualizado com sucesso |
| 400 | Dados inválidos, usuário não encontrado, status inválido ou status já existente |
| 403 | Acesso negado ou usuário solicitante não é administrador |

---

# 3. Rotas de Análise de Plantas

## 3.1. Criar análise de planta

**Método:** `POST`

**Caminho:** `/api/analysis/`

**Descrição:** Recebe uma imagem de planta em Base64 e o identificador do usuário. A imagem é processada pela inteligência artificial para identificar a planta e retornar informações relacionadas à análise.

### Entrada

```json
{
  "userId": 1,
  "image": "data:image/jpeg;base64,<conteudo_da_imagem>"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | integer | Sim | Identificador do usuário que solicitou a análise |
| `image` | string | Sim | Imagem codificada em Base64 |

### Regras de entrada

- A imagem deve ser JPEG ou PNG.
- A imagem deve ser enviada em Base64.
- O tamanho máximo permitido é de 10 MiB.
- A largura e a altura mínimas da imagem são de 300 pixels.
- O usuário informado deve existir.

### Saída — sucesso

**HTTP 200 OK**

```json
{
  "search_request_id": 1,
  "result_type": 1,
  "analysis_results": [
    {
      "CommonName": "Nome comum da planta",
      "ScientificName": "Nome científico",
      "SusceptibleAnimalSpecies": [
        "Espécie animal"
      ],
      "HumanRisks": "Descrição dos riscos para humanos",
      "Description": "Descrição da análise",
      "CommonSymptoms": [
        "Sintoma identificado"
      ],
      "RecommendedActions": [
        "Ação recomendada"
      ],
      "ConfidenceScore": 95
    }
  ],
  "error_message": null
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `search_request_id` | integer | Identificador da solicitação de análise |
| `result_type` | integer | Tipo de resultado da análise |
| `analysis_results` | array | Lista de resultados retornados pela IA |
| `analysis_results[].CommonName` | string | Nome comum da planta |
| `analysis_results[].ScientificName` | string | Nome científico da planta |
| `analysis_results[].SusceptibleAnimalSpecies` | array de strings | Espécies animais suscetíveis |
| `analysis_results[].HumanRisks` | string | Riscos para humanos |
| `analysis_results[].Description` | string | Descrição da análise |
| `analysis_results[].CommonSymptoms` | array de strings | Sintomas comuns |
| `analysis_results[].RecommendedActions` | array de strings | Ações recomendadas |
| `analysis_results[].ConfidenceScore` | integer | Pontuação de confiança |
| `error_message` | string ou null | Mensagem de erro, quando houver |

### Códigos de resposta

| Código | Descrição |
|---|---|
| 200 | Solicitação processada; o resultado pode ser completo, parcial ou indicar falha da análise |
| 400 | Dados inválidos ou imagem fora dos critérios aceitos |
| 404 | Usuário não encontrado |

---

## 3.2. Consultar histórico de análises

**Método:** `GET`

**Caminho:** `/api/analysis/`

**Descrição:** Retorna o histórico de análises concluídas do usuário informado. O usuário autenticado só pode consultar o próprio histórico.

**Autenticação:** JWT obrigatório.

### Parâmetros de consulta

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | integer | Sim | Identificador do usuário autenticado |

### Exemplo de requisição

```http
GET /api/analysis/?userId=1
```

### Saída — sucesso

**HTTP 200 OK**

```json
[
  {
    "search_request_id": 1,
    "status": 1,
    "result_type": 1,
    "request_date": "2026-10-15T10:30:00Z",
    "finished_at": "2026-10-15T10:31:00Z",
    "image": "https://exemplo.com/imagem.jpg",
    "analysis_result": {
      "common_name": "Nome comum da planta",
      "Description": "Descrição da análise"
    }
  }
]
```

### Códigos de resposta

| Código | Descrição |
|---|---|
| 200 | Histórico consultado com sucesso |
| 400 | `userId` ausente ou inválido |
| 403 | Usuário não tem permissão para consultar esse histórico |
| 404 | Usuário não encontrado |

---

## 3.3. Consultar detalhes de uma análise

**Método:** `GET`

**Caminho:** `/api/analysis/{id}/`

**Descrição:** Retorna os detalhes de uma análise específica, incluindo informações da planta, sintomas, riscos e ações recomendadas.

**Autenticação:** JWT obrigatório.

### Parâmetros de caminho

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | integer | Sim | Identificador da análise |

### Parâmetros de consulta

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | integer | Sim | Identificador do usuário proprietário da análise |

### Exemplo de requisição

```http
GET /api/analysis/1/?userId=1
```

### Saída — sucesso

**HTTP 200 OK**

```json
{
  "search_request_id": 1,
  "result_type": 1,
  "status": 1,
  "image": "https://exemplo.com/imagem.jpg",
  "analysis_results": [
    {
      "id": 1,
      "common_name": "Nome comum da planta",
      "scientific_name": "Nome científico",
      "susceptible_animal_species": [
        "Espécie animal"
      ],
      "human_risks": "Descrição dos riscos para humanos",
      "description": "Descrição da análise",
      "common_symptoms": [
        "Sintoma identificado"
      ],
      "recommended_actions": [
        "Ação recomendada"
      ],
      "confidence_score": 95.0
    }
  ]
}
```

### Códigos de resposta

| Código | Descrição |
|---|---|
| 200 | Detalhes da análise retornados com sucesso |
| 400 | Parâmetros inválidos |
| 403 | Usuário não tem permissão para consultar essa análise |
| 404 | Usuário ou análise não encontrado |

---

## 3.4. Listar todas as análises

**Método:** `GET`

**Caminho:** `/api/analysis/all-analysis/`

**Descrição:** Retorna uma listagem geral das análises realizadas na plataforma. A operação é restrita a administradores autenticados.

**Autenticação:** JWT obrigatório.

### Parâmetros de consulta

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `requested_by` | integer | Sim | Identificador do administrador solicitante |

### Exemplo de requisição

```http
GET /api/analysis/all-analysis/?requested_by=1
```

### Saída — sucesso

**HTTP 200 OK**

```json
[
  {
    "search_request_id": 1,
    "request_date": "2026-10-15T10:30:00Z",
    "status": 1,
    "result": "Nome comum da planta"
  },
  {
    "search_request_id": 2,
    "request_date": "2026-10-15T11:00:00Z",
    "status": 2,
    "result": "Descrição do erro"
  }
]
```

| Campo | Tipo | Descrição |
|---|---|---|
| `search_request_id` | integer | Identificador da solicitação |
| `request_date` | datetime | Data e hora da solicitação |
| `status` | integer | Status da análise |
| `result` | string ou null | Nome comum da planta, descrição do erro ou `null` |

### Códigos de resposta

| Código | Descrição |
|---|---|
| 200 | Análises listadas com sucesso |
| 400 | `requested_by` ausente ou inválido |
| 403 | Acesso negado ou usuário não é administrador |
| 404 | Usuário solicitante não encontrado |

---

# 4. Autenticação e autorização

As rotas que exigem autenticação devem receber o token JWT no cabeçalho `Authorization`.

```http
Authorization: Bearer <jwt_token>
```

As seguintes operações são públicas:

- `POST /api/users/`
- `POST /api/users/login/`

As demais operações exigem autenticação.

As operações administrativas são restritas a usuários com permissão de administrador, incluindo:

- Listar usuários.
- Registrar administradores.
- Listar administradores.
- Alterar status de usuários.
- Listar todas as análises.

---

# 5. Observações

- Os exemplos de resposta são ilustrativos e não representam dados reais do banco.
- Os valores numéricos de `status` e `result_type` representam códigos internos da aplicação.
- A resposta da análise de planta utiliza campos em PascalCase dentro de `analysis_results`, conforme a estrutura retornada pelo serviço.
- Os campos de histórico e detalhes da análise utilizam os nomes definidos pelos respectivos serializers.
- A API utiliza validação de dados de entrada e tratamento de erros para retornar respostas HTTP apropriadas.