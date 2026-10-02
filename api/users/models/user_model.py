from django.db import models

class UserStatus(models.IntegerChoices):
    INACTIVE = 0, "Inativo"
    ACTIVE = 1, "Ativo"
    BLOCKED = 2, "Bloqueado"


class UserRole(models.TextChoices):
    SUPERADMIN = "SUPERADMIN", "Superadministrador"
    FARM_MANAGER = "FARM_MANAGER", "Gestor da Fazenda"
    OPERATIONAL = "OPERATIONAL", "Usuário Operacional"


class User(models.Model):
    id = models.BigAutoField(primary_key=True)

    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, unique=True)
    password_hash = models.CharField(max_length=255)

    is_admin = models.BooleanField(default=False)

    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.OPERATIONAL,
        help_text="Nível de acesso do usuário no sistema"
    )

    status = models.PositiveSmallIntegerField(
        choices=UserStatus.choices,
        default=UserStatus.ACTIVE
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "Users"