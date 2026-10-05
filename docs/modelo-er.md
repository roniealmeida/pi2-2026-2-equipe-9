# Modelo Entidade-Relacionamento (MER)

```mermaid
erDiagram
    USUARIO {
        int id_usuario PK
        string nome
        string telefone "UK"
        string senha_pin
        string perfil "Cliente ou Administrador"
        string estado
        string municipio
        string localidade
        string nome_fazenda "Opcional"
        string status "Ativo ou Bloqueado"
        boolean aceite_lgpd
        datetime data_cadastro
    }

    CONSULTA_HISTORICO {
        int id_consulta PK
        int id_usuario FK
        datetime data_hora
        string imagem_path
        string status_analise
        string nome_planta_detectada
        string especie_animal_suscetivel
        string riscos_humanos
        string sintomas
        string recomendacoes
    }

    LOG_AUDITORIA_ERRO {
        int id_log PK
        int id_usuario FK "Opcional"
        datetime data_hora
        string tipo_erro
        string detalhes
    }

    USUARIO ||--o{ CONSULTA_HISTORICO : "realiza"
    USUARIO ||--o{ LOG_AUDITORIA_ERRO : "gera/vincula"
