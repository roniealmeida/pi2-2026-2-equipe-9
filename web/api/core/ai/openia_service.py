import base64
from openai import OpenAI
from decouple import config

from core.ai.prompt import PROMPT
from core.ai.responses.plant_analysis_response import PlantAnalysisResponse


class GPTService:

    @staticmethod
    def analyse_image(image_data: str, mime_type: str) -> PlantAnalysisResponse:
        response = None

        try:
            client = OpenAI(api_key=config("OPENAI_API_KEY"))

            # GPT Vision usa data URL
            image_url = f"data:{mime_type};base64,{image_data}"

            response = client.responses.create(
                model="gpt-4.1-mini",
                input=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "input_text",
                                "text": PROMPT
                            },
                            {
                                "type": "input_image",
                                "image_url": image_url
                            }
                        ]
                    }
                ],
                text={
                    "format": {
                        "type": "json_object"
                    }
                }
            )

            result = PlantAnalysisResponse.from_json(response.output_text)

        except Exception as ex:
            print(ex)
            result = PlantAnalysisResponse(
                ResultType=4,
                ResponseContent=response.output_text if response else "",
                ErrorMessage=str(ex),
                AnalysisResults=[]
            )

        return result