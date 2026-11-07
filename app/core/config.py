import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "AIVOA.AI Quality Intelligence Engine"
    API_V1_STR: str = "/api"
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/aivoa_quality")
    DEFAULT_MODEL: str = "llama-3.3-70b-versatile"

settings = Settings()
