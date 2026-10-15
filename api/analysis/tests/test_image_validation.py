
import base64
from io import BytesIO
from unittest.mock import patch

from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from users.models.user_model import User


class AnalysisImageValidationTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create(
            name="Usuario Teste",
            phone="+5588999999999",
            password_hash="hash_teste",
            is_admin=False,
            status=1
        )
        self.client.force_authenticate(user=self.user)

    def criar_data_uri(self, formato="PNG", tamanho=(300, 300)):
        imagem = Image.new("RGB", tamanho, color="green")
        buffer = BytesIO()
        imagem.save(buffer, format=formato)

        conteudo = base64.b64encode(buffer.getvalue()).decode("utf-8")
        mime = "image/jpeg" if formato == "JPEG" else f"image/{formato.lower()}"

        return f"data:{mime};base64,{conteudo}"

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_aceita_imagem_png_valida(self, mock_analysis):
        mock_analysis.return_value = {"message": "Análise realizada"}

        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": self.criar_data_uri("PNG"),
                "userId": self.user.id
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_aceita_imagem_jpeg_valida(self, mock_analysis):
        mock_analysis.return_value = {"message": "Análise realizada"}

        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": self.criar_data_uri("JPEG"),
                "userId": self.user.id
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_rejeita_formato_nao_permitido(self, mock_analysis):
        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": self.criar_data_uri("WEBP"),
                "userId": self.user.id
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_analysis.assert_not_called()

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_rejeita_imagem_menor_que_300_por_300(self, mock_analysis):
        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": self.criar_data_uri("PNG", (299, 300)),
                "userId": self.user.id
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_analysis.assert_not_called()

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_rejeita_base64_invalido(self, mock_analysis):
        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": "data:image/png;base64,conteudo_invalido!!!",
                "userId": self.user.id
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_analysis.assert_not_called()

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_rejeita_conteudo_que_nao_e_imagem(self, mock_analysis):
        conteudo = base64.b64encode(b"isto nao e uma imagem").decode("utf-8")

        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": f"data:image/png;base64,{conteudo}",
                "userId": self.user.id
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_analysis.assert_not_called()

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_rejeita_imagem_acima_de_10_mb(self, mock_analysis):
        conteudo = base64.b64encode(b"x" * (10 * 1024 * 1024 + 1)).decode("utf-8")

        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": f"data:image/png;base64,{conteudo}",
                "userId": self.user.id
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_analysis.assert_not_called()
