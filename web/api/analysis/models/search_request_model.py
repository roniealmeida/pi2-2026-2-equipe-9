from django.db import models
from users.models.user_model import User


class SearchRequest(models.Model):

    RESULT_COMPLETE = 0
    RESULT_PARTIAL = 1
    RESULT_NOT_FOUND = 3
    RESULT_ERROR = 4

    STATUS_PENDING = 0
    STATUS_PROCESSING = 1
    STATUS_COMPLETED = 3
    STATUS_FAILED = 4

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="search_requests"
    )

    image = models.ImageField(
        upload_to="analysis/"
    )

    result_type = models.IntegerField(
        null=True,
        blank=True
    )

    status = models.IntegerField(
        default=STATUS_PENDING
    )

    api_status_code = models.IntegerField(
        null=True,
        blank=True
    )

    request_date = models.DateTimeField(
        auto_now_add=True
    )

    finished_at = models.DateTimeField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "SearchRequests"