from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers

from users.dtos.update_user_dto import UpdateUserDTO
from users.models.user_model import User


class UpdateUserSerializer(serializers.Serializer):
    """Serializer para atualização de dados cadastrais do usuário."""
    
    user_id = serializers.IntegerField(
        required=True,
        help_text="ID do usuário a ser atualizado"
    )
    
    name = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=False,
        help_text="Nome completo do usuário"
    )

    phone = PhoneNumberField(
        region="BR",
        required=False,
        help_text="Telefone do usuário no formato brasileiro (Ex: +55 11 99999-9999)"
    )

    farm_name = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=False,
        help_text="Nome da fazenda"
    )

    state = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=False,
        help_text="Estado onde a fazenda está localizada"
    )

    location = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=False,
        help_text="Localização/endereço da fazenda"
    )

    municipality = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=False,
        help_text="Município onde a fazenda está localizada"
    )

    def validate(self, data):
        """Valida se o telefone já não está registrado para outro usuário."""
        phone = data.get("phone")
        user_id = data.get("user_id")
        
        if phone and user_id and User.objects.filter(phone=str(phone)).exclude(id=user_id).exists():
            raise serializers.ValidationError(
                {
                    "phone": "Este telefone já está registrado para outro usuário."
                }
            )
        
        return data

    def to_dto(self) -> UpdateUserDTO:
        """Converte os dados validados em um DTO."""
        validated_data = self.validated_data
        
        return UpdateUserDTO(
            user_id=validated_data.get("user_id"),
            name=validated_data.get("name"),
            phone=str(validated_data.get("phone")) if validated_data.get("phone") else None,
            farm_name=validated_data.get("farm_name"),
            state=validated_data.get("state"),
            location=validated_data.get("location"),
            municipality=validated_data.get("municipality"),
        )
