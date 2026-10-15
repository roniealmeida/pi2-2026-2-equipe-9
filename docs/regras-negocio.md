# Regras de Negócio — AnalisaAI

## RN01 — Unicidade de Contato

**Regra:** Cada número de telefone cadastrado deve ser único no sistema.

**Comportamento esperado:** O sistema deve rejeitar o cadastro de um telefone que já esteja associado a outra conta.

**Evidência de teste:** `test_cadastrar_usuario_com_telefone_duplicado` e `test_cadastrar_administrador_telefone_duplicado`, em `api/users/tests/test_integration_routes.py`.

## RN02 — Validação de Imagem

**Regra:** O sistema deve rejeitar imagens com mais de 10 MB, em formatos diferentes de JPG ou PNG, ou com resolução inferior a 300 × 300 pixels.

**Comportamento esperado:** Imagens que não atendam aos critérios devem ser rejeitadas antes do processamento da análise.

**Evidência:** `api/analysis/serializers/analysis_serializer.py` e `api/analysis/tests/test_image_validation.py`.

## RN03 — Obrigatoriedade de Consentimento

**Regra:** O cadastro de novos clientes exige o aceite explícito dos Termos de Uso e da Política de Privacidade.

**Comportamento esperado:** O cadastro deve ser rejeitado quando o campo de aceite estiver ausente ou for enviado como falso.

**Evidência de teste:** `test_cadastrar_usuario_sem_enviar_aceite_termos`, em `api/users/tests/test_integration_routes.py`.

**Observação:** A implementação valida o aceite durante o cadastro. Não se deve afirmar que o consentimento é armazenado separadamente no banco de dados.

## RN04 — Restrição de Criação de Administradores

**Regra:** A criação de contas administrativas deve ser restrita a administradores autenticados e autorizados.

**Comportamento esperado:** Uma requisição não autenticada ou realizada por um usuário sem permissão deve ser rejeitada.

**Evidência de teste:** `test_cadastrar_administrador_sem_autenticacao` e `test_cadastrar_administrador_sem_permissao`, em `api/users/tests/test_integration_routes.py`.

## RN05 — Segurança de Credenciais

**Regra:** Senhas ou PINs cadastrados devem possuir no mínimo 6 caracteres.

**Comportamento esperado:** O cadastro deve rejeitar credenciais com menos de 6 caracteres.

**Evidências de teste:**
- `test_cadastrar_usuario_com_senha_muito_curta`;
- `test_cadastrar_administrador_com_senha_muito_curta`;
- `test_login_senha_muito_curta`.

Os testes estão em `api/users/tests/test_integration_routes.py`.

## Validação geral

Após as alterações das regras de negócio, a suíte de testes foi executada com o comando:

`py manage.py test users.tests analysis.tests --settings=config.settings_test`

**Resultado registrado:** 78 testes executados, todos aprovados (`OK`).

O resultado deve ser atualizado caso novos testes sejam adicionados ou a suíte seja executada novamente.