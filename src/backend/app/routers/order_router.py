from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.core.database import get_session
from app.security import get_current_user, require_admin
from app.services import order_service
from app.schemas.order import OrderCreate, OrderRead

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=OrderRead, status_code=201)
def create(
    data: OrderCreate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    """Crea una orden — requiere estar logueado"""
    user_id = int(current_user["sub"])
    return order_service.create(session, data, user_id)

@router.get("/my-orders", response_model=list[OrderRead])
def get_my_orders(
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    """Trae las órdenes del usuario logueado"""
    user_id = int(current_user["sub"])
    return order_service.get_by_user(session, user_id)

@router.get("/", response_model=list[OrderRead])
def get_all(
    session: Session = Depends(get_session),
    _: dict = Depends(require_admin)
):
    """Trae todas las órdenes — solo ADMIN"""
    return order_service.get_all(session)