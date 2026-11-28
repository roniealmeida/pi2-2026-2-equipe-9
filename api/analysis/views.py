
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from rest_framework.permissions import IsAuthenticated
from users.models.user_model import UserStatus

from analysis.models import SearchRequest, TechnicalReview
from analysis.serializers.technical_review_serializer import (
    TechnicalReviewSerializer,
)
from analysis.serializers.analysis_serializer import AnalysisSerializer
from analysis.serializers.response_serializers import (
    AnalysisCreateResponseSerializer,
    AnalysisHistoryItemSerializer,
    AnalysisDetailResponseSerializer,
    AllAnalysisItemSerializer,
)
from analysis.services.plant_analisys_service import PlantAnalysisService


class PlantAnalysisViewSet(viewsets.ViewSet):
    """
    API de Análise de Plantas.

    Endpoints para análise de imagens de plantas e histórico de análises.
    """

    def _is_approved_technician(self, user):
        return (
            user.role == "tecnico"
            and user.approval_status == "aprovado"
            and user.status == UserStatus.ACTIVE
        )

    def get_permissions(self):
        if self.action in [
            "create",
            "list",
            "retrieve",
            "all_analysis",
            "pending",
            "review",
        ]:
            return [IsAuthenticated()]

        return super().get_permissions()

    @extend_schema(
        summary="Criar Análise de Planta",
        description=(
            "Realiza análise de uma imagem de planta "
            "e retorna diagnóstico com base em IA."
        ),
        request=AnalysisSerializer,
        responses={
            200: AnalysisCreateResponseSerializer,
            400: {
                "description": (
                    "Dados inválidos ou imagem em formato inválido"
                )
            },
        },
    )
    def create(self, request):
        """
        Analisa uma imagem de planta.
        Aceita imagem em formato Base64 Data URI.
        """
        serializer = AnalysisSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        dto = serializer.to_dto(user_id=request.user.id)
        result = PlantAnalysisService.analisys(dto)

        return Response(
            result,
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        summary="Listar Histórico de Análises",
        description=(
            "Retorna todas as análises completamente identificadas "
            "realizadas por um usuário. Inclui informações da imagem "
            "e o primeiro resultado de análise de cada busca."
        ),
        parameters=[
            OpenApiParameter(
                name="userId",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                required=True,
                description="ID do usuário proprietário das análises",
            ),
        ],
        responses={
            200: AnalysisHistoryItemSerializer(many=True),
            400: {"description": "userId não fornecido ou inválido"},
            404: {"description": "Usuário não encontrado"},
        },
    )
    def list(self, request):
        """
        Lista histórico de análises de um usuário.
        """
        user_id = request.query_params.get("userId")

        if not user_id:
            return Response(
                {"message": "userId é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_id = int(user_id)
        except (TypeError, ValueError):
            return Response(
                {
                    "message": (
                        "userId deve ser um número inteiro válido"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user_id != request.user.id:
            return Response(
                {
                    "message": (
                        "Você não tem permissão para consultar este histórico."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        result = PlantAnalysisService.get_history(
            user_id,
            request=request,
        )

        return Response(
            result,
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        summary="Obter Detalhes de Análise",
        description=(
            "Retorna detalhes completos de uma análise específica."
        ),
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                required=True,
                description="ID da análise",
            ),
            OpenApiParameter(
                name="userId",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                required=True,
                description="ID do usuário",
            ),
        ],
        responses={
            200: AnalysisDetailResponseSerializer,
            400: {
                "description": (
                    "Identificador não fornecido ou inválido"
                )
            },
            404: {
                "description": (
                    "Usuário ou análise não encontrada"
                )
            },
        },
    )
    def retrieve(self, request, pk=None):
        """
        Obtém detalhes de uma análise específica.
        """
        user_id = request.query_params.get("userId")

        if not user_id:
            return Response(
                {"message": "userId é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            search_request_id = int(pk)
            user_id = int(user_id)
        except (TypeError, ValueError):
            return Response(
                {
                    "message": (
                        "Os identificadores devem ser números inteiros válidos"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user_id != request.user.id:
            return Response(
                {
                    "message": (
                        "Você não tem permissão para consultar esta análise."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        result = PlantAnalysisService.get_details(
            search_request_id,
            user_id,
            request=request,
        )

        return Response(
            result,
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        summary="Listar Todas as Análises",
        description=(
            "Retorna todas as análises de todos os usuários (sucesso e erro). "
            "Para análises bem-sucedidas, retorna o nome da primeira planta "
            "identificada. Para análises com erro, retorna a descrição do erro. "
            "Apenas administradores podem acessar."
        ),
        parameters=[
            OpenApiParameter(
                name="requested_by",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                required=True,
                description=(
                    "ID do usuário solicitante (deve ser administrador)"
                ),
            ),
        ],
        responses={
            200: AllAnalysisItemSerializer(many=True),
            400: {
                "description": (
                    "Parâmetro requested_by não fornecido ou inválido"
                )
            },
            403: {
                "description": (
                    "Usuário solicitante não é administrador"
                )
            },
            404: {
                "description": (
                    "Usuário solicitante não encontrado"
                )
            },
        },
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="all-analysis",
    )
    def all_analysis(self, request):
        """
        Lista todas as análises de todos os usuários.
        """
        requested_by = request.query_params.get("requested_by")

        if not requested_by:
            return Response(
                {"message": "requested_by é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            requested_by = int(requested_by)
        except (TypeError, ValueError):
            return Response(
                {
                    "message": (
                        "requested_by deve ser um número inteiro válido"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if requested_by != request.user.id:
            return Response(
                {
                    "message": (
                        "Você não tem permissão para realizar esta operação."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if not request.user.is_admin:
            return Response(
                {
                    "message": (
                        "Apenas administradores podem realizar esta operação."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        result = PlantAnalysisService.get_all_analysis(requested_by)

        return Response(
            result,
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        summary="Listar análises pendentes de revisão técnica",
        description="Lista análises concluídas que ainda não foram revisadas.",
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="pending",
    )
    def pending(self, request):
        if not self._is_approved_technician(request.user):
            return Response(
                {
                    "message": (
                        "Apenas técnicos aprovados podem acessar esta fila."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        analyses = (
            SearchRequest.objects.filter(
                status=SearchRequest.STATUS_COMPLETED,
                result_type__in=[
                    SearchRequest.RESULT_COMPLETE,
                    SearchRequest.RESULT_PARTIAL,
                ],
                results__isnull=False,
            )
            .exclude(technical_review__isnull=False)
            .select_related("user")
            .prefetch_related("results")
            .order_by("-request_date")
            .distinct()
        )

        response_data = []

        for analysis in analyses:
            result = analysis.results.first()

            if result is None:
                continue

            response_data.append({
                "id": analysis.id,
                "produtorNome": analysis.user.name,
                "fazendaNome": "",
                "dataEnvio": analysis.request_date.isoformat(),
                "especieIa": result.common_name,
                "confiancaIa": float(result.confidence_score),
                "status": "Pendente",
                "imagemUrl": PlantAnalysisService._build_media_url(
                    analysis.image,
                    request=request,
                ),
            })

        return Response(
            response_data,
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        summary="Registrar revisão técnica de análise",
        request=TechnicalReviewSerializer,
        responses={
            200: {"description": "Revisão registrada com sucesso."}
        },
    )
    @action(
        detail=True,
        methods=["patch"],
        url_path="review",
    )
    def review(self, request, pk=None):
        if not self._is_approved_technician(request.user):
            return Response(
                {
                    "message": (
                        "Apenas técnicos aprovados podem revisar análises."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = TechnicalReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        analysis = SearchRequest.objects.filter(
            pk=pk,
            status=SearchRequest.STATUS_COMPLETED,
            result_type__in=[
                SearchRequest.RESULT_COMPLETE,
                SearchRequest.RESULT_PARTIAL,
            ],
        ).first()

        if analysis is None:
            return Response(
                {
                    "message": (
                        "Análise não encontrada ou não concluída."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        original_result = analysis.results.first()

        if original_result is None:
            return Response(
                {
                    "message": (
                        "Análise não possui resultado para revisão."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if TechnicalReview.objects.filter(
            search_request=analysis
        ).exists():
            return Response(
                {
                    "message": "Esta análise já possui uma revisão técnica."
                },
                status=status.HTTP_409_CONFLICT,
            )

        corrected = serializer.validated_data["corrigidoPeloTecnico"]
        final_species = serializer.validated_data.get("especieFinal")
        opinion = serializer.validated_data["parecerTecnico"]

        TechnicalReview.objects.create(
            search_request=analysis,
            technician=request.user,
            final_species=final_species if corrected else None,
            technical_opinion=opinion,
            was_corrected=corrected,
        )

        return Response(
            {
                "message": "Revisão técnica registrada com sucesso.",
                "analysis_id": analysis.id,
                "status": (
                    "Corrigido pelo Técnico"
                    if corrected
                    else "Confirmado pelo Técnico"
                ),
                "especieFinal": (
                    final_species
                    if corrected
                    else original_result.common_name
                ),
                "corrigidoPeloTecnico": corrected,
            },
            status=status.HTTP_200_OK,
        )
