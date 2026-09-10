from pydantic import BaseModel
from datetime import datetime

# Lo que recibe la API para crear una orden
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: list[OrderItemCreate]

# Lo que devuelve la API
class OrderItemRead(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_price: float
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True

class OrderRead(BaseModel):
    id: int
    user_id: int
    status: str
    total: float
    created_at: datetime
    items: list[OrderItemRead]

    class Config:
        from_attributes = True