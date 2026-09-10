from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class OrderItem(SQLModel, table=True):
    """Cada producto dentro de una orden"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    product_id: int = Field(foreign_key="product.id")
    product_name: str       # guardamos el nombre por si el producto se borra
    product_price: float    # guardamos el precio al momento de la compra
    quantity: int
    subtotal: float         # price * quantity

    # Relación con la orden
    order: Optional["Order"] = Relationship(back_populates="items")

class Order(SQLModel, table=True):
    """La orden de compra"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    status: str = Field(default="PENDING")  # PENDING, COMPLETED, CANCELLED
    total: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relación con los items
    items: List[OrderItem] = Relationship(back_populates="order")