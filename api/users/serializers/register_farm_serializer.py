from rest_framework import serializers

from users.dtos.farm_dto import FarmDTO

class RegisterFarmSerializer(serializers.Serializer):
    """Serializer para dados da fazenda."""
    name = serializers.CharField(
        max_length=150,
        required=True,
        help_text="Nome da fazenda"
    )

    state = serializers.CharField(
        max_length=150,
        required=True,
        help_text="Estado onde a fazenda está localizada"
    )

    location = serializers.CharField(
        max_length=150,
        required=True,
        help_text="Localização/endereço da fazenda"
    )

    municipality = serializers.CharField(
        max_length=150,
        required=True,
        help_text="Município onde a fazenda está localizada"
    )

    def to_dto(self):

        return FarmDTO(
            name=self.validated_data["name"],
            state=self.validated_data["state"],
            location=self.validated_data["location"],
            municipality=self.validated_data["municipality"]
        )