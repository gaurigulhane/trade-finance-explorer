import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Trade Finance Explorer"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey_change_me_in_prod")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    # Default to localhost postgres if not set
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./trade_finance.db")
    ALGORITHM: str = "HS256"

    class Config:
        case_sensitive = True

settings = Settings()
