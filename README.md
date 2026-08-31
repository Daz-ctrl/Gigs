# CoopServe — Cooperative Gig Services Platform (SIH26089)

> **Smart India Hackathon 2026** · **Ministry of Cooperation** · **Theme: Smart Automation**  
> *A worker-owned cooperative gig services marketplace ensuring transparent fair wages, collective social security, and AI-driven workforce allocation.*

---

## 1. Executive Summary

Private gig monopolies extract up to 30% commissions while denying gig workers healthcare, minimum wage protections, or job security. Meanwhile, India's **Labour Cooperative Federations and Societies** represent millions of verified skilled workers (electricians, plumbers, caregivers, HVAC technicians) but lack a modern digital storefront.

**CoopServe** bridges this divide by delivering a 3-sided marketplace coupled with an institutional governance hierarchy:
- **Workers** keep **90%** of every rupee earned, receive digital QR credentials with NSDC tiers, and build an automatic welfare/pension reserve.
- **Customers** discover verified, background-checked cooperative artisans within their locality, enjoy transparent pricing with zero surge exploitation, and verify identity via QR code on arrival.
- **Societies** manage local worker rosters, review onboarding applications, and audit disputes.
- **Federations** oversee multi-society analytics, enforce minimum wage floors, and deploy workers dynamically using our **AI Demand Forecasting Copilot**.

---

## 2. Key Differentiators & USPs

| # | Feature | CoopServe | Private Platforms (Urban Company, Housejoy) |
|---|---|---|---|
| 1 | **Fairness Meter (Primary USP)** | **90% direct to worker**, 7% to Member Welfare, 3% Ops | 70-75% to worker, **25-30% corporate extraction** |
| 2 | **Welfare & Social Security** | Mandatory group insurance (PMSBY) + in-house health pool | **0%** (Workers treated as expendable contractors) |
| 3 | **AI Allocation Copilot (Secondary USP)** | Random Forest regression model forecasting zone demand | Naive dispatch / predatory surge pricing |
| 4 | **Identity & Trust (Tertiary USP)** | Verifiable Digital QR Card + NSDC Level Certification | Basic badge with proprietary locked ratings |
| 5 | **Governance Architecture** | Federation → Society → Worker multi-tenant hierarchy | Centralized corporate black-box |

---

## 3. PRD Feature Traceability Matrix (SIH26089)

| PRD Req | Description | Status | Implementation Details |
|---|---|---|---|
| **FR1** | Service Provider Registration & Verification | **Fully Functional** | Multi-step onboarding, masked Aadhaar (UIDAI format), Society Admin verification queue at `/society/dashboard`. |
| **FR2** | Worker Skill Profiling & Certification | **Fully Functional** | Multi-trade tagging, NSDC/ITI certification uploads, dynamic experience and hourly wage inputs. |
| **FR3** | Customer Booking & Scheduling | **Fully Functional** | Interactive search, locality filtering, scheduled slots, immediate dispatch, and order tracking at `/customer/book`. |
| **FR4** | Geo-Location Based Service Matching | **Fully Functional** | Haversine distance matching engine (`src/lib/geo.ts`) ranking nearest certified artisans by kilometers. |
| **FR5** | Digital Payments & Invoicing | **Fully Functional (Sandbox)** | 90/7/3 transparent split calculation, simulated UPI drawer, auto-generated printable invoice with fairness audit breakdown. |
| **FR6** | Rating & Feedback with Audit Flags | **Fully Functional** | 5-star scoring with review tags. Ratings ≤ 2 stars automatically trigger an administrative audit alert for Society dispute handling. |
| **FR7** | Worker Welfare & Insurance Integration | **Functional (Stubbed API)** | API endpoint `POST /api/welfare` displaying active Pradhan Mantri Suraksha Bima Yojana (PMSBY) policy and health pool balance. |
| **FR8** | Emergency / On-Demand Booking | **Fully Functional** | One-click "Emergency Mode" toggle applying prioritized dispatch and instant worker notification. |
| **FR9** | Federation & Society Administration | **Fully Functional** | Multi-tenant dashboards: Society level (`/society/dashboard`) and Apex Federation level (`/federation/dashboard`). |
| **FR10** | Multilingual Mobile Application | **Fully Functional** | Persistent i18n switcher for **English**, **हिन्दी (Hindi)**, and **தமிழ் (Tamil)** across all user personas. |
| **FR11** | AI Demand Forecasting & Rebalancing | **Fully Functional** | Standalone Python FastAPI microservice running Scikit-Learn Random Forest Regressor (`ai-service/`), surfacing zone deficits and 1-Click Rebalance dispatching. |

---

## 4. System Architecture

```
                                  ┌─────────────────────────────────┐
                                  │      Client (Next.js 15 App)     │
                                  │   Tailwind CSS + Framer Motion  │
                                  └───────────────┬─────────────────┘
                                                  │
                                          HTTP REST API
                                                  │
                                  ┌───────────────▼─────────────────┐
                                  │       Next.js API Gateway       │
                                  │    (TypeScript Route Handlers)  │
                                  └───────┬─────────────────┬───────┘
                                          │                 │
                             Internal REST│                 │ Prisma ORM
                         (http://127.0.0.1:8000)            │
                                          │                 │
                 ┌────────────────────────▼────┐      ┌─────▼───────────────────┐
                 │  Python AI Microservice     │      │   Database Layer        │
                 │  - FastAPI + Uvicorn        │      │   - SQLite (Local Demo) │
                 │  - Scikit-Learn Random Forest│     │   - PostgreSQL (Prod)   │
                 │  - Seasonal Demand Model    │      │   - Haversine Geo Match │
                 └─────────────────────────────┘      └─────────────────────────┘
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
