
import base64
import binascii
from io import BytesIO

from PIL import Image, UnidentifiedImageError
from rest_framework import serializers

from analysis.dtos.analisys_dto import AnalysisDto


class AnalysisSerializer(serializers.Serializer):
    """Serializer para análise de imagens de plantas."""

    MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB
    MIN_IMAGE_DIMENSION = 300
    ALLOWED_MIME_TYPES = {
        "image/jpeg",
        "image/png",
    }

    image = serializers.CharField(
        required=True,
        allow_blank=False,
        help_text="Imagem JPG ou PNG em formato Base64 Data URI"
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

        header, base64_content = value.split(",", 1)
        mime_type = header.replace("data:", "").replace(";base64", "")

        if mime_type not in self.ALLOWED_MIME_TYPES:
            raise serializers.ValidationError(
                "A imagem deve estar no formato JPG ou PNG."
            )

        try:
            image_bytes = base64.b64decode(
                base64_content,
                validate=True
            )
        except (binascii.Error, ValueError):
            raise serializers.ValidationError(
                "O conteúdo Base64 da imagem é inválido."
            )

        if len(image_bytes) > self.MAX_IMAGE_SIZE:
            raise serializers.ValidationError(
                "A imagem não pode ultrapassar 10 MB."
            )

        try:
            with Image.open(BytesIO(image_bytes)) as img:
                if img.format not in ("JPEG", "PNG"):
                    raise serializers.ValidationError(
                        "O conteúdo deve ser uma imagem JPG ou PNG."
                    )

                width, height = img.size
                img.verify()

        except serializers.ValidationError:
            raise
        except (UnidentifiedImageError, OSError, ValueError):
            raise serializers.ValidationError(
                "Não foi possível ler a imagem enviada."
            )

        if width < self.MIN_IMAGE_DIMENSION or height < self.MIN_IMAGE_DIMENSION:
            raise serializers.ValidationError(
                "A imagem deve ter resolução mínima de 300x300 pixels."
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
