from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from backend.db.base import Base
from sqlalchemy.sql import func

class RiskScore(Base):
    __tablename__ = "riskscores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Numeric(5, 2)) # 0.00 to 100.00
    rationale = Column(Text)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User")

class AuditLog(Base):
    __tablename__ = "auditlogs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Could be system (null) or user
    action = Column(Text)
    target_type = Column(String) # 'document', 'transaction', 'user'
    target_id = Column(Integer)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
