from dataclasses import dataclass

@dataclass
class ChangeStatusDTO:
    requested_by: int
    user_id: int
    status: int