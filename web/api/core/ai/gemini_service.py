import base64

from google import genai
from google.genai import types
from decouple import config

from core.ai.prompt import PROMPT
from core.ai.responses.plant_analysis_response import PlantAnalysisResponse

class GeminiService:

    @staticmethod
    def analyse_image( image_data: str, mime_type: str) -> PlantAnalysisResponse:
        response = None

        try:
            image_bytes = base64.b64decode(image_data)
    
            client = genai.Client(api_key=config("GEMINI_API_KEY"))
    
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[
                    PROMPT,
                    types.Part.from_bytes(
                       data=image_bytes,
                       mime_type=mime_type
                    )
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
    
            result = PlantAnalysisResponse.from_json(response.text)
    
        except Exception as ex:
            print(ex)
            result = PlantAnalysisResponse(
                ResultType=4,
                ResponseContent=response.text if response else "",
                ErrorMessage=str(ex),
                AnalysisResults=[]
            )

        return result
    
