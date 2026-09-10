from sqlmodel import Session, select
from app.models.user import User
from app.schemas.user import UserRegister

def get_by_email(session: Session, email: str) -> User | None:
    """Busca un usuario por email"""
    return session.exec(
        select(User).where(User.email == email.lower())
    ).first()

def get_by_id(session: Session, user_id: int) -> User | None:
    """Busca un usuario por id"""
    return session.get(User, user_id)

def create(session: Session, data: UserRegister) -> User:
    """Crea un usuario nuevo"""
    user = User(
        email=data.email.strip().lower(),
        first_name=data.first_name.strip(),
        last_name=data.last_name.strip(),
        password=data.password,
        role="ADMIN" if "admin" in data.email.lower() else "CLIENT"
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user