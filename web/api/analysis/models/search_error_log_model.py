from django.db import models
from .search_request_model import SearchRequest


class SearchErrorLog(models.Model):
    ERROR_API_UNAVAILABLE = 0
    ERROR_TIMEOUT = 1
    ERROR_INVALID_RESPONSE = 2
    ERROR_NOT_IDENTIFIED = 3
    ERROR_INTERNAL_ERROR = 4

    search_request = models.OneToOneField(
        SearchRequest,
        on_delete=models.CASCADE,
        related_name="error_log"
    )

    request_date = models.DateTimeField()

    status_code = models.IntegerField()

    error_type = models.IntegerField()

    error_description = models.TextField()

    error_response = models.TextField()

    class Meta:
        db_table = "SearchErrorLogs"