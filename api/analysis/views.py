import logging
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from analysis.serializers.analysis_serializer import AnalysisSerializer
from analysis.serializers.response_serializers import (
    AnalysisCreateResponseSerializer,
    AnalysisHistoryItemSerializer,
    AnalysisDetailResponseSerializer,
    AllAnalysisItemSerializer
)
from analysis.services.plant_analisys_service import PlantAnalysisService

# Logger rastreabilidade no Docker
logger = logging.getLogger(__name__)

class PlantAnalysisViewSet(viewsets.ViewSet):
    """
    API de Análise de Plantas
    
    Endpoints para análise de imagens de plantas e histórico de análises.
    """

    @extend_schema(
        summary="Criar Análise de Planta",
        description="Realiza análise de uma imagem de planta e retorna diagnóstico com base em IA",
        request=AnalysisSerializer,
        responses={
            200: AnalysisCreateResponseSerializer,
            400: {"description": "Dados inválidos ou imagem em formato inválido"},
        }
    )
    def create(self, request):
        """
        Analisa uma imagem de planta de forma assíncrona/rastreável.
        """
        logger.info("[ANALYSIS_CREATE] Requisição de análise recebida.")
        
        serializer = AnalysisSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"[ANALYSIS_CREATE] Dados de formulário/imagem inválidos: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        dto = serializer.to_dto()
        
        try:
            # Rastreabilidade da execução
            logger.info("[ANALYSIS_CREATE] Iniciando processamento da imagem pela IA...")
            result = PlantAnalysisService.analisys(dto)
            logger.info("[ANALYSIS_CREATE] Análise concluída com sucesso.")
            
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"[ANALYSIS_CREATE] Erro no processamento da IA: {str(e)}", exc_info=True)
            return Response(
                {"error": "Falha interna ao processar imagem."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Listar Histórico de Análises",
        description="Retorna todas as análises completamente identificadas realizadas por um usuário.",
        parameters=[
            OpenApiParameter(
                name='userId',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                required=True,
                description='ID do usuário proprietário das análises'
            )
        ],
        responses={
            200: AnalysisHistoryItemSerializer(many=True),
            400: {"description": "userId não fornecido ou inválido"},
            404: {"description": "Usuário não encontrado"},
        }
    )
    def list(self, request):
        user_id = request.query_params.get("userId")
        logger.info(f"[ANALYSIS_LIST] Buscando histórico para o userId: {user_id}")

        if not user_id:
            logger.warning("[ANALYSIS_LIST] Tentativa de busca sem informar userId.")
            return Response(
                {"message": "userId é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = PlantAnalysisService.get_history(
            int(user_id),
            request=request
        )

        return Response(result, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Obter Detalhes de Análise",
        description="Retorna detalhes completos de uma análise específica",
        parameters=[
            OpenApiParameter(
                name='userId',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                required=True,
                description='ID do usuário'
            )
        ],
        responses={
            200: AnalysisDetailResponseSerializer,
            400: {"description": "userId não fornecido"},
            404: {"description": "Análise não encontrada"},
        }
    )
    def retrieve(self, request, pk=None):
        user_id = request.query_params.get("userId")
        logger.info(f"[ANALYSIS_RETRIEVE] Buscando detalhes da análise ID {pk} para o userId: {user_id}")

        if not user_id:
            logger.warning(f"[ANALYSIS_RETRIEVE] userId não informado para a análise ID {pk}.")
            return Response(
                {"message": "userId é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = PlantAnalysisService.get_details(
            int(pk),
            int(user_id),
            request=request
        )

        return Response(result, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Listar Todas as Análises",
        description="Retorna todas as análises de todos os usuários. Apenas administradores podem acessar.",
        parameters=[
            OpenApiParameter(
                name='requested_by',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                required=True,
                description='ID do usuário solicitante (deve ser administrador)'
            )
        ],
        responses={
            200: AllAnalysisItemSerializer(many=True),
            400: {"description": "Parâmetro requested_by não fornecido"},
            404: {"description": "Usuário solicitante não encontrado ou não é administrador"},
        }
    )
    @action(
        detail=False,
        methods=['get'],
        url_path='all-analysis'
    )
    def all_analysis(self, request):
        requested_by = request.query_params.get("requested_by")
        logger.info(f"[ANALYSIS_ALL] Solicitação de relatório global por requested_by: {requested_by}")

        if not requested_by:
            logger.warning("[ANALYSIS_ALL] Parâmetro requested_by ausente.")
            return Response(
                {"message": "requested_by é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = PlantAnalysisService.get_all_analysis(
            int(requested_by)
        )

        return Response(result, status=status.HTTP_200_OK)