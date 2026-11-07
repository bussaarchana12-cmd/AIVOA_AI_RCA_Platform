# AIVOA.AI - Pharmaceutical Quality Intelligence Platform

> **Intelligent Quality. Evidence-Based Decisions.**  
> Advanced Root Cause Analysis (RCA) and Corrective & Preventive Actions (CAPA) Platform for Active Pharmaceutical Ingredient (API) Manufacturing.

---

## 1. Product Overview

AIVOA.AI is an enterprise-grade SaaS platform built for pharmaceutical quality assurance and quality control departments. It bridges unstructured manufacturing deviation reports (PDFs, HPLC chromatograms, SCADA logs, operator shift notes) and regulatory root cause investigations using a 9-node LangGraph causal workflow.

### Core Modules
1. **Executive Quality Dashboard**: Real-time KPI monitors, 6-month deviation & CAPA trends, risk severity distributions, and active deviation register.
2. **AI Document & Incident Intake**: Multi-modal intake supporting PDF upload (with PyMuPDF parsing simulation), pasted text, and email formats with real-time LangGraph node execution feedback.
3. **Automated RCA Form Population**: Extracts 18+ critical quality parameters (batch, deviation ref, stage, specification limits, observation, containment actions, equipment, raw materials) with individual field provenance tags (`AI Extracted`, `User Edited`, `Missing Information`, `Requires Verification`).
4. **Root Cause Analysis (RCA) Workspace**:
   - **Five Whys Ladder**: Connected recursive causal interrogation linking physical symptom to systemic root cause.
   - **Ishikawa 6M Fishbone Diagram**: Interactive branches for Man, Machine, Method, Material, Measurement, and Mother Nature.
   - **Root Cause Hypotheses Matrix**: Rigorous evidentiary appraisal showing supporting facts, contradictory data, and confidence scores.
5. **Evidence Dossier & Completeness Index**: ALCOA+ data integrity tracking for analytical reports, BMRs, and automation traces.
6. **CAPA Management**: Structured separation of Corrective Actions (remedial) and Preventive Actions (systemic barrier).
7. **Investigation History & Audit Trail**: Full search, filtering, and 21 CFR Part 11 compliant event history.
8. **AI Quality Intelligence Assistant**: Traceable recommendation engine allowing investigators to accept, reject, or edit recommendations.

---

## 2. Technology Stack

- **Frontend**: React 19, Redux Toolkit, Tailwind CSS v4, Lucide React, Motion.
- **Full-Stack Execution**: Node.js & Express server (`server.ts`) integrating Vite middleware and REST endpoints on port 3000.
- **Python / FastAPI Reference**: FastAPI, Pydantic, SQLAlchemy, LangGraph workflow architecture.
- **AI Engine**: Gemini 2.5 Flash / Groq Llama 3.3 70B integration with structured JSON schema enforcement.
- **Database**: PostgreSQL / Persistent local datastore (`data/pharmaceutical_db.json`).

---

## 3. LangGraph 9-Node Architecture

The AI engine executes a 9-node graph state machine:
- **Node 1: Input Ingestion & Preprocessing**: Cleans and validates incoming text/PDF payload.
- **Node 2: Incident Detail Extraction**: Parses batch number, product, API name, and stages.
- **Node 3: GMP Specification Validation**: Checks reported values against ICH Q3A/Q7 limits.
- **Node 4: Evidence Gap Analysis**: Identifies missing calibration records or analytical runs.
- **Node 5: Five Whys Ladder Generation**: Generates 5 connected why steps with evidence citations.
- **Node 6: Ishikawa Fishbone Categorization (6M)**: Maps potential factors across the 6 branches.
- **Node 7: Evidence-Grounded Hypotheses**: Evaluates supporting and contradictory findings.
- **Node 8: CAPA Recommendations**: Proposes corrective and preventive remediations with metrics.
- **Node 9: Structured Response Synthesis**: Returns validated JSON schema for instant UI population.

---

## 4. Getting Started

```bash
# Install dependencies
npm install

# Run the development server (runs full-stack on port 3000)
npm run dev

# Build for production
npm run build
```
