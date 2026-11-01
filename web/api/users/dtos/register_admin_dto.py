from dataclasses import dataclass

@dataclass
class RegisterAdminDTO:
    requested_by: int
    name: str
    phone: str
    password: str