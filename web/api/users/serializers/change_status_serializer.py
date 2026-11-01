from rest_framework import serializers

from users.dtos.change_status_dto import ChangeStatusDTO


class ChangeStatusSerializer(serializers.Serializer):

    requested_by = serializers.IntegerField()

    user_id = serializers.IntegerField()

    status = serializers.IntegerField()

    def to_dto(self):

        return ChangeStatusDTO(
            requested_by=self.validated_data["requested_by"],
            user_id=self.validated_data["user_id"],
            status=self.validated_data["status"]
        )