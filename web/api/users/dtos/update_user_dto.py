from dataclasses import dataclass
from typing import Optional


@dataclass
class UpdateUserDTO:
    user_id: int
    name: Optional[str] = None
    phone: Optional[str] = None
    farm_name: Optional[str] = None
    state: Optional[str] = None
    location: Optional[str] = None
    municipality: Optional[str] = None
