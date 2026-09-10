from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.core.database import get_session
from app.services import auth_service
from app.schemas.user import UserRegister, UserLogin, AuthSession

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=AuthSession, status_code=201)
def register(data: UserRegister, session: Session = Depends(get_session)):
    """Registra un usuario nuevo y devuelve la sesión"""
    return auth_service.register(session, data)

@router.post("/login", response_model=AuthSession)
def login(data: UserLogin, session: Session = Depends(get_session)):
    """Valida credenciales y devuelve la sesión"""
    return auth_service.login(session, data)