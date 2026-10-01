from unittest.mock import patch

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class UserMockRoutesTests(APITestCase):

    @patch("users.views.UserService.create_user")
    def test_cadastrar_usuario(self, mock_create_user):

        mock_create_user.return_value = {
            "user": {
                "id": 1,
                "name": "João da Silva",
                "phone": "+5588999999999",
                "is_admin": False,
                "status": 1,
                "farm": {
                    "name": "Fazenda Boa Esperança",
                    "state": "Ceará",
                    "location": "Localidade Rural",
                    "municipality": "Crateús"
                }
            }
        }

        dados = {
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

        response = self.client.post(
            reverse("users-list"),
            dados,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(
            response.data,
            mock_create_user.return_value
        )

        mock_create_user.assert_called_once()

    @patch("users.views.UserService.login")
    def test_login(self, mock_login):

        mock_login.return_value = {
            "token": "jwt_mock_analisaai",
            "user": {
                "id": 1,
                "name": "João da Silva",
                "phone": "+5588999999999",
                "is_admin": False,
                "status": 1,
                "farm": {
                    "name": "Fazenda Boa Esperança",
                    "state": "Ceará",
                    "location": "Localidade Rural",
                    "municipality": "Crateús"
                }
            }
        }

        dados = {
            "phone": "+55 88 99999-9999",
            "password": "123456"
        }

        response = self.client.post(
            reverse("users-login"),
            dados,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data,
            mock_login.return_value
        )

        mock_login.assert_called_once()

    @patch("users.views.UserService.update_user")
    def test_atualizar_perfil(self, mock_update_user):

        mock_update_user.return_value = {
            "message": "Dados cadastrais atualizados com sucesso.",
            "user": {
                "id": 1,
                "name": "João da Silva",
                "phone": "+5588988888888",
                "is_admin": False,
                "status": 1,
                "farm": {
                    "name": "Nova Fazenda",
                    "state": "Ceará",
                    "location": "Nova Localidade",
                    "municipality": "Crateús"
                }
            }
        }

        dados = {
            "user_id": 1,
            "name": "João da Silva",
            "phone": "+55 88 98888-8888",
            "farm_name": "Nova Fazenda",
            "state": "Ceará",
            "location": "Nova Localidade",
            "municipality": "Crateús"
        }

        response = self.client.patch(
            reverse("users-update-profile"),
            dados,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data,
            mock_update_user.return_value
        )

        mock_update_user.assert_called_once()
