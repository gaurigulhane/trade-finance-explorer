from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.api.v1.endpoints import auth, documents, transactions, analytics
from backend.db.base import Base # Import models to ensure tables are created
from backend.db.session import engine
from backend.models import users, documents as doc_models, transactions as trans_models, risk as risk_models # Ensure models are registered

# Create tables
Base.metadata.create_all(bind=engine)

from backend.core.integrity import start_integrity_checker
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    start_integrity_checker()
    yield
    # Shutdown
    pass

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# CORS Config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(documents.router, prefix=f"{settings.API_V1_STR}/documents", tags=["documents"])
app.include_router(transactions.router, prefix=f"{settings.API_V1_STR}/transactions", tags=["transactions"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"])

@app.get("/")
def read_root():
    return {"message": "Trade Finance Explorer API is running"}
