from sqlmodel import SQLModel, Field
from typing import Optional

class Product(SQLModel, table=True):
    """Tabla de productos en la base de datos"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    sku: str = Field(unique=True, index=True)
    name: str
    image_url: str = ""
    price: float
    color: str = ""
    category: str
    rating: float = 0.0
    stock_actual: int = 0
    stock_minimo: int = 0
    description: str = ""