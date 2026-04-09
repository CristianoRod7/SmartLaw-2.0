from google import genai
from app.core.config import settings

api_key = getattr(settings, "GEMINI_API_KEY", None) or getattr(settings, "GOOGLE_API_KEY", None)
client = genai.Client(api_key=api_key)

for model in client.models.list():
    print(model.name)