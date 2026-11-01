from dataclasses import dataclass
import json
from typing import List
from .plant_analysis_result import PlantAnalysisResult

@dataclass
class PlantAnalysisResponse:
    ResultType: int
    ResponseContent: str
    ErrorMessage: str
    AnalysisResults: List[PlantAnalysisResult]

    @classmethod
    def from_json(cls, json_text: str):
        data = json.loads(json_text)

        results = [
            PlantAnalysisResult.from_dict(item)
            for item in data["AnalysisResults"]
        ]

        return cls(
            ResponseContent=json_text,
            ResultType=data["ResultType"],
            ErrorMessage=data["ErrorMessage"],
            AnalysisResults=results
        )