from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import create_tables
from app.routers import product_router, auth_router, order_router
import app.models
from app.routers import dashboard_router

app = FastAPI(title="EduCart API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_tables()

app.include_router(product_router.router)
app.include_router(auth_router.router)
app.include_router(order_router.router)
app.include_router(dashboard_router.router)

@app.get("/")
def root():
    return {"message": "EduCart API funcionando"}