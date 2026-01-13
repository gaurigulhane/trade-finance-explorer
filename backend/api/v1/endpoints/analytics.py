from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy.orm import Session
import os
import json
from datetime import datetime
from backend.db.session import get_db
from backend.models.users import User
from backend.models.documents import Document, LedgerEntry
from backend.models.transactions import TradeTransaction, TransactionStatus
from backend.models.risk import RiskScore, AuditLog
from backend.schemas.analytics import DashboardStats
from backend.api.v1.endpoints.documents import get_current_user

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Calculate stats
    doc_count = db.query(Document).filter(Document.owner_id == current_user.id).count()
    
    trade_count = db.query(TradeTransaction).filter(
        ((TradeTransaction.buyer_id == current_user.id) | (TradeTransaction.seller_id == current_user.id)) &
        (TradeTransaction.status != TransactionStatus.COMPLETED)
    ).count()

    # Risk Score (Mock logic if not exists)
    risk_entry = db.query(RiskScore).filter(RiskScore.user_id == current_user.id).first()
    if not risk_entry:
        # Create a default "Safe" score
        risk_entry = RiskScore(user_id=current_user.id, score=15.0, rationale="New account, low history.")
        db.add(risk_entry)
        db.commit()
        db.refresh(risk_entry)
    
    # Recent activity from Ledger
    # Get last 5 ledger actions on user's documents
    user_docs = db.query(Document.id).filter(Document.owner_id == current_user.id).all()
    doc_ids = [d.id for d in user_docs]
    
    recent_logs = []
    if doc_ids:
        entries = db.query(LedgerEntry).filter(LedgerEntry.document_id.in_(doc_ids)).order_by(LedgerEntry.created_at.desc()).limit(5).all()
        for e in entries:
            recent_logs.append(f"{e.action} on Doc #{e.document_id} at {e.created_at.strftime('%Y-%m-%d %H:%M')}")

    return DashboardStats(
        total_documents=doc_count,
        active_trades=trade_count,
        risk_score=float(risk_entry.score),
        recent_activity=recent_logs
    )

@router.get("/export")
def export_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Generate a simple text report
    report_lines = [
        f"TRADE FINANCE EXPLORER - COMPLIANCE REPORT",
        f"Generated: {datetime.now().isoformat()}",
        f"User: {current_user.email} ({current_user.role.value})",
        f"Organization: {current_user.org_name or 'N/A'}",
        "-" * 40,
        f"DOCUMENTS:",
    ]
    
    docs = db.query(Document).filter(Document.owner_id == current_user.id).all()
    for d in docs:
        report_lines.append(f"- {d.doc_type} #{d.doc_number} (Issued: {d.issued_at}) [Hash: {d.hash[:10]}...]")

    report_lines.append("-" * 40)
    report_lines.append("TRADES:")
    trades = db.query(TradeTransaction).filter((TradeTransaction.buyer_id == current_user.id) | (TradeTransaction.seller_id == current_user.id)).all()
    for t in trades:
        report_lines.append(f"- Deal #{t.id}: {t.currency} {t.amount} [{t.status}]")

    report_content = "\n".join(report_lines)
    
    # Save to temp file
    filename = f"report_{current_user.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.txt"
    filepath = f"backend/storage/{filename}" # re-using storage for simplicity
    with open(filepath, "w") as f:
        f.write(report_content)
        
    return FileResponse(filepath, media_type='text/plain', filename=filename)
