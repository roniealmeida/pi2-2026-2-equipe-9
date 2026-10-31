
from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models.user_model import User


class AnalysisMockRoutesTests(APITestCase):
    @patch("analysis.views.PlantAnalysisService.get_all_analysis")
    def test_all_analysis_admin(self, mock_get_all_analysis):
        """
        Administrador consulta todas as análises.
        Deve retornar 200 e os dados fornecidos pelo serviço.
        """
        admin = User.objects.create(
            name="Administrador",
            phone="88999999999",
            password_hash="senha123",
            is_admin=True,
            status=1,
        )

        self.client.force_authenticate(user=admin)

        mock_get_all_analysis.return_value = [
            {
                "search_request_id": 1,
                "request_date": "2026-10-20T10:00:00Z",
                "status": 3,
                "result": "Milho",
            }
        ]

        url = reverse("analysis-all-analysis")
        response = self.client.get(
            url,
            {"requested_by": admin.id},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["result"], "Milho")

        mock_get_all_analysis.assert_called_once_with(admin.id)

    def test_all_analysis_non_admin(self):
        """
        Usuário comum tenta consultar todas as análises.
        Deve retornar 403.
        """
        user = User.objects.create(
            name="Usuário comum",
            phone="88988888888",
            password_hash="senha123",
            is_admin=False,
            status=1,
        )

        self.client.force_authenticate(user=user)

        url = reverse("analysis-all-analysis")
        response = self.client.get(
            url,
            {"requested_by": user.id},
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_all_analysis_missing_requested_by(self):
        """
        Requisição sem requested_by deve retornar 400.
        """
        url = reverse("analysis-all-analysis")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def setUp(self):
        self.user = User.objects.create(
            name="Usuario Teste",
            phone="+5588999999999",
            password_hash="hash_teste",
            is_admin=False,
            status=1
        )

        self.client.force_authenticate(user=self.user)

    @patch("analysis.views.PlantAnalysisService.get_history")
    def test_consultar_historico(self, mock_get_history):
        mock_get_history.return_value = [
            {
                "search_request_id": 10,
                "status": 3,
                "result_type": 0,
                "request_date": "2026-09-13T10:30:00",
                "finished_at": "2026-09-13T10:30:08",
                "image": "/media/analysis/imagem.jpg",
                "analysis_result": {
                    "common_name": "Nome comum da planta",
                    "Description": "Descrição da planta"
                }
            }
        ]

        response = self.client.get(
            reverse("analysis-list"),
            {"userId": self.user.id}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data,
            mock_get_history.return_value
        )

        mock_get_history.assert_called_once()

    @patch("analysis.views.PlantAnalysisService.get_details")
    def test_detalhes_analise(self, mock_get_details):
        mock_get_details.return_value = {
            "search_request_id": 10,
            "result_type": 0,
            "status": 3,
            "image": "/media/analysis/imagem.jpg",
            "analysis_results": [
                {
                    "id": 20,
                    "common_name": "Nome comum da planta",
                    "scientific_name": "Nome científico",
                    "susceptible_animal_species": ["Bovinos"],
                    "human_risks": "Riscos para humanos",
                    "description": "Descrição da planta",
                    "common_symptoms": ["Sintoma 1"],
                    "recommended_actions": [
                        "Ação recomendada"
                    ],
                    "confidence_score": 95.0
                }
            ]
        }

        response = self.client.get(
            reverse(
                "analysis-detail",
                kwargs={"pk": 10}
            ),
            {"userId": self.user.id}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(
            response.data,
            mock_get_details.return_value
        )

        mock_get_details.assert_called_once()
