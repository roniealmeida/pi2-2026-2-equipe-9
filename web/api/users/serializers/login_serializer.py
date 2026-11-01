from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers

from users.dtos.login_dto import LoginDto


class LoginSerializer(serializers.Serializer):
    """
    Serializer para autenticação de usuários.
    """
    phone = PhoneNumberField(
        region="BR",
        required=True,
        help_text="Telefone do usuário no formato brasileiro (Ex: +55 11 99999-9999)"
    )

    password = serializers.CharField(
        write_only=True,
        min_length=6,
        required=True,
        help_text="Senha do usuário (mínimo 6 caracteres)"
    )

    def to_dto(self):
        return LoginDto(
            phone=self.validated_data.get("phone"),
            password=self.validated_data.get("password")
        )