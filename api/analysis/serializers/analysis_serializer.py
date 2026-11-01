from rest_framework import serializers

from analysis.dtos.analisys_dto import AnalysisDto

class AnalysisSerializer(serializers.Serializer):
    """Serializer para análise de imagens de plantas."""
    image = serializers.CharField(
        required=True,
        allow_blank=False,
        help_text="Imagem em formato Base64 Data URI (Ex: data:image/jpeg;base64,...)"
    )
    userId = serializers.IntegerField(
        required=True,
        help_text="ID do usuário que está fazendo a análise"
    )
    
    def validate_image(self, value: str):
        if not value.startswith("data:image/"):
            raise serializers.ValidationError(
                "A imagem deve estar no formato Base64 Data URI."
            )

        if ";base64," not in value:
            raise serializers.ValidationError(
                "Formato Base64 inválido."
            )

        return value

    def to_dto(self) -> AnalysisDto:
        image = self.validated_data["image"]

        header, base64_content = image.split(",", 1)

        mime_type = (
            header
            .replace("data:", "")
            .replace(";base64", "")
        )

        extension = mime_type.split("/")[-1]

        return AnalysisDto(
            base64=base64_content,
            mime_type=mime_type,
            extension=extension,
            user_id=self.validated_data["userId"]
        )