from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from backend.models.transactions import TransactionStatus
from backend.schemas.users import UserResponse

class TransactionBase(BaseModel):
    amount: float
    currency: str
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    seller_email: str

class TransactionResponse(TransactionBase):
    id: int
    buyer_id: int
    seller_id: int
    status: TransactionStatus
    created_at: datetime
    buyer: Optional[UserResponse] = None
    seller: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class TransactionUpdateStatus(BaseModel):
    status: TransactionStatus
