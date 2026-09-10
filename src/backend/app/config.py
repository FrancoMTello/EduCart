from pydantic_settings import BaseSettings



class Settings(BaseSettings):
    # Clave secreta para firmar los tokens — en producción va en .env
    SECRET_KEY: str = "educart-secret-key-cambiar-en-produccion"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 4

settings = Settings()