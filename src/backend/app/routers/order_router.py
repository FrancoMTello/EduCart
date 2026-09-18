# app/routers/order_router.py
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from app.core.database import get_session
from app.core.security import require_admin
from app.models.order import Order
from app.schemas.order import OrderRead

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/", response_model=List[OrderRead])
def get_all_orders(
    session: Session = Depends(get_session),
    _: dict = Depends(require_admin)
):
    """Obtiene el historial de todas las órdenes con sus ítems (Solo ADMIN)"""
    # SQLModel carga automáticamente la relación `items` si está definida en el modelo y esquema
    orders = session.exec(select(Order).order_by(Order.created_at.desc())).all()
    return orders