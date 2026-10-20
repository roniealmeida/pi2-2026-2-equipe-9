
from django.test import TransactionTestCase
from django.db import IntegrityError, transaction
from django.utils import timezone

from analysis.models.search_request_model import SearchRequest
from analysis.models.search_error_log_model import SearchErrorLog
from users.models.user_model import User


class UniqueConstraintTests(TransactionTestCase):

    def setUp(self):
        self.user = User.objects.create(
            name="Usuario Teste Unicidade",
            phone="11987654321",
            password_hash="hash_teste",
        )

        self.search_request = SearchRequest.objects.create(
            user=self.user,
            image="teste.jpg",
        )

    def test_criar_log_de_erro_com_requisicao_unica(self):
        log = SearchErrorLog.objects.create(
            search_request=self.search_request,
            request_date=timezone.now(),
            status_code=500,
            error_type=SearchErrorLog.ERROR_INTERNAL_ERROR,
            error_description="Erro de teste",
            error_response="Resposta de teste",
        )

        self.assertEqual(
            log.search_request_id,
            self.search_request.id,
        )

    def test_banco_rejeita_dois_logs_para_mesma_requisicao(self):
        SearchErrorLog.objects.create(
            search_request=self.search_request,
            request_date=timezone.now(),
            status_code=500,
            error_type=SearchErrorLog.ERROR_INTERNAL_ERROR,
            error_description="Primeiro erro",
            error_response="Primeira resposta",
        )

        with self.assertRaises(IntegrityError) as erro:
            with transaction.atomic():
                SearchErrorLog.objects.create(
                    search_request=self.search_request,
                    request_date=timezone.now(),
                    status_code=500,
                    error_type=SearchErrorLog.ERROR_TIMEOUT,
                    error_description="Segundo erro",
                    error_response="Segunda resposta",
                )

        print(f"\nErro de duplicidade retornado pelo banco: {erro.exception}")
