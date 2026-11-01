import base64
from dataclasses import asdict
from datetime import datetime
import uuid

from analysis.dtos.analisys_dto import AnalysisDto
from django.conf import settings
from django.core.files.base import ContentFile

from django.db import transaction
from analysis.models.plant_analysis_result_model import PlantAnalysisResult
from analysis.models.search_error_log_model import SearchErrorLog
from analysis.models.search_request_model import SearchRequest
from decouple import config
from core.ai.gemini_service import GeminiService
from core.ai.openia_service import GPTService
from core.ai.responses.plant_analysis_response import PlantAnalysisResponse
from users.models.user_model import User
from rest_framework.exceptions import NotFound
from django.db.models import Prefetch

class PlantAnalysisService:

    @transaction.atomic
    def analisys(dto : AnalysisDto):

        user = User.objects.filter(id=dto.user_id).first()

        if not user:
            raise NotFound("Usuário não encontrado")

        file_name = f"{uuid.uuid4()}.{dto.extension}"

        image_content = ContentFile(
            base64.b64decode(dto.base64),
            name=file_name
        )

        search_request = SearchRequest.objects.create(
            user=user,
            status=SearchRequest.STATUS_PROCESSING,
            request_date=datetime.now()
        )

        search_request.image.save(
            file_name,
            image_content,
            save=True
        )

        result = None
        if(config("USE_OPENAI", default=False, cast=bool)):
            result : PlantAnalysisResponse = GPTService.analyse_image(
                dto.base64,
                dto.mime_type
            )
        else:
            result : PlantAnalysisResponse = GeminiService.analyse_image(
                dto.base64,
                dto.mime_type
            )

        try:
            if result.ResultType in [SearchRequest.RESULT_COMPLETE, SearchRequest.RESULT_PARTIAL]:
                search_request.api_status_code = 200
                search_request.result_type = result.ResultType
                search_request.status = SearchRequest.STATUS_COMPLETED
                search_request.finished_at = datetime.now()

                search_request.save(
                    update_fields=[
                        "api_status_code",
                        "status",
                        "result_type",
                        "finished_at"
                    ]
                )

                for analysis_result in result.AnalysisResults:
                    plant_analisis_result = PlantAnalysisResult.objects.create(
                        search_request=search_request,
                        common_name =analysis_result.CommonName,
                        scientific_name=analysis_result.ScientificName,
                        description=analysis_result.Description,
                        susceptible_animal_species=";".join(analysis_result.SusceptibleAnimalSpecies if analysis_result.SusceptibleAnimalSpecies else []),
                        human_risks=analysis_result.HumanRisks,
                        common_symptoms=";".join(analysis_result.CommonSymptoms if analysis_result.CommonSymptoms else []),
                        recommended_actions=";".join(analysis_result.RecommendedActions if analysis_result.RecommendedActions else []),
                        confidence_score=analysis_result.ConfidenceScore
                    )

                    plant_analisis_result.save()
            else:
                search_request.status = SearchRequest.STATUS_FAILED
                search_request.api_status_code = 200
                search_request.result_type = result.ResultType
                search_request.finished_at = datetime.now()

                search_request.save(
                    update_fields=[
                        "status",
                        "api_status_code",
                        "result_type",
                        "finished_at"
                    ]
                )

                SearchErrorLog.objects.create(
                    search_request=search_request,
                    request_date=search_request.request_date,
                    status_code=200,
                    error_type=SearchErrorLog.ERROR_NOT_IDENTIFIED if result.ResultType == SearchRequest.RESULT_NOT_FOUND else SearchErrorLog.ERROR_INTERNAL_ERROR,
                    error_description=result.ErrorMessage,
                    error_response=result.ResponseContent
                )

            return {
                "search_request_id": search_request.id,
                "result_type": search_request.result_type,
                "analysis_results": [
                    asdict(item)
                    for item in result.AnalysisResults
                ] if result.AnalysisResults else [],
                "error_message": result.ErrorMessage 
            }

        except Exception as ex:

            search_request.status = SearchRequest.STATUS_FAILED
            search_request.api_status_code = 500
            search_request.finished_at = datetime.now()

            search_request.save(
                update_fields=[
                    "status",
                    "api_status_code",
                    "finished_at"
                ]
            )

            SearchErrorLog.objects.create(
                search_request=search_request,
                request_date=search_request.request_date,
                status_code=500,
                error_type=SearchErrorLog.ERROR_INTERNAL_ERROR,
                error_description=str(ex),
                error_response=result.ResponseContent
            )

            return {
                "search_request_id": search_request.id,
                "result_type": search_request.result_type,
                "error_message": "Houve um erro no processamento da imagem, por favor tente novamente mais tarde."
            }

        
    @staticmethod
    def _build_media_url(image_field, request=None):
        if not image_field:
            return None

        image_url = image_field.url

        return image_url

    @staticmethod
    def get_details(search_request_id, user_id, request=None):
        """
        Obtém detalhes completos de uma análise específica.
        
        Args:
            search_request_id: ID da requisição de análise
            user_id: ID do usuário proprietário da análise
            
        Returns:
            Dict: Detalhes da análise com estrutura:
                {
                    "search_request_id": int,
                    "result_type": str,
                    "status": str,
                    "image": str (URL),
                    "analysis_results": List[Dict]
                }
                
        Raises:
            NotFound: Quando o usuário ou análise não existe
        """
        user = User.objects.filter(id=user_id).first()
    
        if not user:
            raise NotFound("Usuário não encontrado")
    
        search_request = SearchRequest.objects.filter(
            id=search_request_id,
            user_id=user_id
        ).first()
    
        if not search_request:
            raise NotFound("Análise não encontrada")
    
        return {
            "search_request_id": search_request.id,
            "result_type": search_request.result_type,
            "status": search_request.status,
            "image": PlantAnalysisService._build_media_url(search_request.image, request=request),
            "analysis_results": [
                {
                    "id": result.id,
                    "common_name": result.common_name,
                    "scientific_name": result.scientific_name,
                    "susceptible_animal_species": result.susceptible_animal_species.split(";") if result.susceptible_animal_species else [],
                    "human_risks": result.human_risks,
                    "description": result.description,
                    "common_symptoms": result.common_symptoms.split(";") if result.common_symptoms else [],
                    "recommended_actions": result.recommended_actions.split(";") if result.recommended_actions else [],
                    "confidence_score": float(result.confidence_score)
                }
                for result in search_request.results.all()
            ]
        }

    @staticmethod
    def get_history(user_id, request=None):
        """
        Obtém o histórico de análises completadas de um usuário.
        
        Args:
            user_id: ID do usuário
            
        Returns:
            List[Dict]: Lista de análises com estrutura:
                {
                    "search_request_id": int,
                    "status": str,
                    "result_type": str,
                    "request_date": datetime,
                    "finished_at": datetime,
                    "image": str (URL),
                    "analysis_result": {
                        "common_name": str,
                        "Description": str
                    } | None
                }
                
        Raises:
            NotFound: Quando o usuário não existe
        """

        user = User.objects.filter(id=user_id).first()

        if not user:
            raise NotFound("Usuário não encontrado")

        requests = SearchRequest.objects.filter(
            user=user,
            result_type=SearchRequest.RESULT_COMPLETE
        ).prefetch_related(
            Prefetch(
                "results",
                queryset=PlantAnalysisResult.objects.order_by("id"),
                to_attr="first_result"
            )
        ).order_by("-request_date")

        return [
            {
                "search_request_id": request_obj.id,
                "status": request_obj.status,
                "result_type": request_obj.result_type,
                "request_date": request_obj.request_date,
                "finished_at": request_obj.finished_at,
                "image": PlantAnalysisService._build_media_url(request_obj.image, request=request),
                "analysis_result": (
                    {
                        "common_name": request_obj.first_result[0].common_name,
                        "Description": request_obj.first_result[0].description,
                    }
                    if request_obj.first_result else None
                )
            }
            for request_obj in requests
        ]

    @staticmethod
    def get_all_analysis(requested_by):
        """
        Obtém todas as análises de todos os usuários (sucesso e erro).
        """

        requester = User.objects.filter(id=requested_by).first()

        if not requester:
            raise NotFound("Usuário solicitante não encontrado")

        if not requester.is_admin:
            raise NotFound("Apenas administradores podem realizar esta operação")

        requests = (
            SearchRequest.objects
            .prefetch_related(
                Prefetch(
                    "results",
                    queryset=PlantAnalysisResult.objects.order_by("id")
                )
            )
            .select_related("error_log")
            .order_by("-request_date")
        )

        response = []

        for search_request in requests:
            result = search_request.results.first()

            if result is not None:
                result_data = result.common_name
            elif hasattr(search_request, "error_log"):
                result_data = search_request.error_log.error_description
            else:
                result_data = None

            response.append({
                "search_request_id": search_request.id,
                "request_date": search_request.request_date,
                "status": search_request.status,
                "result": result_data,
            })

        return response
