from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DashboardStats(BaseModel):
    total_documents: int
    active_trades: int
    risk_score: float
    recent_activity: List[str]

class RiskReport(BaseModel):
    user_id: int
    score: float
    rationale: str
    generated_at: datetime
    compliance_status: str
