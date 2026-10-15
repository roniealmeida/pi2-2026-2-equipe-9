from django.contrib.auth.hashers import check_password
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.hashers import make_password
from users.models.user_model import User
from users.models.farm_model import Farm

class UserIntegrationRoutesTests(APITestCase):

    def test_cadastrar_usuario_no_banco(self):
        dados = {
            "name": "Joao da Silva",
            "accept_terms": True,
            "phone": "+5588999999999",
            "password": "123456",
            "confirm_password": "123456",
            "farm": {
                "name": "Fazenda Boa Esperanca",
                "state": "Ceara",
                "location": "Zona Rural",
                "municipality": "Crateus"
            }
        }
        response = self.client.post(
            reverse("users-list"),
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(Farm.objects.count(), 1)
        user = User.objects.get(phone="+5588999999999")
        farm = Farm.objects.get(user=user)
        self.assertEqual(user.name, "Joao da Silva")
        self.assertFalse(user.is_admin)
        self.assertEqual(farm.name, "Fazenda Boa Esperanca")
        self.assertTrue(
            check_password("123456", user.password_hash)
        )
        self.assertEqual(response.data["user"]["id"], user.id)

    def test_cadastrar_usuario_sem_enviar_aceite_termos(self):
        dados = {
            "name": "Joao da Silva",
            "phone": "+5588999999999",
            "password": "123456",
            "confirm_password": "123456",
            "farm": {
                "name": "Fazenda Boa Esperanca",
                "state": "Ceara",
                "location": "Zona Rural",
                "municipality": "Crateus"
            }
        }

        response = self.client.post(
            reverse("users-list"),
            dados,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertIn("accept_terms", response.data)
        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(Farm.objects.count(), 0)

    def test_cadastrar_usuario_com_senhas_diferentes(self):
        dados = {
            "name": "Joao da Silva",
            "phone": "+5588999999999",
            "password": "123456",
            "confirm_password": "654321",
            "farm": {
                "name": "Fazenda Boa Esperanca",
                "state": "Ceara",
                "location": "Zona Rural",
                "municipality": "Crateus"
            }
        }
        response = self.client.post(
            reverse("users-list"),
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(Farm.objects.count(), 0)

    def test_cadastrar_usuario_com_telefone_duplicado(self):
        User.objects.create(
            name="Usuario Existente",
            phone="+5588999999999",
            password_hash="hash_teste",
            is_admin=False,
            status=1
        )
        dados = {
            "name": "Novo Usuario",
            "phone": "+5588999999999",
            "password": "123456",
            "confirm_password": "123456",
            "farm": {
                "name": "Fazenda Nova",
                "state": "Ceara",
                "location": "Zona Rural",
                "municipality": "Crateus"
            }
        }
        response = self.client.post(
            reverse("users-list"),
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(Farm.objects.count(), 0)

    def test_cadastrar_usuario_sem_nome(self):
        dados = {
            "phone": "+5588999999999",
            "password": "123456",
            "confirm_password": "123456",
            "farm": {
                "name": "Fazenda Boa Esperanca",
                "state": "Ceara",
                "location": "Zona Rural",
                "municipality": "Crateus"
            }
        }
        response = self.client.post(
            reverse("users-list"),
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(Farm.objects.count(), 0)

    def test_login_usuario_valido(self):
        user = User.objects.create(
            name="Joao da Silva",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        dados = {
            "phone": "+5588999999999",
            "password": "123456"
        }
        response = self.client.post(
            reverse("users-login"),
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )
        self.assertIn("token", response.data)
        self.assertEqual(response.data["user"]["id"], user.id)
        self.assertEqual(response.data["user"]["phone"], user.phone)

    def test_login_senha_incorreta(self):
        User.objects.create(
            name="Joao da Silva",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        response = self.client.post(
            reverse("users-login"),
            {
                "phone": "+5588999999999",
                "password": "654321"
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertNotIn("token", response.data)
        self.assertEqual(User.objects.count(), 1)

    def test_login_usuario_inexistente(self):
        response = self.client.post(
            reverse("users-login"),
            {
                "phone": "+5588999999999",
                "password": "123456"
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertNotIn("token", response.data)
        self.assertEqual(User.objects.count(), 0)

    def test_login_sem_telefone(self):
        response = self.client.post(
            reverse("users-login"),
            {
                "password": "123456"
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertNotIn("token", response.data)

    def test_login_sem_senha(self):
        response = self.client.post(
            reverse("users-login"),
            {
                "phone": "+5588999999999"
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertNotIn("token", response.data)

    def test_login_telefone_invalido(self):
        response = self.client.post(
            reverse("users-login"),
            {
                "phone": "123",
                "password": "123456"
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertNotIn("token", response.data)

    def test_login_senha_muito_curta(self):
        response = self.client.post(
            reverse("users-login"),
            {
                "phone": "+5588999999999",
                "password": "123"
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertNotIn("token", response.data)

    def test_atualizar_perfil_com_sucesso(self):
        user = User.objects.create(
            name="Joao da Silva",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        Farm.objects.create(
            user=user,
            name="Fazenda Antiga",
            state="Ceara",
            location="Zona Rural",
            municipality="Crateus"
        )
        dados = {
            "user_id": user.id,
            "name": "Joao Atualizado",
            "phone": "+5588988888888",
            "farm_name": "Fazenda Nova",
            "state": "Piaui",
            "location": "Nova Localizacao",
            "municipality": "Teresina"
        }
        self.client.force_authenticate(user=user)
        response = self.client.patch(
            "/api/users/profile/",
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )
        user.refresh_from_db()
        farm = Farm.objects.get(user=user)
        self.assertEqual(user.name, "Joao Atualizado")
        self.assertEqual(user.phone, "+5588988888888")
        self.assertEqual(farm.name, "Fazenda Nova")
        self.assertEqual(farm.state, "Piaui")
        self.assertEqual(farm.location, "Nova Localizacao")
        self.assertEqual(farm.municipality, "Teresina")
        self.assertEqual(response.data["user"]["id"], user.id)

    def test_atualizar_apenas_nome(self):
        user = User.objects.create(
            name="Nome Antigo",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=user)
        response = self.client.patch(
            "/api/users/profile/",
            {
                "user_id": user.id,
                "name": "Nome Novo"
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )
        user.refresh_from_db()
        self.assertEqual(user.name, "Nome Novo")
        self.assertEqual(user.phone, "+5588999999999")

    def test_atualizar_usuario_inexistente(self):
        self.client.force_authenticate(user=User(id=99999, is_admin=True))
        response = self.client.patch(
            "/api/users/profile/",
            {
                "user_id": 99999,
                "name": "Novo Nome"
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertEqual(User.objects.count(), 0)

    def test_atualizar_perfil_sem_user_id(self):
        self.client.force_authenticate(user=User(id=1, is_admin=True))
        response = self.client.patch(
            "/api/users/profile/",
            {
                "name": "Novo Nome"
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )

    def test_atualizar_perfil_com_telefone_duplicado(self):
        primeiro = User.objects.create(
            name="Primeiro Usuario",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        segundo = User.objects.create(
            name="Segundo Usuario",
            phone="+5588988888888",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=segundo)
        response = self.client.patch(
            "/api/users/profile/",
            {
                "user_id": segundo.id,
                "phone": primeiro.phone
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        segundo.refresh_from_db()
        self.assertEqual(segundo.phone, "+5588988888888")
        self.assertEqual(User.objects.count(), 2)

    def test_atualizar_perfil_com_telefone_invalido(self):
        user = User.objects.create(
            name="Joao da Silva",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=user)
        response = self.client.patch(
            "/api/users/profile/",
            {
                "user_id": user.id,
                "phone": "123"
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        user.refresh_from_db()
        self.assertEqual(user.phone, "+5588999999999")

    def test_atualizar_perfil_com_nome_vazio(self):
        user = User.objects.create(
            name="Joao da Silva",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=user)
        response = self.client.patch(
            "/api/users/profile/",
            {
                "user_id": user.id,
                "name": ""
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        user.refresh_from_db()
        self.assertEqual(user.name, "Joao da Silva")

    def test_listar_usuarios_com_administrador(self):
        admin = User.objects.create(
            name="Administrador",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        usuario1 = User.objects.create(
            name="Usuario Um",
            phone="+5588988888888",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        usuario2 = User.objects.create(
            name="Usuario Dois",
            phone="+5588977777777",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=admin)
        response = self.client.get(
            reverse("users-list"),
            {"requested_by": admin.id}
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )
        self.assertEqual(len(response.data), 2)
        ids = [item["id"] for item in response.data]
        self.assertIn(usuario1.id, ids)
        self.assertIn(usuario2.id, ids)
        self.assertNotIn(admin.id, ids)

    def test_listar_usuarios_com_usuario_comum(self):
        usuario = User.objects.create(
            name="Usuario Comum",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=usuario)
        response = self.client.get(
            reverse("users-list"),
            {"requested_by": usuario.id}
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
            response.data
        )

    def test_listar_usuarios_com_solicitante_inexistente(self):
        self.client.force_authenticate(user=User(id=99999, is_admin=True))
        response = self.client.get(
            reverse("users-list"),
            {"requested_by": 99999}
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )

    def test_listar_usuarios_sem_requested_by(self):
        self.client.force_authenticate(user=User(id=1, is_admin=True))
        response = self.client.get(
            reverse("users-list")
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertIn("message", response.data)

    def test_listar_usuarios_com_lista_vazia(self):
        admin = User.objects.create(
            name="Administrador",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        self.client.force_authenticate(user=admin)
        response = self.client.get(
            reverse("users-list"),
            {"requested_by": admin.id}
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )
        self.assertEqual(response.data, [])
        self.assertEqual(User.objects.count(), 1)

    def test_cadastrar_administrador_com_sucesso(self):
        admin = User.objects.create(
            name="Administrador Principal",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        dados = {
            "requested_by": admin.id,
            "name": "Novo Administrador",
            "phone": "+5588988888888",
            "password": "123456",
            "confirm_password": "123456"
        }
        self.client.force_authenticate(user=admin)
        response = self.client.post(
            "/api/users/admins/",
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data
        )
        self.assertEqual(User.objects.count(), 2)
        novo_admin = User.objects.get(phone="+5588988888888")
        self.assertTrue(novo_admin.is_admin)
        self.assertEqual(novo_admin.name, "Novo Administrador")
        self.assertEqual(novo_admin.status, 1)
        self.assertTrue(check_password("123456", novo_admin.password_hash))
        self.assertEqual(response.data["user"]["id"], novo_admin.id)

    def test_cadastrar_administrador_sem_permissao(self):
        usuario = User.objects.create(
            name="Usuario Comum",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        dados = {
            "requested_by": usuario.id,
            "name": "Novo Administrador",
            "phone": "+5588988888888",
            "password": "123456",
            "confirm_password": "123456"
        }
        self.client.force_authenticate(user=usuario)
        response = self.client.post(
            "/api/users/admins/",
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
            response.data
        )
        self.assertEqual(User.objects.count(), 1)

    def test_cadastrar_administrador_solicitante_inexistente(self):
        dados = {
            "requested_by": 99999,
            "name": "Novo Administrador",
            "phone": "+5588988888888",
            "password": "123456",
            "confirm_password": "123456"
        }
        self.client.force_authenticate(user=User(id=99999, is_admin=True))
        response = self.client.post(
            "/api/users/admins/",
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertEqual(User.objects.count(), 0)

    def test_cadastrar_administrador_telefone_duplicado(self):
        admin = User.objects.create(
            name="Administrador Principal",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        dados = {
            "requested_by": admin.id,
            "name": "Novo Administrador",
            "phone": "+5588999999999",
            "password": "123456",
            "confirm_password": "123456"
        }
        self.client.force_authenticate(user=admin)
        response = self.client.post(
            "/api/users/admins/",
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertEqual(User.objects.count(), 1)

    def test_cadastrar_administrador_senhas_diferentes(self):
        admin = User.objects.create(
            name="Administrador Principal",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        dados = {
            "requested_by": admin.id,
            "name": "Novo Administrador",
            "phone": "+5588988888888",
            "password": "123456",
            "confirm_password": "654321"
        }
        self.client.force_authenticate(user=admin)
        response = self.client.post(
            "/api/users/admins/",
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertEqual(User.objects.count(), 1)

    def test_cadastrar_administrador_sem_requested_by(self):
        dados = {
            "name": "Novo Administrador",
            "phone": "+5588988888888",
            "password": "123456",
            "confirm_password": "123456"
        }
        self.client.force_authenticate(user=User(id=1, is_admin=True))
        response = self.client.post(
            "/api/users/admins/",
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertEqual(User.objects.count(), 0)

    def test_cadastrar_administrador_sem_nome(self):
        dados = {
            "requested_by": 1,
            "phone": "+5588988888888",
            "password": "123456",
            "confirm_password": "123456"
        }
        self.client.force_authenticate(user=User(id=1, is_admin=True))
        response = self.client.post(
            "/api/users/admins/",
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertEqual(User.objects.count(), 0)

    def test_cadastrar_administrador_telefone_invalido(self):
        dados = {
            "requested_by": 1,
            "name": "Novo Administrador",
            "phone": "123",
            "password": "123456",
            "confirm_password": "123456"
        }
        self.client.force_authenticate(user=User(id=1, is_admin=True))
        response = self.client.post(
            "/api/users/admins/",
            dados,
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertEqual(User.objects.count(), 0)

    def test_listar_administradores_com_sucesso(self):
        admin = User.objects.create(
            name="Administrador Principal",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        outro_admin = User.objects.create(
            name="Segundo Administrador",
            phone="+5588988888888",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        usuario = User.objects.create(
            name="Usuario Comum",
            phone="+5588977777777",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=admin)
        response = self.client.get(
            "/api/users/admins/list/",
            {"requested_by": admin.id}
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )
        self.assertEqual(len(response.data), 2)
        ids = [item["id"] for item in response.data]
        self.assertIn(admin.id, ids)
        self.assertIn(outro_admin.id, ids)
        self.assertNotIn(usuario.id, ids)

    def test_listar_administradores_sem_permissao(self):
        usuario = User.objects.create(
            name="Usuario Comum",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=usuario)
        response = self.client.get(
            "/api/users/admins/list/",
            {"requested_by": usuario.id}
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
            response.data
        )

    def test_listar_administradores_solicitante_inexistente(self):
        self.client.force_authenticate(user=User(id=99999, is_admin=True))
        response = self.client.get(
            "/api/users/admins/list/",
            {"requested_by": 99999}
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )

    def test_listar_administradores_sem_requested_by(self):
        self.client.force_authenticate(user=User(id=1, is_admin=True))
        response = self.client.get(
            "/api/users/admins/list/"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertIn("message", response.data)

    def test_listar_administradores_sem_outros_administradores(self):
        admin = User.objects.create(
            name="Administrador Principal",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        self.client.force_authenticate(user=admin)
        response = self.client.get(
            "/api/users/admins/list/",
            {"requested_by": admin.id}
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], admin.id)

    def test_alterar_status_com_sucesso(self):
        admin = User.objects.create(
            name="Administrador",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        usuario = User.objects.create(
            name="Usuario Comum",
            phone="+5588988888888",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=admin)
        response = self.client.patch(
            "/api/users/status/",
            {
                "requested_by": admin.id,
                "user_id": usuario.id,
                "status": 2
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )
        usuario.refresh_from_db()
        self.assertEqual(usuario.status, 2)
        self.assertIn("message", response.data)

    def test_alterar_status_para_inativo(self):
        admin = User.objects.create(
            name="Administrador",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        usuario = User.objects.create(
            name="Usuario Comum",
            phone="+5588988888888",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=admin)
        response = self.client.patch(
            "/api/users/status/",
            {
                "requested_by": admin.id,
                "user_id": usuario.id,
                "status": 0
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )
        usuario.refresh_from_db()
        self.assertEqual(usuario.status, 0)

    def test_alterar_status_para_ativo(self):
        admin = User.objects.create(
            name="Administrador",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        usuario = User.objects.create(
            name="Usuario Inativo",
            phone="+5588988888888",
            password_hash=make_password("123456"),
            is_admin=False,
            status=0
        )
        self.client.force_authenticate(user=admin)
        response = self.client.patch(
            "/api/users/status/",
            {
                "requested_by": admin.id,
                "user_id": usuario.id,
                "status": 1
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )
        usuario.refresh_from_db()
        self.assertEqual(usuario.status, 1)

    def test_alterar_status_sem_permissao(self):
        solicitante = User.objects.create(
            name="Usuario Solicitante",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        usuario = User.objects.create(
            name="Outro Usuario",
            phone="+5588988888888",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=solicitante)
        response = self.client.patch(
            "/api/users/status/",
            {
                "requested_by": solicitante.id,
                "user_id": usuario.id,
                "status": 2
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
            response.data
        )
        usuario.refresh_from_db()
        self.assertEqual(usuario.status, 1)

    def test_alterar_status_solicitante_inexistente(self):
        usuario = User.objects.create(
            name="Usuario Comum",
            phone="+5588988888888",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=User(id=99999, is_admin=True))
        response = self.client.patch(
            "/api/users/status/",
            {
                "requested_by": 99999,
                "user_id": usuario.id,
                "status": 2
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        usuario.refresh_from_db()
        self.assertEqual(usuario.status, 1)

    def test_alterar_status_usuario_inexistente(self):
        admin = User.objects.create(
            name="Administrador",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        self.client.force_authenticate(user=admin)
        response = self.client.patch(
            "/api/users/status/",
            {
                "requested_by": admin.id,
                "user_id": 99999,
                "status": 2
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )

    def test_alterar_status_invalido(self):
        admin = User.objects.create(
            name="Administrador",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        usuario = User.objects.create(
            name="Usuario Comum",
            phone="+5588988888888",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=admin)
        response = self.client.patch(
            "/api/users/status/",
            {
                "requested_by": admin.id,
                "user_id": usuario.id,
                "status": 99
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        usuario.refresh_from_db()
        self.assertEqual(usuario.status, 1)

    def test_alterar_status_ja_existente(self):
        admin = User.objects.create(
            name="Administrador",
            phone="+5588999999999",
            password_hash=make_password("123456"),
            is_admin=True,
            status=1
        )
        usuario = User.objects.create(
            name="Usuario Comum",
            phone="+5588988888888",
            password_hash=make_password("123456"),
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=admin)
        response = self.client.patch(
            "/api/users/status/",
            {
                "requested_by": admin.id,
                "user_id": usuario.id,
                "status": 1
            },
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        usuario.refresh_from_db()
        self.assertEqual(usuario.status, 1)

    def test_alterar_status_sem_campos_obrigatorios(self):
        self.client.force_authenticate(user=User(id=1, is_admin=True))
        response = self.client.patch(
            "/api/users/status/",
            {},
            format="json"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertEqual(User.objects.count(), 0)
