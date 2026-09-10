from sqlmodel import SQLModel, create_engine, Session

# SQLite guarda todo en un archivo local
DATABASE_URL = "sqlite:///./educart.db"

# El motor de la base de datos
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # necesario para SQLite
)

def create_tables():
    """Crea todas las tablas definidas en los modelos"""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Devuelve una sesión de base de datos — se usa en los endpoints"""
    with Session(engine) as session:
        yield session