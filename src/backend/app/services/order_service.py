from sqlmodel import Session
from app.repositories import order_repository
from app.schemas.order import OrderCreate, OrderRead

def create(session: Session, data: OrderCreate, user_id: int) -> OrderRead:
    """Crea una orden nueva"""
    return order_repository.create(session, data, user_id)

def get_by_user(session: Session, user_id: int) -> list[OrderRead]:
    """Trae las órdenes de un usuario"""
    return order_repository.get_by_user(session, user_id)

def get_all(session: Session) -> list[OrderRead]:
    """Trae todas las órdenes — solo ADMIN"""
    return order_repository.get_all(session)