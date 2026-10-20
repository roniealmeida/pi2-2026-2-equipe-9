# Análise de Índices do Banco de Dados

## 1. Objetivo

Identificar as consultas e os filtros utilizados pelas rotas da API, mapear as colunas envolvidas e documentar os índices existentes e possíveis necessidades de otimização.

## 2. Consultas e filtros identificados

A análise do código identificou as seguintes consultas relevantes:

| Módulo | Tabela | Colunas utilizadas | Finalidade |
|---|---|---|---|
| Usuários | `Users` | `id` | Buscar usuários por identificador |
| Usuários | `Users` | `phone` | Login e verificação de telefone já cadastrado |
| Usuários | `Users` | `is_admin` | Listar usuários administradores ou comuns |
| Fazendas | `Farms` | `user_id` | Buscar a fazenda associada a um usuário |
| Análises | `SearchRequests` | `user_id`, `result_type`, `request_date` | Consultar histórico de análises por usuário e ordenar por data |
| Análises | `SearchRequests` | `id`, `user_id` | Buscar uma análise específica pertencente a um usuário |
| Análises | `SearchRequests` | `request_date` | Ordenar a listagem geral de análises |
| Resultados | `PlantAnalysisResults` | `search_request_id` | Buscar resultados associados a uma requisição |
| Logs de erro | `SearchErrorLogs` | `search_request_id` | Buscar o log de erro associado a uma requisição |

## 3. Índices existentes

A estrutura do banco PostgreSQL foi consultada por meio da introspecção do Django.

| Tabela | Coluna(s) | Índice ou restrição identificada |
|---|---|---|
| `Users` | `id` | Chave primária |
| `Farms` | `id` | Chave primária |
| `Farms` | `user_id` | Índice existente |
| `SearchRequests` | `id` | Chave primária |
| `SearchRequests` | `user_id` | Índice existente |
| `PlantAnalysisResults` | `id` | Chave primária |
| `PlantAnalysisResults` | `search_request_id` | Índice existente |
| `SearchErrorLogs` | `id` | Chave primária |
| `SearchErrorLogs` | `search_request_id` | Restrição de unicidade e índice associado |

As chaves primárias identificam os registros. Os índices das chaves estrangeiras auxiliam consultas e relacionamentos entre as tabelas.

A restrição de unicidade de `SearchErrorLogs.search_request_id` impede que uma mesma requisição possua mais de um registro de erro.

## 4. Possíveis necessidades de indexação

### 4.1. Telefone do usuário

A coluna `Users.phone` é utilizada nas consultas de login e na verificação de telefones já cadastrados. Não foi identificado índice para essa coluna na inspeção realizada.

**Recomendação:** avaliar a criação de um índice em `phone`, considerando a frequência dessas consultas e o volume de usuários. Caso o telefone deva ser único, também deve ser avaliada uma restrição de unicidade no banco, pois a verificação feita apenas pela aplicação não garante a ausência de duplicidades em operações concorrentes.

### 4.2. Histórico de análises

A consulta de histórico filtra `SearchRequests` por `user_id` e `result_type`, e ordena os resultados por `request_date`.

**Recomendação:** avaliar um índice composto por `(user_id, result_type, request_date)` para atender aos filtros e à ordenação. A necessidade deve ser confirmada por análise do plano de execução e do volume de dados.

### 4.3. Listagem geral de análises

A listagem geral consulta as requisições e as ordena por `request_date` em ordem decrescente.

**Recomendação:** avaliar se um índice em `request_date` traz benefício para essa consulta, utilizando o plano de execução e dados representativos. A existência de uma ordenação, isoladamente, não garante que um novo índice seja necessário.

### 4.4. Filtro por administrador

A listagem de usuários utiliza a coluna `is_admin` para separar administradores e usuários comuns.

**Recomendação:** manter como ponto de observação. Como se trata de uma coluna booleana, um índice isolado pode não trazer benefício suficiente; a decisão depende da distribuição dos dados e do desempenho observado.

## 5. Conclusão

A inspeção identificou índices existentes nas chaves primárias e em relacionamentos importantes do sistema, além da restrição de unicidade em `SearchErrorLogs.search_request_id`.

As principais oportunidades a avaliar são a indexação de `Users.phone` e um possível índice composto para a consulta de histórico em `SearchRequests`. Também devem ser analisados os planos de execução das consultas ordenadas por data antes de qualquer alteração.

As recomendações deste documento são propostas de avaliação, não alterações já realizadas no banco de dados. A criação de novos índices deve ser precedida de validação de desempenho e dos requisitos de integridade do sistema.