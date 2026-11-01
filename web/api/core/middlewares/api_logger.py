import logging
import json
import time

logger = logging.getLogger("api_logger")


class APILoggerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()

        # ===== REQUEST LOG =====
        try:
            body = ""
        except Exception:
            body = "<unreadable>"

        logger.info(f"""
REQUEST
Method: {request.method}
Path: {request.path}
Body: {body}
User: {getattr(request, 'user', None)}
""")

        # Processa request
        response = self.get_response(request)

        # ===== RESPONSE LOG =====
        duration = time.time() - start_time

        # tenta logar resposta (cuidado com grandes payloads)
        try:
            if hasattr(response, "content"):
                content = response.content.decode("utf-8")
            else:
                content = str(response)
        except Exception:
            content = "<unreadable>"

        logger.info(f"""
RESPONSE
Status: {response.status_code}
Duration: {duration:.2f}s
Response: {content[:1000]}
""")

        return response