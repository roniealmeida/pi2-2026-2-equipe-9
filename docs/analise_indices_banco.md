# Análise de Índices do Banco de Dados

## 1. Objetivo

O objetivo desta tarefa é verificar quais consultas são feitas pela API, quais colunas são usadas nos filtros e quais índices já existem no banco de dados. Com isso, podemos identificar se há alguma coluna que pode precisar de um índice no futuro.

## 2. Consultas e filtros encontrados

Analisando o código da API, encontrei consultas que usam as seguintes colunas:

| Módulo | Tabela | Colunas | Para que são usadas |
|---|---|---|---|
| Usuários | `Users` | `id` | Buscar um usuário pelo ID |
| Usuários | `Users` | `phone` | Fazer login e verificar se o telefone já está cadastrado |
| Usuários | `Users` | `is_admin` | Separar usuários comuns dos administradores |
| Fazendas | `Farms` | `user_id` | Buscar a fazenda de um usuário |
| Análises | `SearchRequests` | `user_id`, `result_type`, `request_date` | Buscar o histórico de análises de um usuário e ordenar por data |
| Análises | `SearchRequests` | `id`, `user_id` | Buscar uma análise específica de um usuário |
| Análises | `SearchRequests` | `request_date` | Ordenar a lista geral de análises por data |
| Resultados | `PlantAnalysisResults` | `search_request_id` | Buscar os resultados de uma análise |
| Logs de erro | `SearchErrorLogs` | `search_request_id` | Buscar o log de erro de uma requisição |

## 3. Índices que já existem

Consultei a estrutura do banco PostgreSQL para verificar os índices existentes. Encontrei os seguintes:

| Tabela | Coluna | O que foi encontrado |
|---|---|---|
| `Users` | `id` | Chave primária |
| `Farms` | `id` | Chave primária |
| `Farms` | `user_id` | Índice existente |
| `SearchRequests` | `id` | Chave primária |
| `SearchRequests` | `user_id` | Índice existente |
| `PlantAnalysisResults` | `id` | Chave primária |
| `PlantAnalysisResults` | `search_request_id` | Índice existente |
| `SearchErrorLogs` | `id` | Chave primária |
| `SearchErrorLogs` | `search_request_id` | Restrição de unicidade com índice associado |

As chaves primárias já possuem índices, e também existem índices em colunas usadas nos relacionamentos entre as tabelas.

No caso de `SearchErrorLogs`, a coluna `search_request_id` tem uma restrição de unicidade. Isso impede que a mesma requisição tenha mais de um log de erro.

## 4. Colunas que podem precisar de índices

### 4.1. Telefone do usuário

A coluna `Users.phone` é usada no login e na verificação de telefones já cadastrados. Na consulta que fiz, não encontrei um índice para essa coluna.

Vale avaliar a criação de um índice, principalmente se a quantidade de usuários aumentar e essas consultas ficarem mais lentas.

Também é importante observar que a verificação de telefone duplicado feita pelo código não garante, sozinha, que não haverá duplicidade em operações simultâneas. Se a regra do sistema for permitir apenas um cadastro por telefone, seria necessário avaliar uma restrição de unicidade no banco.

### 4.2. Histórico de análises

Na consulta do histórico, são usados `user_id` e `result_type` como filtros, e os resultados são ordenados por `request_date`.

Uma possibilidade seria criar um índice composto com essas três colunas: `(user_id, result_type, request_date)`. Ele pode ajudar nessa consulta, mas seria necessário testar o desempenho antes de decidir pela criação.

### 4.3. Lista geral de análises

A listagem geral de análises é ordenada pela coluna `request_date`. Não encontrei um índice específico para essa coluna.

Podemos avaliar se um índice nela ajudaria a melhorar essa consulta. Para decidir, seria importante verificar o plano de execução e considerar a quantidade de registros no banco.

### 4.4. Filtro de administradores

A coluna `is_admin` é usada para listar administradores e usuários comuns. Apesar de não ter encontrado um índice para ela, não significa que seja necessário criar um.

Como essa coluna só possui valores booleanos, um índice separado pode não trazer uma melhora significativa. Por isso, vale observar o desempenho antes de fazer alguma alteração.

## 5. Conclusão

Com essa análise, foi possível identificar os índices que já existem e as colunas usadas com mais frequência nas consultas da API.

Os principais pontos que podem ser avaliados no futuro são a coluna `Users.phone` e um possível índice composto para o histórico de análises em `SearchRequests`.

Por enquanto, não foram criados novos índices. Antes de fazer isso, é importante verificar se realmente haverá ganho de desempenho e se as alterações atendem às regras do sistema.