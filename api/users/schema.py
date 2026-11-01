
from drf_spectacular.extensions import OpenApiAuthenticationExtension


class JwtAuthenticationScheme(OpenApiAuthenticationExtension):
    target_class = "core.authentication.jwt_authentication.JwtAuthentication"
    name = "BearerAuth"

    def get_security_definition(self, auto_schema):
        return {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
