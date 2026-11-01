from dataclasses import dataclass

from users.dtos.farm_dto import FarmDTO

@dataclass
class RegisterUserDTO:
    name: str
    phone: str
    password: str
    farm: FarmDTO