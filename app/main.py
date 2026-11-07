from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import datetime

app = FastAPI(
    title="AIVOA.AI Quality Intelligence Engine",
    description="AI-Powered Root Cause Analysis (RCA) and CAPA Platform for Active Pharmaceutical Ingredient (API) Manufacturing",
    version="2.6.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AIVOA.AI FastAPI & LangGraph Backend",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.get("/api/dashboard/metrics")
def get_dashboard_metrics():
    return {
        "totalInvestigations": 4,
        "openInvestigations": 2,
        "underReviewInvestigations": 1,
        "completedInvestigations": 1,
        "pendingCapaActions": 3,
        "overdueCapaActions": 0,
        "statusDistribution": {
            "Under Review": 1,
            "In Progress": 1,
            "CAPA Execution": 1,
            "Closed": 1
        }
    }
