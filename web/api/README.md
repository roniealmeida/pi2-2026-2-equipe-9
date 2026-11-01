# AnalisaAI

![Python](https://img.shields.io/badge/Python-3.11-blue)
![Django](https://img.shields.io/badge/Django-5.2-green)
![DRF](https://img.shields.io/badge/DRF-REST-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-Build-purple)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

---

## Sobre o Projeto

A proposta do sistema, denominado **AnalisaAI**, consiste em uma plataforma para o mapeamento de plantas tóxicas destinada aos agricultores. O projeto tem como clientes os professores do Instituto Federal do Ceará (IFCE) – Campus Crateús, Liandro Torres e Marcelo Araújo, que identificaram dúvidas recorrentes de produtores rurais quanto à identificação e aos riscos de plantas encontradas na região do sertão de Crateús.

Diante dessa necessidade, foi desenvolvida uma plataforma web com o objetivo de identificar plantas tóxicas presentes nas propriedades rurais e prevenir problemas de saúde em animais. O usuário envia fotografias de plantas encontradas no campo e recebe informações relevantes sobre sua identificação, nível de toxicidade e possíveis riscos aos animais, geradas via API de IA (ChatGPT/Gemini).

O projeto é dividido em dois repositórios:

* **Backend** — API em Django + Django REST Framework
* **Frontend** — Interface em React + Vite

---

## Arquitetura Geral

```
┌──────────────┐        HTTP/JWT        ┌──────────────┐        IA        ┌─────────────┐
│   Frontend   │ ─────────────────────> │   Backend    │ ───────────────> │  Gemini /   │
│  React+Vite  │ <───────────────────── │ Django + DRF │ <─────────────── │  OpenAI     │
└──────────────┘                        └──────┬───────┘                  └─────────────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │  PostgreSQL  │
                                         └──────────────┘
```

---
---

# Backend

## Sobre o Backend

API backend desenvolvida com **Django + Django REST Framework**, seguindo uma arquitetura organizada em camadas:

* **Controllers** (Views)
* **Services** (Regras de negócio)
* **Repositories** (Acesso a dados)
* **Core** (Infraestrutura compartilhada + IA)

O módulo `analysis` concentra as funcionalidades de análise/IA do sistema, enquanto `users` cuida do cadastro e gerenciamento de usuários.


### Requisitos

* Python 3.11+
* PostgreSQL
* pip

### Estrutura do Projeto

```
api/
│
├── analysis/                    # Módulo de análise / integração com IA
│   ├── dtos/
│   │   └── analisys_dto.py
│   ├── models/
│   │   ├── plant_analysis_result_model.py
│   │   ├── search_error_log_model.py
│   │   └── search_request_model.py
│   ├── models.py
│   ├── serializers/
│   │   ├── analysis_serializer.py
│   │   └── response_serializers.py
│   ├── services/
│   │   └── plant_analisys_service.py
│   ├── admin.py
│   ├── apps.py
│   ├── urls.py
│   └── views.py
│
├── config/                      # Configurações principais do Django
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── core/                        # Código compartilhado
│   ├── ai/                      # Integração com IA (Gemini, OpenAI)
│   │   ├── gemini_service.py
│   │   ├── openia_service.py
│   │   ├── prompt.py
│   │   └── responses/
│   │       ├── plant_analysis_response.py
│   │       └── plant_analysis_result.py
│   ├── authentication/
│   │   └── jwt_authentication.py
│   ├── database/
│   │   └── base_repository.py   # Repository genérico com funções básicas
│   └── middlewares/
│       └── api_logger.py
│
├── users/                       # Módulo de usuários
│   ├── dtos/
│   │   ├── change_status_dto.py
│   │   ├── farm_dto.py
│   │   ├── login_dto.py
│   │   ├── register_admin_dto.py
│   │   └── register_user_dto.py
│   ├── models/
│   │   ├── farm_model.py
│   │   └── user_model.py
│   ├── serializers/
│   │   ├── change_status_serializer.py
│   │   ├── login_serializer.py
│   │   ├── register_admin_serializer.py
│   │   ├── register_farm_serializer.py
│   │   ├── register_user_serializer.py
│   │   └── response_serializers.py
│   ├── services/
│   │   └── user_service.py
│   ├── admin.py
│   ├── apps.py
│   ├── urls.py
│   └── views.py
│
├── .env.example                 # Exemplo de configuração
├── manage.py
└── requirements.txt
```

> A pasta `migrations/` de cada módulo e o ambiente virtual (`venv`) foram omitidos acima por serem gerados automaticamente.




### Configuração do Ambiente

**Criar ambiente virtual**
```bash
python -m venv venv
```

**Ativar ambiente**

Windows:
```bash
venv\Scripts\activate
```

Linux/Mac:
```bash
source venv/bin/activate
```

**Instalar dependências**
```bash
pip install -r requirements.txt
```

### Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto:

```env
DB_NAME=database-name
DB_USER=user
DB_PASSWORD=password
DB_HOST=host
DB_PORT=port
DB_SSL=require
JWT_SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
DEBUG=False
SECRET_KEY=your-django-secret-key
USE_OPENAI=False
OPENAI_API_KEY=your-openai-api-key
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,::1,*
CSRF_TRUSTED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
MEDIA_URL=/media/
MEDIA_ROOT=media
MEDIA_BASE_URL=
```


### Configuração do Banco (Django)

No `config/settings.py`:

```python
from decouple import config

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
        'OPTIONS': {
            'sslmode': config('DB_SSL', default='require'),
        }
    }
}
```

### Banco de Dados

**Aplicar migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

**Criar superusuário**
```bash
python manage.py createsuperuser
```

Acessar: `http://127.0.0.1:8000/admin/`

### Executar o Projeto

```bash
python manage.py runserver
```

API disponível em: `http://127.0.0.1:8000/`

### Endpoints

| Método | Rota                                            | Descrição                    | Acesso  |
| ------ | ----------------------------------------------- | ---------------------------- | ------- |
| GET    | `/api/users/?requested_by={id}`                 | Listar Usuários              | Comum   |
| POST   | `/api/users/`                                   | Registrar Novo Usuário comum | Comum   |
| POST   | `/api/users/login/`                             | Fazer Login                  | Comum   |
| PATCH  | `/api/users/profile/`                           | Atualizar Dados Cadastrais   | Comum   |
| PATCH  | `/api/users/status/`                            | Alterar Status do Usuário    | Admin   |
| POST   | `/api/users/admins/`                            | Registrar Administrador      | Admin   |
| GET    | `/api/users/admins/list/?requested_by={id}`     | Listar Administradores       | Admin   |
| GET    | `/api/analysis/?userId={id}`                    | Listar Histórico de Análises | Comum   |
| POST   | `/api/analysis/`                                | Criar Análise de Planta      | Comum   |
| GET    | `/api/analysis/{id}/?userId={id}`               | Obter Detalhes de Análise    | Comum   |
| GET    | `/api/analysis/all-analysis/?requested_by={id}` | Listar Todas as Análises     | Admin   |

### Boas Práticas (Backend)

* ❌ Nunca subir `.env`
* ✅ Usar `.env.example`
* ✅ Rodar `migrate` após alterar models
* ❌ Não colocar lógica na View
* ✅ Services controlam regras
* ✅ Repository genérico (`core/database/base_repository.py`) centraliza o acesso a dados

### Observações (Backend)

* Django já gerencia conexão com banco automaticamente
* O `core` centraliza reutilização (IA)
* Cada módulo é independente

### Dependências principais (Backend)

```txt
Django
djangorestframework
drf-spectacular
psycopg2-binary
python-decouple
```

---
---

# Frontend

## Sobre o Frontend

Frontend do **AnalisaAI**, desenvolvido com **React** (via **Vite**), seguindo uma arquitetura organizada por responsabilidades. A interface permite que o usuário envie fotografias de plantas encontradas no campo e visualize os resultados da análise, processados pelo Backend.

### Requisitos

* Node.js 18+
* npm ou yarn

### Estrutura do Projeto

```
src/
│
├── api/                          # Camada de comunicação com o backend
│   └── api.js
│
├── assets/                       # Recursos estáticos
│   ├── fonts/
│   │   └── Montserrat/           # Fonte principal do projeto
│   └── images/                   # Ícones e imagens da interface
│
├── components/                   # Componentes reutilizáveis
│   ├── CardPlanta.jsx
│   ├── Loading.jsx
│   └── MenuSusp.jsx
│
├── pages/                        # Páginas da aplicação
│   ├── Admin/
│   │   ├── Admin.jsx
│   │   ├── CadastroAdmin/
│   │   └── ListUsers/
│   ├── Cadastro/
│   │   ├── Cadastrar.jsx
│   │   └── Propriedade.jsx
│   ├── EditarPerfil/
│   ├── Historico/
│   ├── Home/
│   ├── Login/
│   ├── MenuLateral/
│   ├── Resultado/
│   └── Retorno/
│
├── routes/                       # Configuração de rotas (React Router DOM)
│   └── AppRoutes.jsx
│
├── stores/                       # Gerenciamento de estado global (Zustand)
│   ├── analysisStore.js          # Estado de análises: criação, histórico, busca por ID
│   └── authStore.js
│
├── styles/                       # Estilos globais
│   └── global.css
│
├── utils/                        # Funções utilitárias
│   └── converter.js
│
├── App.jsx                       # Componente raiz da aplicação
└── main.jsx                      # Ponto de entrada da aplicação
```

### Rotas

Configuradas em `src/routes/AppRoutes.jsx` com **React Router DOM**:

| Rota | Componente | Descrição |
| ---- | ---------- | --------- |
| `/` | `Login` | Autenticação do usuário |
| `/home` | `Home` | Tela inicial após login |
| `/editar-perfil` | `EditarPerfil` | Edição dos dados do usuário |
| `/historico` | `Historico` | Histórico de análises realizadas |
| `/cadastro` | `Cadastrar` | Cadastro de usuário |
| `/propriedade` | `Propriedade` | Cadastro de propriedade rural |
| `/retorno/:id` | `Retorno` | Exibida **imediatamente após o envio de uma foto para análise**. Lê o `analysis` já presente no `analysisStore` (populado por `createAnalysis`) e a imagem enviada via `location.state`. Mostra tela de erro caso a análise falhe. |
| `/resultado/:id` | `Resultado` | Exibida ao **acessar uma análise do histórico**. Busca os dados via `fetchAnalysisById(id, user.id)` usando o `id` da URL, com estados de carregamento e erro próprios. O botão "voltar" retorna para `/historico`. |
| `/admin` | `Admin` | Painel administrativo |
| `/cadastroAdmin` | `CadastroAdmin` | Cadastro de administradores |
| `/listUsers` | `ListUsers` | Listagem de usuários (admin) |


### Configuração do Ambiente

**Instalar dependências**
```bash
npm install
```

**Configurar variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto com a URL da API:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### Scripts Disponíveis

| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite), disponível em `http://localhost:5173/` |
| `npm run build` | Gera o build de produção |
| `npm run lint` | Executa o ESLint em todo o projeto |
| `npm run preview` | Serve localmente o build de produção para testes |

### Gerenciamento de Estado (Zustand)

O estado global é gerenciado com **Zustand**, com stores dedicadas por domínio.

**`analysisStore`** — Gerencia o fluxo de análise de plantas, consumindo o endpoint `/api/analysis/` do backend:

| Ação | Método HTTP consumido | Descrição |
| ---- | ---------------------- | --------- |
| `createAnalysis(image, userId)` | `POST /api/analysis/` | Envia uma imagem para análise e armazena o resultado |
| `fetchAnalysisHistory(userId)` | `GET /api/analysis/` | Busca o histórico de análises do usuário |
| `fetchAnalysisById(searchRequestId, userId)` | `GET /api/analysis/{id}/` | Busca uma análise específica pelo ID |

Estado exposto: `loading`, `error`, `analysis`, `searchRequestId`, `analysisHistory`.

**`authStore`** — Gerencia autenticação e sessão do usuário:

| Ação | Método HTTP consumido | Descrição |
| ---- | ---------------------- | --------- |
| `login(telefone, password)` | `POST /api/users/login/` | Autentica o usuário, salva `token`/`user` no estado e em `localStorage` |
| `register(payload)` | `POST /api/users/` | Cadastra um novo usuário |
| `logout()` | — | Limpa `token`/`user` do estado e do `localStorage` |

Estado exposto: `user`, `token`, `loading`.

### Integração com o Backend

O frontend se comunica com a API Django através de uma instância do **axios** configurada em `src/api/api.js`:

* **Base URL**: definida pela variável de ambiente `VITE_API_URL`
* **Autenticação**: um interceptor de requisição injeta automaticamente o token JWT (lido do `authStore`) no header `Authorization: Bearer <token>` de toda chamada, quando disponível

Isso significa que qualquer chamada feita através de `api` (via `analysisStore`, `authStore` ou diretamente) já envia o token de autenticação sem precisar repetir esse código em cada requisição — alinhado com o `core/authentication/jwt_authentication.py` do backend.


### Boas Práticas (Frontend)

* ✅ Componentes reutilizáveis ficam em `components/`, páginas específicas em `pages/`
* ✅ Toda chamada à API passa por `api/api.js`
* ✅ Estado global fica isolado em `stores/`
* ❌ Evitar lógica de negócio dentro dos componentes de página
* ❌ Nunca subir `.env` com credenciais reais

### Dependências (Frontend)

```txt
react            ^19.2.6
react-dom        ^19.2.6
react-router-dom ^7.17.0
zustand          ^5.0.14
axios            ^1.18.0
react-icons      ^5.6.0
```

Dependências de desenvolvimento:
```txt
vite                          ^8.0.12
eslint                        ^10.3.0
@vitejs/plugin-react          ^6.0.1
