
from django.test import TransactionTestCase
from django.db import IntegrityError, transaction

from users.models.user_model import User
from users.models.farm_model import Farm


class ForeignKeyTests(TransactionTestCase):

    def setUp(self):
        self.user = User.objects.create(
            name="Usuario Teste FK",
            phone="11987654321",
            password_hash="hash_teste",
        )

    def test_fazenda_com_usuario_existente(self):
        farm = Farm.objects.create(
            user=self.user,
            name="Fazenda Teste",
            state="CE",
            location="Local de teste",
            municipality="Municipio de teste",
        )

        self.assertEqual(farm.user_id, self.user.id)
        self.assertTrue(
            Farm.objects.filter(id=farm.id, user=self.user).exists()
        )


    def test_banco_rejeita_usuario_inexistente(self):
        with self.assertRaises(IntegrityError) as erro:
            with transaction.atomic():
                Farm.objects.create(
                    user_id=999999999,
                    name="Fazenda Invalida",
                    state="CE",
                    location="Local de teste",
                    municipality="Municipio de teste",
                )

        print(f"\nMensagem de erro do banco: {erro.exception}")

