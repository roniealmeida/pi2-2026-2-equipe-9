
from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from analysis.models.search_request_model import SearchRequest
from analysis.models.plant_analysis_result_model import PlantAnalysisResult
from users.models.user_model import User


class AnalysisHistoryIntegrationTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create(
            name="Usuario Teste",
            phone="+5588999999999",
            password_hash="hash_teste",
            is_admin=False,
            status=1
        )

        self.client.force_authenticate(user=self.user)

    def criar_analise(self, user=None, result_type=0, nome="Planta Teste"):
        usuario = user if user is not None else self.user

        analise = SearchRequest.objects.create(
            user=usuario,
            image="analysis/imagem_teste.jpg",
            result_type=result_type,
            status=SearchRequest.STATUS_COMPLETED
        )

        PlantAnalysisResult.objects.create(
            search_request=analise,
            common_name=nome,
            scientific_name="Planta scientifica",
            susceptible_animal_species="Bovinos",
            description="Descricao da planta",
            human_risks="Risco teste",
            common_symptoms="Sintoma teste",
            recommended_actions="Acao recomendada",
            confidence_score=95.50
        )

        return analise

    def test_historico_com_analise_concluida(self):
        analise = self.criar_analise()

        response = self.client.get(
            "/api/analysis/",
            {"userId": self.user.id}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )

        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["search_request_id"],
            analise.id
        )
        self.assertEqual(
            response.data[0]["analysis_result"]["common_name"],
            "Planta Teste"
        )

    def test_historico_vazio(self):
        response = self.client.get(
            "/api/analysis/",
            {"userId": self.user.id}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )
        self.assertEqual(response.data, [])

    def test_historico_sem_user_id(self):
        response = self.client.get("/api/analysis/")

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertIn("message", response.data)

    def test_historico_user_id_invalido(self):
        response = self.client.get(
            "/api/analysis/",
            {"userId": "abc"}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            response.data
        )
        self.assertIn("message", response.data)

    def test_historico_usuario_inexistente(self):
        response = self.client.get(
            "/api/analysis/",
            {"userId": 99999}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
            response.data
        )

    def test_historico_retorna_apenas_analises_completas(self):
        completa = self.criar_analise(
            result_type=SearchRequest.RESULT_COMPLETE,
            nome="Planta Completa"
        )

        self.criar_analise(
            result_type=SearchRequest.RESULT_PARTIAL,
            nome="Planta Parcial"
        )

        self.criar_analise(
            result_type=SearchRequest.RESULT_ERROR,
            nome="Planta Erro"
        )

        response = self.client.get(
            "/api/analysis/",
            {"userId": self.user.id}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["search_request_id"],
            completa.id
        )

    def test_historico_ordenado_do_mais_recente(self):
        antiga = self.criar_analise(nome="Planta Antiga")
        recente = self.criar_analise(nome="Planta Recente")

        SearchRequest.objects.filter(id=antiga.id).update(
            request_date=timezone.now() - timedelta(days=2)
        )

        SearchRequest.objects.filter(id=recente.id).update(
            request_date=timezone.now()
        )

        response = self.client.get(
            "/api/analysis/",
            {"userId": self.user.id}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.data
        )
        self.assertEqual(len(response.data), 2)
        self.assertEqual(
            response.data[0]["search_request_id"],
            recente.id
        )
        self.assertEqual(
            response.data[1]["search_request_id"],
            antiga.id
        )
