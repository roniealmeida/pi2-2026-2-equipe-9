from dataclasses import dataclass
from typing import List


@dataclass
class PlantAnalysisResult:
    CommonName: str
    ScientificName: str
    SusceptibleAnimalSpecies: List[str]
    HumanRisks: str
    Description: str
    CommonSymptoms: List[str]
    RecommendedActions: List[str]
    ConfidenceScore: int

    @classmethod
    def from_dict(cls, data):
        return cls(**data)