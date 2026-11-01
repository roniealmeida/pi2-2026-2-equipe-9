from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers

from users.dtos.register_admin_dto import RegisterAdminDTO


class RegisterAdminSerializer(serializers.Serializer):

    requested_by = serializers.IntegerField(required=True)

    name = serializers.CharField(
        max_length=150,
        required=True
    )

    phone = PhoneNumberField(
        region="BR",
        required=True
    )

    password = serializers.CharField(
        write_only=True,
        min_length=6,
        required=True
    )

    confirm_password = serializers.CharField(
        write_only=True,
        required=True
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

        return RegisterAdminDTO(
            requested_by=self.validated_data["requested_by"],
            name=self.validated_data["name"],
            phone=str(self.validated_data["phone"]),
            password=self.validated_data["password"]
        )