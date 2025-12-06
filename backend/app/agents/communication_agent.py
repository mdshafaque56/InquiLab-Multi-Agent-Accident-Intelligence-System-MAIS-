import asyncio
import requests

class CommunicationAgent:
    def __init__(self):
        pass

    async def notify_control_room(self, message: str):
        print(f"[CONTROL ROOM ALERT] {message}")

    async def send_sms(self, number: str, message: str):
        print(f"SMS to {number}: {message}")
        return True

    async def send_whatsapp(self, number: str, message: str):
        print(f"WhatsApp to {number}: {message}")
        return True

    async def send_emergency_broadcast(self, location: str):
        print(f"Broadcasting emergency alert at location: {location}")
        return True
