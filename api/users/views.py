
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
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
        if self.action in ["login", "create"]:
            return [AllowAny()]

        return [IsAuthenticated()]

    @extend_schema(
        summary="Fazer Login",
        description="Autentica um usuário com telefone e senha.",
        request=LoginSerializer,
        responses={
            200: LoginResponseSerializer,
            400: {"description": "Dados inválidos"},
            401: {"description": "Telefone ou senha incorretos"}
        }
    )
    @action(detail=False, methods=["post"])
    def login(self, request):

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

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

        serializer = RegisterUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

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
            400: {"description": "Dados inválidos"},
            403: {"description": "Acesso negado"}
        }
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="admins"
    )
    def create_admin(self, request):

        serializer = RegisterAdminSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        dto = serializer.to_dto()

        if dto.requested_by != request.user.id:
            return Response(
                {"message": "Você não tem permissão para realizar esta operação."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not request.user.is_admin:
            return Response(
                {"message": "Apenas administradores podem criar administradores."},
                status=status.HTTP_403_FORBIDDEN
            )

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

        requested_by = request.query_params.get("requested_by")

        if not requested_by:
            return Response(
                {"message": "requested_by é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if str(requested_by) != str(request.user.id):
            return Response(
                {"message": "Você não tem permissão para realizar esta operação."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not request.user.is_admin:
            return Response(
                {"message": "Apenas administradores podem realizar esta operação."},
                status=status.HTTP_403_FORBIDDEN
            )

        result = UserService.list_admins(requested_by)

        return Response(
            result,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Listar Usuários"
    )
    def list(self, request):

        requested_by = request.query_params.get("requested_by")

        if not requested_by:
            return Response(
                {"message": "requested_by é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if str(requested_by) != str(request.user.id):
            return Response(
                {"message": "Você não tem permissão para realizar esta operação."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not request.user.is_admin:
            return Response(
                {"message": "Apenas administradores podem realizar esta operação."},
                status=status.HTTP_403_FORBIDDEN
            )

        result = UserService.list_users(requested_by)

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

        serializer = ChangeStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        dto = serializer.to_dto()

        if dto.requested_by != request.user.id:
            return Response(
                {"message": "Você não tem permissão para realizar esta operação."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not request.user.is_admin:
            return Response(
                {"message": "Apenas administradores podem realizar esta operação."},
                status=status.HTTP_403_FORBIDDEN
            )

        result = UserService.change_status(dto)

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
            403: {"description": "Acesso negado"},
            404: {"description": "Usuário não encontrado"}
        }
    )
    @action(
        detail=False,
        methods=["patch"],
        url_path="profile"
    )
    @action(detail=False, methods=["patch"], url_path="profile")
    def update_profile(self, request):
        """
        Atualiza os dados cadastrais do usuário autenticado.
        """

        serializer = UpdateUserSerializer(
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)

        dto = serializer.to_dto()

        if dto.user_id is None:
            return Response(
                {"message": "user_id é obrigatório."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if str(dto.user_id) != str(request.user.id):
            return Response(
                {"message": "Você não tem permissão para alterar este perfil."},
                status=status.HTTP_403_FORBIDDEN
            )

        result = UserService.update_user(dto)

        return Response(
            result,
            status=status.HTTP_200_OK
        )