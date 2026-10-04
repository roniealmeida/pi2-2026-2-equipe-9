from unittest.mock import patch

from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.test import APITestCase


class AnalysisErrorHandlingTests(APITestCase):

    def test_historico_sem_user_id_retorna_400(self):
        response = self.client.get(
            reverse("analysis-list")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        self.assertEqual(
            response.data,
            {"message": "userId é obrigatório"}
        )

    def test_historico_user_id_invalido_retorna_400(self):
        response = self.client.get(
            reverse("analysis-list"),
            {"userId": "abc"}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        self.assertEqual(
            response.data,
            {
                "message":
                "userId deve ser um número inteiro válido"
            }
        )

    def test_monitoramento_requested_by_invalido_retorna_400(self):
        response = self.client.get(
            reverse("analysis-all-analysis"),
            {"requested_by": "abc"}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        self.assertEqual(
            response.data,
            {
                "message":
                "requested_by deve ser um número inteiro válido"
            }
        )

    @patch("analysis.views.PlantAnalysisService.get_all_analysis")
    def test_monitoramento_sem_permissao_retorna_403(
        self,
        mock_all_analysis
    ):
        mock_all_analysis.side_effect = PermissionDenied(
            "Apenas administradores podem realizar esta operação"
        )

        response = self.client.get(
            reverse("analysis-all-analysis"),
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

    @patch("analysis.views.PlantAnalysisService.get_history")
    def test_historico_usuario_inexistente_retorna_404(
        self,
        mock_history
    ):
        mock_history.side_effect = NotFound(
            "Usuário não encontrado"
        )

        response = self.client.get(
            reverse("analysis-list"),
            {"userId": 999}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

        self.assertIn(
            "Usuário não encontrado",
            str(response.data)
        )

    @patch("analysis.views.PlantAnalysisService.get_details")
    def test_analise_inexistente_retorna_404(
        self,
        mock_details
    ):
        mock_details.side_effect = NotFound(
            "Análise não encontrada"
        )

        response = self.client.get(
            reverse(
                "analysis-detail",
                kwargs={"pk": 999}
            ),
            {"userId": 1}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

        self.assertIn(
            "Análise não encontrada",
            str(response.data)
        )