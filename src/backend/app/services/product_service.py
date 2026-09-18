from sqlmodel import Session
from app.repositories import product_repository
from app.schemas.product import ProductCreate
from app.models.product import Product
from fastapi import HTTPException

def get_all(session: Session) -> list[Product]:
    """Devuelve todos los productos"""
    return product_repository.get_all(session)

def get_by_id(session: Session, product_id: int) -> Product:
    """Devuelve un producto por id — tira 404 si no existe"""
    product = product_repository.get_by_id(session, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

def create(session: Session, data: ProductCreate) -> Product:
    """Crea un producto nuevo"""
    return product_repository.create(session, data)

def update(session: Session, product_id: int, data: dict) -> Product:
    # 1. Busca el producto por ID
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Producto no encontrado"
        )
    
    # 2. Actualiza dinámicamente solo los campos enviados (ej: price, stock_actual)
    for key, value in data.items():
        if hasattr(product, key) and value is not None:
            setattr(product, key, value)
            
    # 3. Guarda cambios en DB
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

def delete(session: Session, product_id: int) -> None:
    """Elimina un producto — tira 404 si no existe"""
    product = get_by_id(session, product_id)
    product_repository.delete(session, product)