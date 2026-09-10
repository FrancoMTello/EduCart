# app/routers/product_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.core.database import get_session
from app.core.security import require_admin
from app.models.product import Product
from app.schemas.product import ProductUpdate, ProductRead  # O usa un diccionario/schema parcial

router = APIRouter(prefix="/products", tags=["Products"])

@router.patch("/{product_id}", response_model=ProductRead)
def update_product_admin(
    product_id: int,
    product_data: dict,  # O tu esquema ProductUpdate
    session: Session = Depends(get_session),
    _: dict = Depends(require_admin)
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Actualiza solo los campos enviados (ej: stock_actual, price)
    for key, value in product_data.items():
        if hasattr(product, key) and value is not None:
            setattr(product, key, value)
            
    session.add(product)
    session.commit()
    session.refresh(product)
    return product