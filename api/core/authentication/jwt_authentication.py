from decouple import config

from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

import jwt

from users.models.user_model import User



class JwtAuthentication(BaseAuthentication):

    def authenticate(self, request):

        auth_header = request.headers.get(
            "Authorization"
        )

        if not auth_header:
            return None

        if not auth_header.startswith(
            "Bearer "
        ):
            raise AuthenticationFailed(
                "Token inválido."
            )

        token = auth_header[7:]

        try:

            payload = jwt.decode(
                token,
                config("JWT_SECRET_KEY"),
                algorithms=["HS256"]
            )

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed(
                "Token expirado."
            )

        except jwt.InvalidTokenError:
            raise AuthenticationFailed(
                "Token inválido."
            )

        user = User.objects.filter(
            id=payload["sub"]
        ).first()

        if user is None:
            raise AuthenticationFailed(
                "Usuário não encontrado."
            )

        return (
            user,
            token
        )