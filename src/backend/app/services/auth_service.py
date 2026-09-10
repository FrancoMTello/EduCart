from sqlmodel import Session
from fastapi import HTTPException
from app.repositories import user_repository
from app.schemas.user import UserRegister, UserLogin, AuthSession, UserRead
from app.models.user import User
from app.config import settings
import bcrypt
from jose import jwt
from datetime import datetime, timedelta



def hash_password(password: str) -> str:
    """Convierte el password a un hash seguro"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    """Verifica que el password coincida con el hash"""
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user: User) -> str:
    """Crea un JWT real firmado con la clave secreta"""
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        # El token expira en X horas según la configuración
        "exp": datetime.utcnow() + timedelta(hours=settings.ACCESS_TOKEN_EXPIRE_HOURS)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_session(user: User) -> AuthSession:
    """Arma el objeto de sesión con token y usuario público"""
    return AuthSession(
        token=create_token(user),
        user=UserRead(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            role=user.role
        )
    )

def register(session: Session, data: UserRegister) -> AuthSession:
    """Registra un usuario nuevo"""
    
    existing = user_repository.get_by_email(session, data.email)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Ya existe una cuenta con ese email."
        )
    data.password = hash_password(data.password)
    user = user_repository.create(session, data)
    return create_session(user)

def login(session: Session, data: UserLogin) -> AuthSession:
    """Valida credenciales y devuelve la sesión"""
    user = user_repository.get_by_email(session, data.email)

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=401,
            detail="Email o contraseña incorrectos."
        )

    return create_session(user)