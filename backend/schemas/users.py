from pydantic import BaseModel, EmailStr
from typing import Optional
from backend.models.users import UserRole

class UserBase(BaseModel):
    email: EmailStr
    name: str
    org_name: Optional[str] = None
    role: UserRole = UserRole.CORPORATE

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
