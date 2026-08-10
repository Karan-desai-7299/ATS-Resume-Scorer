# 🎯 ATS Resume Scorer & Job Matcher — PRO AI

An intelligent, full-stack AI platform designed to evaluate resumes against Applicant Tracking Systems (ATS) standards and Job Descriptions. Powered by **Groq LLaMA 3.3 70B LLM**, **spaCy NLP**, **RapidFuzz**, **FastAPI**, **React (Vite)**, and **Supabase Authentication**.

![Project Banner](https://img.shields.io/badge/ATS--Resume--Scorer-PRO%20AI-6366f1?style=for-the-badge&logo=target)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind--CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Deployed--on-Vercel-000000?style=for-the-badge&logo=vercel)

---

## 🌐 Live Application & Links

- **Frontend Application**: [https://frontend-react-ten-gamma.vercel.app](https://frontend-react-ten-gamma.vercel.app)
- **Backend API Server**: [https://ats-resume-scorer-backend.vercel.app](https://ats-resume-scorer-backend.vercel.app)
- **Interactive API Docs (Swagger)**: [https://ats-resume-scorer-backend.vercel.app/docs](https://ats-resume-scorer-backend.vercel.app/docs)
- **GitHub Repository**: [https://github.com/Karan-desai-7299/ATS-Resume-Scorer](https://github.com/Karan-desai-7299/ATS-Resume-Scorer)
- **Developer Portfolio**: [https://karansinh-portfolio.vercel.app](https://karansinh-portfolio.vercel.app)
- **LinkedIn Profile**: [https://www.linkedin.com/in/karansinh-desai/](https://www.linkedin.com/in/karansinh-desai/)

---

## ✨ Key Features

### 📄 1. Dual Analysis Modes
- **General ATS Audit**: Comprehensive breakdown of resume formatting, ATS compatibility, keyword density, section headers, contact privacy check, and skill validation.
- **JD Comparison Mode**: Compares resume text against target Job Descriptions, providing a **Semantic Similarity %**, **Matched Keywords**, **Missing Critical Keywords**, and **Skills Gap Analysis**.

### 🤖 2. Groq AI & spaCy NLP Engine
- Uses **Groq LLaMA-3.3-70B-Versatile** for ultra-fast, high-accuracy structured JSON extraction of skills, work experience, projects, and actionable ATS feedback.
- Lightweight **spaCy NLP** for entity recognition and privacy risk detection (detecting street addresses, PIN codes, and phone numbers).
- High-speed **RapidFuzz** fuzzy-matching engine for skill validation against project descriptions.

### 📊 3. Interactive Analytics & Scoring Dashboard
- **Overall ATS Score (0–100)** broken down across 5 weighted categories:
  - Formatting (20 pts)
  - Keywords (25 pts)
  - Content Quality (25 pts)
  - Skill Validation (15 pts)
  - ATS Compatibility (15 pts)
- **Actionable AI Recommendations** with impact severity badges (*High*, *Medium*, *Low*).
- **Skill-to-Project Cross Validation**: Validates whether listed skills actually appear in project or work experience descriptions.

### 📥 4. PDF Audit Report Export
- Generates beautiful, print-ready PDF reports summarizing ATS scores, skill gaps, matched keywords, and improvement tips using **ReportLab**.

### 🔐 5. Supabase Authentication & History Cloud Sync
- Google OAuth 2.0 & Email/Password Sign-In powered by Supabase Auth.
- Automatically saves analysis history to Supabase PostgreSQL database for logged-in users.
- Access past resume scans anytime under the **History** tab.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Dark glassmorphism theme, dynamic animations)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### **Backend**
- **Framework**: FastAPI (Python 3.10+)
- **AI Model**: Groq LLaMA 3.3 70B Versatile
- **NLP & Matching**: spaCy, RapidFuzz, NumPy
- **Document Parsing**: PyPDF2, pdfplumber, python-docx
- **PDF Generation**: ReportLab
- **Serverless Runtime**: Vercel Python Serverless Functions

### **Database & Authentication**
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (Google OAuth 2.0 + Email/Password JWT)

---

## 📁 Repository Structure

```
ATS-Resume-Scorer/
├── backend/                  # FastAPI Backend Application
│   ├── api/                  # API Routes & Auth Endpoints
│   │   ├── auth.py           # Supabase JWT Verification
│   │   └── routes.py         # /analyze-resume, /history, /generate-pdf
│   ├── core/                 # Configuration & App Settings
│   ├── database/             # Supabase DB Helper Functions
│   ├── models/               # Pydantic Schemas
│   ├── services/             # Core Business Logic
│   │   ├── ats_scorer.py     # ATS Scoring Engine
│   │   ├── feedback_engine.py# AI Issue Categorization & Summarization
│   │   ├── groq_parser.py    # Groq LLaMA 3.3 LLM Client
│   │   ├── jd_matcher.py     # Job Description Keyword & Gap Matcher
│   │   ├── pdf_export.py     # ReportLab PDF Export Generator
│   │   ├── report_generator.py # HTML Report Templates
│   │   ├── resume_analyzer.py # Full Pipeline Orchestrator
│   │   └── resume_parser.py  # PDF/DOCX Document Text Extractor
│   └── main.py               # FastAPI App Entrypoint
├── frontend-react/           # React Frontend Application
│   ├── src/
│   │   ├── api/              # Axios Client & API Services
│   │   ├── components/       # UI Components (Auth, Common, Dashboard)
│   │   ├── contexts/         # Auth Context Provider
│   │   ├── pages/            # Home, Scorer, History, Resources, About
│   │   └── routes/           # Protected & Public Application Routes
│   ├── package.json
│   └── vite.config.js
├── api/                      # Vercel Serverless Entrypoint
│   └── index.py
├── Dockerfile                # Multi-platform Container Configuration
├── railway.json              # Railway.app Deployment Blueprint
├── render.yaml               # Render.com Blueprint
├── vercel.json               # Vercel Deployment & Route Rewrites
├── requirements.txt          # Python Production Dependencies
└── README.md                 # Project Documentation
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/health` | Service health status | ❌ No |
| `POST` | `/api/v1/analyze-resume` | Analyzes PDF/DOCX resume & optional Job Description | ❌ Optional |
| `GET` | `/api/v1/history` | Fetches saved scan history for authenticated user | ✅ Yes (JWT) |
| `DELETE` | `/api/v1/history/{id}` | Deletes a saved scan record | ✅ Yes (JWT) |
| `POST` | `/api/v1/generate-pdf` | Generates downloadable PDF audit report | ❌ Optional |

---

## 🔑 Environment Variables Setup

### **Backend (`.env`)**
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=https://your-project.supabase.co/auth/v1/.well-known/jwks.json
CORS_ORIGINS=https://frontend-react-ten-gamma.vercel.app,http://localhost:5173
DISABLE_HEAVY_EMBEDDER=true
```

### **Frontend (`frontend-react/.env`)**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=https://ats-resume-scorer-backend.vercel.app/api/v1
```

---

## 💻 Local Development Setup

### **Prerequisites**
- Node.js (v18+)
- Python (3.10+)
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/Karan-desai-7299/ATS-Resume-Scorer.git
cd ATS-Resume-Scorer
```

### **2. Setup & Run Backend**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Run FastAPI server
uvicorn backend.main:app --reload --port 8000
```
Backend server will run at: `http://localhost:8000` (Docs: `http://localhost:8000/docs`)

### **3. Setup & Run Frontend**
```bash
cd frontend-react

# Install packages
npm install

# Start Vite development server
npm run dev
```
Frontend application will run at: `http://localhost:5173`

---

## 🚀 Deployment

The project is pre-configured for **1-click continuous deployment** on Vercel:

- **Frontend Deployment**: Connect `frontend-react` folder to Vercel. Set `VITE_API_BASE_URL` to your backend URL.
- **Backend Deployment**: Connect root repository to Vercel using `@vercel/python` (configured via `vercel.json` and `api/index.py`).

*(Also compatible with Render, Railway.app, Koyeb, and Docker deployments via included `Dockerfile`, `railway.json`, and `render.yaml`)*

---

## 👨‍💻 Developer & Author

**Karansinh Desai**  
*Full Stack & AI Developer*

- 🌐 **Portfolio**: [karansinh-portfolio.vercel.app](https://karansinh-portfolio.vercel.app)
- 💼 **LinkedIn**: [linkedin.com/in/karansinh-desai](https://www.linkedin.com/in/karansinh-desai/)
- 💻 **GitHub**: [@Karan-desai-7299](https://github.com/Karan-desai-7299)
- 📧 **Email**: karansinhdesai91@gmail.com

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
