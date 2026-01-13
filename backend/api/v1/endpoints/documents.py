import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.users import User
from backend.models.documents import Document, LedgerEntry, DocType, LedgerAction
from backend.schemas.documents import DocumentResponse
from backend.core.security import settings
from backend.core.hashing import get_file_hash
from backend.api.v1.endpoints.auth import create_access_token # You might need a current_user dep here
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from starlette import status

router = APIRouter()

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

STORAGE_DIR = "backend/storage"

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    doc_type: DocType = Form(...),
    doc_number: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Read file content
    content = await file.read()
    
    # 2. Compute Hash
    file_hash = get_file_hash(content)
    
    # Check if duplicate hash exists (simulating uniqueness check)
    # existing_doc = db.query(Document).filter(Document.hash == file_hash).first()
    # if existing_doc:
    #     raise HTTPException(400, "Document with this hash already exists")

    # 3. Save file locally (Simulating S3)
    file_path = os.path.join(STORAGE_DIR, f"{file_hash}_{file.filename}")
    with open(file_path, "wb") as f:
        f.write(content)
    
    file_url = f"/storage/{file_hash}_{file.filename}" # Logic to serve this later

    # 4. Create Document Record
    new_doc = Document(
        owner_id=current_user.id,
        doc_type=doc_type,
        doc_number=doc_number,
        file_url=file_url,
        hash=file_hash
    )
    db.add(new_doc)
    db.flush() # get ID

    # 5. Create Ledger Entry
    ledger_entry = LedgerEntry(
        document_id=new_doc.id,
        action=LedgerAction.ISSUED,
        actor_id=current_user.id,
        details={"filename": file.filename, "size": len(content)}
    )
    db.add(ledger_entry)
    
    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.get("/", response_model=List[DocumentResponse])
def get_documents(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Retrieve documents visible to user (for now, own documents + if bank/auditor maybe all? Let's keep it simple: own)
    # Actually, for a blockchain explorer, usually data is public-ish or authorized.
    # Let's say: Bank/Auditor see all, Corporate sees own.
    
    query = db.query(Document)
    if current_user.role == "corporate":
        query = query.filter(Document.owner_id == current_user.id)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{doc_id}", response_model=DocumentResponse)
def get_document_detail(
    doc_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Access control check
    if current_user.role == "corporate" and doc.owner_id != current_user.id:
         raise HTTPException(status_code=403, detail="Not authorized to view this document")
         
    return doc
