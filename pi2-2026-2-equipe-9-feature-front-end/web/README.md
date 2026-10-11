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
