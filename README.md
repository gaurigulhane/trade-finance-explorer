# Trade Finance Blockchain Explorer

A ledger-style explorer and risk insights platform for tracking trade finance artifacts.

## Tech Stack
- **Frontend**: React.js + Tailwind CSS (Vite)
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL (SQLAlchemy)
- **Authentication**: JWT (Access + Refresh)

## Setup Instructions

### Backend
1. Navigate to `trade-finance-explorer` root.
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Run server:
   ```bash
   uvicorn backend.main:app --reload
   ```
   Server will start at `http://localhost:8000`.

### Frontend
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
   App will start at `http://localhost:5173`.

## Milestones
- [x] Milestone 1: Auth & Org Setup
- [ ] Milestone 2: Documents & Ledger
- [ ] Milestone 3: Transactions & Integrity
- [ ] Milestone 4: Risk & Analytics
