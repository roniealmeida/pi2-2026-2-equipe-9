from unittest.mock import patch

from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.test import APITestCase


class UserErrorHandlingTests(APITestCase):

    def test_listar_usuarios_sem_requested_by_retorna_400(self):
        response = self.client.get(
            reverse("users-list")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        self.assertEqual(
            response.data,
            {"message": "requested_by é obrigatório"}
        )

    @patch("users.views.UserService.list_users")
    def test_listar_usuarios_sem_permissao_retorna_403(
        self,
        mock_list_users
    ):
        mock_list_users.side_effect = PermissionDenied(
            "Apenas administradores podem realizar esta operação"
        )

        response = self.client.get(
            reverse("users-list"),
            {"requested_by": 2}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

        self.assertIn(
            "Apenas administradores",
            str(response.data)
        )

    @patch("users.views.UserService.list_users")
    def test_solicitante_inexistente_retorna_404(
        self,
        mock_list_users
    ):
        mock_list_users.side_effect = NotFound(
            "Usuário solicitante não encontrado"
        )

        response = self.client.get(
            reverse("users-list"),
            {"requested_by": 999}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

        self.assertIn(
            "Usuário solicitante não encontrado",
            str(response.data)
        )

    @patch("users.views.UserService.update_user")
    def test_atualizar_usuario_inexistente_retorna_404(
        self,
        mock_update_user
    ):
        mock_update_user.side_effect = NotFound(
            "Usuário não encontrado"
        )

        response = self.client.patch(
            reverse("users-update-profile"),
            {"user_id": 999},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

        self.assertIn(
            "Usuário não encontrado",
            str(response.data)
        )