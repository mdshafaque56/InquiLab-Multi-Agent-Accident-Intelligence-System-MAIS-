from fastapi import APIRouter

# from app.agents.communication_agent import CommunicationAgent
from backend.app.agents.communication_agent import CommunicationAgent


router = APIRouter(tags=["Alerts"])

communication_agent = CommunicationAgent()

@router.post("/alert/send")
async def send_alert(number: str, message: str):
    await communication_agent.send_whatsapp(number, message)
    return {"status": "sent", "number": number, "message": message}
