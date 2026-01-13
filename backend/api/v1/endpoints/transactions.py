from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.db.session import get_db
from backend.models.users import User
from backend.models.transactions import TradeTransaction, TransactionStatus
from backend.schemas.transactions import TransactionCreate, TransactionResponse, TransactionUpdateStatus
from backend.api.v1.endpoints.documents import get_current_user

router = APIRouter()

@router.post("/", response_model=TransactionResponse)
def create_transaction(
    trans_in: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seller = db.query(User).filter(User.email == trans_in.seller_email).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller email not found")
    
    if seller.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot trade with yourself")

    transaction = TradeTransaction(
        buyer_id=current_user.id,
        seller_id=seller.id,
        amount=trans_in.amount,
        currency=trans_in.currency,
        description=trans_in.description,
        status=TransactionStatus.PENDING
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.get("/", response_model=List[TransactionResponse])
def get_transactions(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only show transactions where user is buyer or seller
    query = db.query(TradeTransaction).filter(
        or_(
            TradeTransaction.buyer_id == current_user.id,
            TradeTransaction.seller_id == current_user.id
        )
    )
    return query.offset(skip).limit(limit).all()

@router.put("/{trans_id}/status", response_model=TransactionResponse)
def update_status(
    trans_id: int,
    status_in: TransactionUpdateStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction = db.query(TradeTransaction).filter(TradeTransaction.id == trans_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    # Validation: Only involved parties can update? Or maybe logic depends on role.
    # For simplicity, either party can update status for now.
    if current_user.id not in [transaction.buyer_id, transaction.seller_id]:
        raise HTTPException(status_code=403, detail="Not authorized")

    transaction.status = status_in.status
    db.commit()
    db.refresh(transaction)
    return transaction
