# backend/app/routes/incidents.py
from fastapi import APIRouter
from backend.app.database.incident_store import INCIDENTS

router = APIRouter(tags=["Incidents"])

@router.get("/incidents")
async def list_incidents():
    return {"incidents": INCIDENTS}
