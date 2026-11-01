from dataclasses import dataclass


@dataclass
class LoginDto:
    phone: str
    password: str