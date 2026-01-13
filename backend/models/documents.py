from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from backend.db.base import Base
import enum

class DocType(str, enum.Enum):
    LOC = 'LOC'
    INVOICE = 'INVOICE'
    BILL_OF_LADING = 'BILL_OF_LADING'
    PO = 'PO'
    COO = 'COO'
    INSURANCE_CERT = 'INSURANCE_CERT'

class LedgerAction(str, enum.Enum):
    ISSUED = 'ISSUED'
    AMENDED = 'AMENDED'
    SHIPPED = 'SHIPPED'
    RECEIVED = 'RECEIVED'
    PAID = 'PAID'
    CANCELLED = 'CANCELLED'
    VERIFIED = 'VERIFIED'

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    doc_type = Column(Enum(DocType))
    doc_number = Column(String)
    file_url = Column(String)
    hash = Column(String, index=True)
    issued_at = Column(DateTime(timezone=True), default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", backref="documents")
    ledger_entries = relationship("LedgerEntry", back_populates="document", cascade="all, delete-orphan")

class LedgerEntry(Base):
    __tablename__ = "ledger_entries"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    action = Column(Enum(LedgerAction))
    actor_id = Column(Integer, ForeignKey("users.id"))
    details = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("Document", back_populates="ledger_entries")
    actor = relationship("User")
