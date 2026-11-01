from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from users.serializers.change_status_serializer import ChangeStatusSerializer
from users.serializers.login_serializer import LoginSerializer
from users.serializers.register_admin_serializer import RegisterAdminSerializer
from users.serializers.register_user_serializer import RegisterUserSerializer
from users.serializers.update_user_serializer import UpdateUserSerializer
from users.serializers.response_serializers import (
    LoginResponseSerializer,
    RegisterUserResponseSerializer
)
from users.services.user_service import UserService


class UserViewSet(viewsets.ViewSet):
    """
    API de Usuários

    Endpoints para autenticação e gerenciamento de usuários.
    """

    def get_permissions(self):

        if self.action in [
            "login",
            "create"
        ]:
            return [AllowAny()]

        return super().get_permissions()

    @extend_schema(
        summary="Fazer Login",
        description="Autentica um usuário com telefone e senha.",
        request=LoginSerializer,
        responses={
            200: LoginResponseSerializer,
            400: {"description": "Dados inválidos"}
        }
    )
    @action(detail=False, methods=["post"])
    def login(self, request):

        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        dto = serializer.to_dto()

        result = UserService.login(dto)

        return Response(
            result,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Registrar Novo Usuário",
        description="Cria uma nova conta de usuário.",
        request=RegisterUserSerializer,
        responses={
            201: RegisterUserResponseSerializer,
            400: {"description": "Dados inválidos"}
        }
    )
    def create(self, request):

        serializer = RegisterUserSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        dto = serializer.to_dto()

        result = UserService.create_user(dto)

        return Response(
            result,
            status=status.HTTP_201_CREATED
        )

    @extend_schema(
        summary="Registrar Administrador",
        description="Cria um novo administrador.",
        request=RegisterAdminSerializer,
        responses={
            201: RegisterUserResponseSerializer,
            400: {"description": "Dados inválidos"}
        }
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="admins"
    )
    def create_admin(self, request):

        serializer = RegisterAdminSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        dto = serializer.to_dto()

        result = UserService.create_admin(dto)

        return Response(
            result,
            status=status.HTTP_201_CREATED
        )

    @extend_schema(
        summary="Listar Administradores"
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="admins/list"
    )
    def list_admins(self, request):

        requested_by = request.query_params.get(
            "requested_by"
        )

        result = UserService.list_admins(
            requested_by
        )

        return Response(
            result,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Listar Usuários"
    )
    def list(self, request):

        requested_by = request.query_params.get(
            "requested_by"
        )

        result = UserService.list_users(
            requested_by
        )

        return Response(
            result,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Alterar Status do Usuário",
        request=ChangeStatusSerializer
    )
    @action(
        detail=False,
        methods=["patch"],
        url_path="status"
    )
    def change_status(self, request):

        serializer = ChangeStatusSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        dto = serializer.to_dto()

        result = UserService.change_status(
            dto
        )

        return Response(
            result,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Atualizar Dados Cadastrais",
        description="Atualiza os dados de perfil e fazenda do usuário autenticado.",
        request=UpdateUserSerializer,
        responses={
            200: RegisterUserResponseSerializer,
            400: {"description": "Dados inválidos"},
            404: {"description": "Usuário não encontrado"}
        }
    )
    @action(
        detail=False,
        methods=["patch"],
        url_path="profile"
    )
    def update_profile(self, request):
        """
        Atualiza os dados cadastrais do usuário.
        
        Permite atualização parcial ou completa de:
        - Nome do usuário
        - Telefone
        - Nome da fazenda
        - Estado
        - Localidade
        - Município
        
        Parâmetro obrigatório: user_id (no body da requisição)
        """
        serializer = UpdateUserSerializer(
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)

        dto = serializer.to_dto()

        result = UserService.update_user(dto)

        return Response(
            result,
            status=status.HTTP_200_OK
        )