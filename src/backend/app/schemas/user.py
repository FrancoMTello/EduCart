from pydantic import BaseModel, EmailStr

# Lo que recibe la API para registrarse
class UserRegister(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str

# Lo que recibe la API para loguearse
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# El usuario público — sin password
class UserRead(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    role: str

    class Config:
        from_attributes = True

# La sesión que devuelve la API
class AuthSession(BaseModel):
    token: str
    user: UserRead