from dataclasses import dataclass


@dataclass
class FarmDTO:
    name: str
    state: str
    location: str
    municipality: str