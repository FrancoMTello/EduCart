from pydantic import BaseModel

# Lo que recibe la API para crear un producto
class ProductCreate(BaseModel):
    sku: str
    name: str
    image_url: str = ""
    price: float
    color: str = ""
    category: str
    rating: float = 0.0
    stock_actual: int = 0
    stock_minimo: int = 0
    description: str = ""

# Lo que devuelve la API al leer un producto
class ProductRead(BaseModel):
    id: int
    sku: str
    name: str
    image_url: str
    price: float
    color: str
    category: str
    rating: float
    stock_actual: int
    stock_minimo: int
    description: str

    class Config:
        from_attributes = True