from django.db import models

class UserStatus(models.IntegerChoices):
    INACTIVE = 0, "Inativo"
    ACTIVE = 1, "Ativo"
    BLOCKED = 2, "Bloqueado"


class User(models.Model):
    id = models.BigAutoField(primary_key=True)

    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    password_hash = models.CharField(max_length=255)

    is_admin = models.BooleanField(default=False)

    status = models.PositiveSmallIntegerField(
        choices=UserStatus.choices,
        default=UserStatus.ACTIVE
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "Users"