from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers

from users.dtos.farm_dto import FarmDTO
from users.dtos.register_user_dto import RegisterUserDTO

from users.serializers.register_farm_serializer import (
    RegisterFarmSerializer
)


class RegisterUserSerializer(serializers.Serializer):
    """Serializer para registro de novos usuários."""
    name = serializers.CharField(
        max_length=150,
        required=True,
        help_text="Nome completo do usuário"
    )

    phone = PhoneNumberField(
        region="BR",
        required=True,
        help_text="Telefone do usuário no formato brasileiro (Ex: +55 11 99999-9999)"
    )

    password = serializers.CharField(
        write_only=True,
        min_length=6,
        required=True,
        help_text="Senha (mínimo 6 caracteres)"
    )

    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        help_text="Confirmação de senha (deve ser igual à senha)"
    )

    farm = RegisterFarmSerializer(
        required=True,
        help_text="Dados da fazenda do usuário"
    )

    def validate(self, data):

        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password":
                    "As senhas não coincidem."
                }
            )

        return data

    def to_dto(self):

        farm_data = self.validated_data["farm"]

        farm_dto = FarmDTO(
            name=farm_data["name"],
            state=farm_data["state"],
            location=farm_data["location"],
            municipality=farm_data["municipality"]
        )

        return RegisterUserDTO(
            name=self.validated_data["name"],
            phone=str(self.validated_data["phone"]),
            password=self.validated_data["password"],
            farm=farm_dto
        )