from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
from backend.models.documents import DocType, LedgerAction

class LedgerEntryBase(BaseModel):
    action: LedgerAction
    details: Optional[dict] = {}

class LedgerEntryResponse(LedgerEntryBase):
    id: int
    actor_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class DocumentBase(BaseModel):
    doc_type: DocType
    doc_number: str

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: int
    owner_id: int
    file_url: str
    hash: str
    issued_at: datetime
    created_at: datetime
    ledger_entries: List[LedgerEntryResponse] = []

    class Config:
        from_attributes = True
