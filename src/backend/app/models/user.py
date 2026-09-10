from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    """Tabla de usuarios en la base de datos"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    first_name: str
    last_name: str
    password: str  # en producción iría hasheada
    role: str = Field(default="CLIENT")  # CLIENT o ADMIN