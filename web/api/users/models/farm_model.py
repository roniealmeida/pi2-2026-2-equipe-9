from django.db import models

from users.models.user_model import User

class Farm(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="farms"
    )

    name = models.CharField(max_length=150)
    state = models.CharField(max_length=150, null=True, blank=True)
    location = models.CharField(max_length=150)
    municipality = models.CharField(max_length=150)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "Farms"