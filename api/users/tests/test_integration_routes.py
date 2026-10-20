from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models.user_model import User
from users.models.farm_model import Farm


class UserIntegrationRoutesTests(APITestCase):

    def test_cadastrar_usuario_persiste_no_banco_real(self):
        """
        Valida se o cadastro de usuário via rota realmente cria os registros
        nas tabelas User e Farm do banco de dados.
        """
        dados = {
            "name": "Maria Oliveira",
            "phone": "+5588988887777",
            "password": "senhaSegura123",
            "confirm_password": "senhaSegura123",
            "farm": {
                "name": "Fazenda Sol Nascente",
                "state": "Ceará",
                "location": "Zona RURAL",
                "municipality": "Crateús"
            }
        }


        response = self.client.post(
            reverse("users-list"),
            dados,
            format="json"
        )


        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


        user_db = User.objects.filter(phone="+5588988887777").first()
        self.assertIsNotNone(user_db, "O usuário deveria ter sido salvo no banco!")
        self.assertEqual(user_db.name, "Maria Oliveira")


        farm_db = Farm.objects.filter(user=user_db).first()
        self.assertIsNotNone(farm_db, "A fazenda associada deveria ter sido salva no banco!")
        self.assertEqual(farm_db.name, "Fazenda Sol Nascente")

    def test_login_com_usuario_real_persistido(self):
        """
        Cria um usuário direto no banco e testa se a rota de login
        consegue autenticar e gerar o token JWT com dados reais.
        """
        
        dto_cadastro = {
            "name": "Carlos Souza",
            "phone": "+5588977776666",
            "password": "senhaSegura123",
            "confirm_password": "senhaSegura123",
            "farm": {
                "name": "Sítio Primavera",
                "state": "Ceará",
                "location": "Sertão",
                "municipality": "Crateús"
            }
        }
        self.client.post(reverse("users-list"), dto_cadastro, format="json")


        dados_login = {
            "phone": "+5588977776666",
            "password": "senhaSegura123"
        }
        response = self.client.post(
            reverse("users-login"),
            dados_login,
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["user"]["name"], "Carlos Souza")