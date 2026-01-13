from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Numeric, Table
from sqlalchemy.orm import relationship, backref
from backend.db.base import Base
from sqlalchemy.sql import func
import enum

class TransactionStatus(str, enum.Enum):
    PENDING = 'pending'
    IN_PROGRESS = 'in_progress'
    COMPLETED = 'completed'
    DISPUTED = 'disputed'

# Association table for linking documents to transactions
transaction_documents = Table(
    'transaction_documents',
    Base.metadata,
    Column('transaction_id', Integer, ForeignKey('tradetransactions.id')),
    Column('document_id', Integer, ForeignKey('documents.id'))
)

class TradeTransaction(Base):
    __tablename__ = "tradetransactions"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"))
    seller_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Numeric(12, 2))
    currency = Column(String(3))
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    buyer = relationship("User", foreign_keys=[buyer_id])
    seller = relationship("User", foreign_keys=[seller_id])
    documents = relationship("Document", secondary=transaction_documents, backref="transactions")

