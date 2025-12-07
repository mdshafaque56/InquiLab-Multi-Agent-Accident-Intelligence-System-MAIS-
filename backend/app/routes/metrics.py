# backend/app/routes/metrics.py

from fastapi import APIRouter
from backend.app.agents.metrics_agent import metrics_agent

router = APIRouter(tags=["Metrics"])

@router.get("/metrics")
async def get_metrics():
    return metrics_agent.get_metrics()
