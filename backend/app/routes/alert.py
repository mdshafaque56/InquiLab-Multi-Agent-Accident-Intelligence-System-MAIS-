# backend/app/routes/alert.py
from fastapi import APIRouter
from backend.app.agents.communication_agent import CommunicationAgent

router = APIRouter(tags=["Alerts"])
comm = CommunicationAgent()

@router.post("/alert/send")
async def send_alert(number: str, message: str):
    await comm.send_whatsapp(number, message)
    return {"status": "sent", "number": number, "message": message}
