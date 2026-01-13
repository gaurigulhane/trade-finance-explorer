from sqlalchemy import Column, Integer, String, Enum, DateTime, func
from backend.db.base import Base
import enum

class UserRole(str, enum.Enum):
    BANK = "bank"
    CORPORATE = "corporate"
    AUDITOR = "auditor"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.CORPORATE)
    org_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
