from dataclasses import dataclass


@dataclass
class AnalysisDto:
    base64: str
    mime_type: str
    extension: str
    user_id: int