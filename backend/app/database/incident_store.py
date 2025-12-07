# backend/app/database/incident_store.py
from typing import List, Dict

INCIDENTS: List[Dict] = []

def add_incident(incident: Dict):
    INCIDENTS.append(incident)
