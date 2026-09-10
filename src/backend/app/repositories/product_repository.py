from sqlmodel import Session, select
from app.models.product import Product
from app.schemas.product import ProductCreate

def get_all(session: Session) -> list[Product]:
    """Trae todos los productos"""
    return session.exec(select(Product)).all()

def get_by_id(session: Session, product_id: int) -> Product | None:
    """Trae un producto por id — devuelve None si no existe"""
    return session.get(Product, product_id)

def create(session: Session, data: ProductCreate) -> Product:
    """Crea un producto nuevo"""
    product = Product(**data.model_dump())
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

def update(session: Session, product: Product, data: dict) -> Product:
    """Actualiza un producto existente"""
    for key, value in data.items():
        setattr(product, key, value)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

def delete(session: Session, product: Product) -> None:
    """Elimina un producto"""
    session.delete(product)
    session.commit()