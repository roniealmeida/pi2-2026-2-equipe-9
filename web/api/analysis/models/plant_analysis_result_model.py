from django.db import models
from .search_request_model import SearchRequest


class PlantAnalysisResult(models.Model):
    search_request = models.ForeignKey(
        SearchRequest,
        on_delete=models.CASCADE,
        related_name="results"
    )

    common_name = models.CharField(max_length=100)

    scientific_name = models.CharField(
        max_length=100
    )

    susceptible_animal_species = models.TextField()

    description = models.TextField(null=True, blank=True, default=None)

    human_risks = models.TextField()

    common_symptoms = models.TextField()

    recommended_actions = models.TextField()

    confidence_score = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "PlantAnalysisResults"