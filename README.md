# 🌐 Trade Finance Explorer

A blockchain-powered trade documentation platform built with React and FastAPI. This application provides secure document management, transaction tracking, and compliance reporting for international trade finance operations.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Corporate, Bank, Auditor)
- Secure password hashing with Argon2

### 📄 Document Management
- Upload and manage trade documents (Invoices, Letters of Credit, Bills of Lading, etc.)
- SHA-256 hash generation for document integrity verification
- Tamper-proof audit trail with blockchain-inspired ledger entries
- Document lifecycle tracking (Issued, Amended, Verified, etc.)

### 💼 Transaction Management
- Create and track trade transactions between buyers and sellers
- Multi-currency support (USD, EUR, GBP)
- Transaction status workflow (Pending → In Progress → Completed/Disputed)
- Real-time transaction visibility for all parties

### 📊 Analytics & Compliance
- Dashboard with key metrics (Total Documents, Active Trades, Risk Score)
- Risk assessment and scoring
- Compliance report generation and export
- Activity logging and audit trails

### 🎨 Modern UI/UX
- Professional blue/teal gradient theme
- Glassmorphism design elements
- Responsive layout for all devices
- Smooth transitions and animations

## 🛠️ Tech Stack

### Frontend
- **React** 18 with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Headless UI** for accessible components

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Database (easily switchable to PostgreSQL)
- **Pydantic** - Data validation
- **Python-JOSE** - JWT token handling
- **Passlib** with Argon2 - Password hashing

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to project directory:**
   ```bash
   cd trade-finance-explorer
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Run the backend server:**
   ```bash
   uvicorn backend.main:app --reload
   ```

   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📖 Usage

### 1. Register an Account
- Navigate to `http://localhost:5173/register`
- Create accounts for different roles:
  - **Corporate**: For buyers/sellers
  - **Bank**: For financial institutions
  - **Auditor**: For compliance officers

### 2. Login
- Use your credentials to access the dashboard
- JWT token is stored securely in localStorage

### 3. Upload Documents
- Go to Documents section
- Upload trade documents with metadata
- System generates SHA-256 hash for integrity
- Ledger entry automatically created

### 4. Create Transactions
- Navigate to Transactions
- Create new trade deal with counterparty email
- Specify amount, currency, and description
- Track transaction status

### 5. View Analytics
- Dashboard shows real-time metrics
- Download compliance reports
- Monitor risk scores

## 🔑 Sample Credentials

For testing purposes:

**Corporate User:**
- Email: `alice@example.com`
- Password: `password123`

**Bank User:**
- Email: `bob@bank.com`
- Password: `password123`

## 📁 Project Structure

```
trade-finance-explorer/
├── backend/
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/
│   │           ├── auth.py
│   │           ├── documents.py
│   │           ├── transactions.py
│   │           └── analytics.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── hashing.py
│   ├── db/
│   │   ├── base.py
│   │   └── session.py
│   ├── models/
│   │   ├── users.py
│   │   ├── documents.py
│   │   └── transactions.py
│   ├── schemas/
│   │   ├── users.py
│   │   ├── documents.py
│   │   └── transactions.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   └── LedgerTimeline.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Documents.jsx
│   │   │   └── Transactions.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔒 Security Features

- **Password Security**: Argon2 hashing algorithm
- **JWT Authentication**: Secure token-based auth with expiration
- **Document Integrity**: SHA-256 hashing for tamper detection
- **Role-Based Access**: Different permissions for different user types
- **Audit Trail**: Immutable ledger of all document actions

## 🌟 Key Highlights

- **Blockchain-Inspired**: Immutable audit trails and document hashing
- **Production-Ready**: Proper error handling, validation, and security
- **Scalable Architecture**: Clean separation of concerns, modular design
- **Modern Stack**: Latest versions of React, FastAPI, and supporting libraries
- **Developer-Friendly**: Comprehensive API documentation, clear code structure

## 📝 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token

### Documents
- `POST /api/v1/documents/upload` - Upload document
- `GET /api/v1/documents/` - List documents
- `GET /api/v1/documents/{id}` - Get document details

### Transactions
- `POST /api/v1/transactions/` - Create transaction
- `GET /api/v1/transactions/` - List transactions
- `PUT /api/v1/transactions/{id}/status` - Update transaction status

### Analytics
- `GET /api/v1/analytics/dashboard` - Get dashboard metrics
- `GET /api/v1/analytics/export` - Export compliance report

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Gauri Gulhane**
- GitHub: [@gaurigulhane](https://github.com/gaurigulhane)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by real-world trade finance workflows
- Designed for security and scalability

---

**Note**: This is a demonstration project. For production use, ensure proper security audits, use environment variables for secrets, and deploy with HTTPS.
