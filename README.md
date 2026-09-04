# Sahakarya (सहकार कर्मकार) — Cooperative Gig Platform (SIH26089)

> **Smart India Hackathon 2026** · **Ministry of Cooperation** · **Theme: Smart Automation**  
> *India's first worker-owned cooperative gig services platform ensuring 90% direct payouts, free healthcare, and AI-driven workforce allocation.*

---

## ⚡ Quick Start: Running on any machine

When cloning to a new system, follow these 3 simple steps:

### 1. Clone & Install
```bash
git clone https://github.com/Daz-ctrl/Gigs.git
cd Gigs
npm install
```

### 2. Set Environment Variables
```bash
# Windows PowerShell:
Copy-Item .env.example .env

# macOS / Linux:
cp .env.example .env
```

### 3. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

### 🤖 Optional: Start Python AI Radar Service (FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```��───────────────────┘      └─────────────────────────┘
```

---

## 5. Quick Start / Running Locally

### Prerequisites
- Node.js 18+ (Node v24 tested)
- Python 3.10+ (Python 3.14 tested)

### Step 1: Install Dependencies
```bash
# In project root:
npm install

# In ai-service directory:
python -m pip install -r ai-service/requirements.txt
```

### Step 2: Initialize Database
```bash
npx prisma db push
npm run prisma:seed   # Or: npx tsx prisma/seed.ts
```

### Step 3: Start AI Forecasting Microservice
```bash
cd ai-service
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### Step 4: Start Web Application
```bash
# In project root:
npm run dev
# Or production build:
npm run build && npm start
```
Open **`http://localhost:3000`** in your browser.

---

## 6. Demo Guide for Hackathon Evaluators

Use the **floating Demo Persona Switcher** at the top of the screen to test all roles without relogging:

1. **Customer Persona (Ananya Sharma)**:
   - Go to `/customer/book`.
   - Toggle "Emergency Dispatch" or filter by "Electrician" / "Zone 1 - South Delhi".
   - Click "Book Now" on Sunil Kumar → examine the **Fairness Meter breakdown** (90% worker, 7% welfare, 3% platform).
   - Click "Pay via UPI Sandbox & Book" → enjoy confetti burst and instant booking confirmation.
   - Go to `/customer/bookings` → view the booking, click "Invoice" for printable PDF receipt, or rate with 5 stars.

2. **Worker Persona (Sunil Kumar)**:
   - Go to `/worker/dashboard`.
   - Inspect the **Digital Worker ID Card** (click the flip button to view the back with PMSBY insurance policy ref).
   - Test the "On-Duty" availability switch.
   - Click "Mark Job Completed" on assigned booking → observe YTD earnings and Welfare Fund balance increment automatically.

3. **Society Admin Persona (Ramesh Patel)**:
   - Go to `/worker/register` and register a new applicant (e.g. "Deepak Yadav").
   - Switch persona to Society Admin and visit `/society/dashboard`.
   - Open the "Verification Queue" tab → click **"Verify & Issue Digital ID"** → observe worker verified with newly minted QR credential hash.

4. **Federation Admin Apex Persona (Dr. V. K. Kurien)**:
   - Visit `/federation/dashboard`.
   - Examine macro KPIs: Cumulative Wage Volume (`₹1.09 Cr`), Welfare Reserve (`₹3.24 Lakh`).
   - Interact with the **AI Workforce Allocation Copilot**: view real-time Random Forest predictions, weather impact triggers (Monsoon Rain in Zone 2), and click **"1-Click Rebalance"** to broadcast surge incentives.
