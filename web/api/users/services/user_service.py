from datetime import UTC, datetime, timedelta

import jwt
from decouple import config
from django.contrib.auth.hashers import check_password, make_password
from django.db import transaction
from rest_framework.exceptions import ParseError

from users.dtos.login_dto import LoginDto
from users.dtos.register_user_dto import RegisterUserDTO
from users.dtos.update_user_dto import UpdateUserDTO
from users.models.farm_model import Farm
from users.models.user_model import User, UserStatus


class UserService:

    @staticmethod
    @transaction.atomic
    def create_user(dto: RegisterUserDTO):

        if User.objects.filter(phone=dto.phone).exists():
            raise ParseError("Telefone já existe")

        user = User.objects.create(
            name=dto.name,
            phone=dto.phone,
            password_hash=make_password(dto.password),
            is_admin=False,
            status=UserStatus.ACTIVE
        )

        farm = Farm.objects.create(
            user=user,
            name=dto.farm.name,
            state=dto.farm.state,
            location=dto.farm.location,
            municipality=dto.farm.municipality
        )

        return {
            "user": {
                "id": user.id,
                "name": user.name,
                "phone": user.phone,
                "is_admin": user.is_admin,
                "status": user.status,
                "farm": {
                    "name": farm.name,
                    "state": farm.state,
                    "location": farm.location,
                    "municipality": farm.municipality
                } if farm else None
            }
        }

    @staticmethod
    def login(dto: LoginDto):

        user = User.objects.filter(phone=dto.phone).first()

        if not user:
            raise ParseError("Telefone ou Senha incorretos")

        if not check_password(dto.password, user.password_hash):
            raise ParseError("Telefone ou Senha incorretos")

        farm = Farm.objects.filter(user=user).first()

        expiration = datetime.now(UTC) + timedelta(hours=24)

        token = jwt.encode(
            {
                "sub": str(user.id),
                "phone": user.phone,
                "exp": expiration
            },
            config("JWT_SECRET_KEY"),
            algorithm="HS256"
        )

        return {
            "token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "phone": user.phone,
                "is_admin": user.is_admin,
                "status": user.status,
                "farm": {
                    "name": farm.name,
                    "state": farm.state,
                    "location": farm.location,
                    "municipality": farm.municipality
                } if farm else None
            }
        }

    @staticmethod
    @transaction.atomic
    def create_admin(dto):

        if User.objects.filter(phone=dto.phone).exists():
            raise ParseError("Telefone já existe")

        requester = User.objects.filter(
            id=dto.requested_by
        ).first()

        if not requester:
            raise ParseError("Usuário solicitante não encontrado")

        if not requester.is_admin:
            raise ParseError(
                "Apenas administradores podem criar administradores"
            )

        user = User.objects.create(
            name=dto.name,
            phone=dto.phone,
            password_hash=make_password(dto.password),
            is_admin=True,
            status=UserStatus.ACTIVE
        )

        return {
            "user": {
                "id": user.id,
                "name": user.name,
                "phone": user.phone,
                "is_admin": user.is_admin,
                "status": user.status,
                "farm": None
            }
        }

    @staticmethod
    def list_admins(requested_by):

        requester = User.objects.filter(
            id=requested_by
        ).first()

        if not requester:
            raise ParseError(
                "Usuário solicitante não encontrado"
            )

        if not requester.is_admin:
            raise ParseError(
                "Apenas administradores podem realizar esta operação"
            )

        admins = User.objects.filter(
            is_admin=True
        )

        return [
            {
                "id": admin.id,
                "name": admin.name,
                "phone": admin.phone,
                "status": admin.status
            }
            for admin in admins
        ]

    @staticmethod
    def list_users(requested_by):

        requester = User.objects.filter(
            id=requested_by
        ).first()

        if not requester:
            raise ParseError(
                "Usuário solicitante não encontrado"
            )

        if not requester.is_admin:
            raise ParseError(
                "Apenas administradores podem realizar esta operação"
            )

        users = User.objects.filter(
            is_admin=False
        )

        return [
            {
                "id": user.id,
                "name": user.name,
                "phone": user.phone,
                "status": user.status
            }
            for user in users
        ]

    @staticmethod
    @transaction.atomic
    def change_status(dto):

        requester = User.objects.filter(
            id=dto.requested_by
        ).first()

        if not requester:
            raise ParseError(
                "Usuário solicitante não encontrado"
            )

        if not requester.is_admin:
            raise ParseError(
                "Apenas administradores podem alterar status"
            )

        user = User.objects.filter(
            id=dto.user_id
        ).first()

        if not user:
            raise ParseError(
                "Usuário não encontrado"
            )

        if dto.status not in [
            UserStatus.INACTIVE,
            UserStatus.ACTIVE,
            UserStatus.BLOCKED
        ]:
            raise ParseError(
                "Status inválido"
            )

        if user.status == dto.status:
            raise ParseError(
                "O usuário já possui este status"
            )

        user.status = dto.status
        user.save()

        return {
            "message": "Status atualizado com sucesso."
        }

    @staticmethod
    @transaction.atomic
    def update_user(dto: UpdateUserDTO):

        user = User.objects.filter(id=dto.user_id).first()

        if not user:
            raise ParseError("Usuário não encontrado")

        if dto.name:
            user.name = dto.name

        if dto.phone:
            user.phone = dto.phone

        user.save(update_fields=["name", "phone"])

        farm = Farm.objects.filter(user=user).first()

        if farm:
            if dto.farm_name:
                farm.name = dto.farm_name

            if dto.state:
                farm.state = dto.state

            if dto.location:
                farm.location = dto.location

            if dto.municipality:
                farm.municipality = dto.municipality

            farm.save(update_fields=["name", "state", "location", "municipality"])

        return {
            "message": "Dados cadastrais atualizados com sucesso.",
            "user": {
                "id": user.id,
                "name": user.name,
                "phone": user.phone,
                "is_admin": user.is_admin,
                "status": user.status,
                "farm": {
                    "name": farm.name,
                    "state": farm.state,
                    "location": farm.location,
                    "municipality": farm.municipality
                } if farm else None
            }
        }