from unittest.mock import patch

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AnalysisMockRoutesTests(APITestCase):

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
            {"userId": 1}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
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
            {"userId": 1}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data,
            mock_get_details.return_value
        )

        mock_get_details.assert_called_once()
