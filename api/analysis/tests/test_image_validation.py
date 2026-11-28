
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

        conteudo = base64.b64encode(
            buffer.getvalue()
        ).decode("utf-8")

        mime = (
            "image/jpeg"
            if formato == "JPEG"
            else f"image/{formato.lower()}"
        )

        return f"data:{mime};base64,{conteudo}"

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_aceita_imagem_png_valida(self, mock_analysis):
        mock_analysis.return_value = {
            "message": "Análise realizada"
        }

        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": self.criar_data_uri("PNG")
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_aceita_imagem_jpeg_valida(self, mock_analysis):
        mock_analysis.return_value = {
            "message": "Análise realizada"
        }

        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": self.criar_data_uri("JPEG")
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_rejeita_formato_nao_permitido(self, mock_analysis):
        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": self.criar_data_uri("WEBP")
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        mock_analysis.assert_not_called()

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_rejeita_imagem_menor_que_300_por_300(
        self,
        mock_analysis
    ):
        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": self.criar_data_uri("PNG", (299, 300))
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        mock_analysis.assert_not_called()

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_rejeita_base64_invalido(self, mock_analysis):
        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": "data:image/png;base64,conteudo_invalido!!!"
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        mock_analysis.assert_not_called()

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_rejeita_conteudo_que_nao_e_imagem(self, mock_analysis):
        conteudo = base64.b64encode(
            b"isto nao e uma imagem"
        ).decode("utf-8")

        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": f"data:image/png;base64,{conteudo}"
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        mock_analysis.assert_not_called()

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_rejeita_imagem_acima_de_10_mb(self, mock_analysis):
        conteudo = base64.b64encode(
            b"x" * (10 * 1024 * 1024 + 1)
        ).decode("utf-8")

        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": f"data:image/png;base64,{conteudo}"
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        mock_analysis.assert_not_called()

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_rejeita_criacao_de_analise_sem_autenticacao(
        self,
        mock_analysis
    ):
        self.client.force_authenticate(user=None)

        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": self.criar_data_uri("PNG")
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

        mock_analysis.assert_not_called()

    @patch("analysis.views.PlantAnalysisService.analisys")
    def test_usa_usuario_autenticado_e_ignora_user_id_enviado(
        self,
        mock_analysis
    ):
        mock_analysis.return_value = {
            "message": "Análise realizada"
        }

        outro_usuario = User.objects.create(
            name="Outro Usuario",
            phone="+5588999999998",
            password_hash="hash_teste",
            is_admin=False,
            status=1
        )

        response = self.client.post(
            reverse("analysis-list"),
            {
                "image": self.criar_data_uri("PNG"),
                "userId": outro_usuario.id
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        mock_analysis.assert_called_once()

        dto_utilizado = mock_analysis.call_args.args[0]

        self.assertEqual(
            dto_utilizado.user_id,
            self.user.id
        )

        self.assertNotEqual(
            dto_utilizado.user_id,
            outro_usuario.id
        )
