
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models.user_model import User


class UserErrorHandlingTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create(
            name="Usuario Teste",
            phone="+5588999999999",
            password_hash="hash_teste",
            is_admin=False,
            status=1
        )

        self.client.force_authenticate(user=self.user)

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

    def test_listar_usuarios_sem_permissao_retorna_403(self):
        response = self.client.get(
            reverse("users-list"),
            {"requested_by": self.user.id}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

        self.assertEqual(
    response.data,
    {"message": "Apenas administradores podem realizar esta operação."}
)

    def test_solicitante_diferente_do_autenticado_retorna_403(self):
        response = self.client.get(
            reverse("users-list"),
            {"requested_by": 999}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

        self.assertEqual(
            response.data,
            {"message": "Você não tem permissão para realizar esta operação."}
        )

    def test_atualizar_perfil_de_outro_usuario_retorna_403(self):
        response = self.client.patch(
            reverse("users-update-profile"),
            {"user_id": 999},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

        self.assertEqual(
            response.data,
            {"message": "Você não tem permissão para alterar este perfil."}
        )
