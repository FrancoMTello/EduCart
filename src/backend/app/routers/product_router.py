# app/routers/product_router.py
from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.core.database import get_session
# Cambiá 'from app.security' por la ruta donde creaste el archivo (ej: app.core.security)
from app.core.security import require_admin  
from app.services import product_service
from app.schemas.product import ProductCreate, ProductRead

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=list[ProductRead])
def get_all(session: Session = Depends(get_session)):
    return product_service.get_all(session)

@router.get("/{product_id}", response_model=ProductRead)
def get_by_id(product_id: int, session: Session = Depends(get_session)):
    return product_service.get_by_id(session, product_id)

@router.post("/", response_model=ProductRead, status_code=201)
def create( 
    data: ProductCreate,
    session: Session = Depends(get_session),
    _: dict = Depends(require_admin)
):
    return product_service.create(session, data)

@router.patch("/{product_id}", response_model=ProductRead)
def update(
    product_id: int,
    data: dict,
    session: Session = Depends(get_session),
    _: dict = Depends(require_admin)
):
    return product_service.update(session, product_id, data)

@router.delete("/{product_id}", status_code=204)
def delete(
    product_id: int,
    session: Session = Depends(get_session),
    _: dict = Depends(require_admin)
):
    product_service.delete(session, product_id)